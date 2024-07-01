import { TypeScriptEmitter } from "./typescript-emitter.js";
import {
  ArrayBuilder,
  code,
  EmitterOutput,
  ObjectBuilder,
  SourceFile,
  StringBuilder,
} from "@typespec/compiler/emitter-framework";
import {
  Enum,
  getDoc,
  Model,
  ModelProperty,
  Program,
  Scalar,
  Type,
} from "@typespec/compiler";
import {
  $id,
  $map,
  $unique,
  $uuid,
  getMap,
  getRelation,
  getTableName,
  hasTable,
} from "./decorators.js";
import { FieldRef, IdRef } from "./types.js";
import { camelToSnake, capitalize } from "./string.js";
import { arrayOrUndefined } from "./array.js";
import { StateKeys } from "./lib.js";
export const intrensicToDrizzle = new Map<string, string>([
  ["unknown", "jsonb"],
  ["string", "text"],
  ["int32", "integer"],
  ["int16", "integer"],
  ["int8", "integer"],
  ["int64", "integer"],
  ["float16", "float"],
  ["float32", "float"],
  ["float64", "float"],
  ["int64", "bigint"],
  ["boolean", "boolean"],
  ["null", "null"],
  ["Date", "timestamp"],
  ["numeric", "numeric"],
]);

export class DrizzleEmitter extends TypeScriptEmitter {
  private drizzleSchemaSourceFile?: SourceFile<string>;

  // context is covered later in this document
  programContext(program: Program) {
    const src = (this.drizzleSchemaSourceFile =
      this.emitter.createSourceFile("schema.ts"));
    const sourceFile = this.drizzleSchemaSourceFile;
    return {
      sourceFile,
      scope: sourceFile.globalScope,
    };
  }

  objectToString(obj: ObjectBuilder<any>) {
    const ret =
      Object.entries(obj).reduce((ret, [key, value]) => {
        return `${ret}  ${key}:${value},\n`;
      }, "{\n") + "}";
    return ret;
  }
  get program() {
    return this.emitter.getProgram();
  }
  state(decorator:keyof typeof StateKeys, v:Type){
    return this.program.stateMap(StateKeys[decorator]).get(v);
  }
  modelDeclaration(model: Model, name: string) {
    if (!hasTable(this.program, model)) {
      return "";
    }
    this.addDrizzleImport("pgTable");
    const tableName = getTableName(this.program, model) ?? name;
    let selfRef: ObjectBuilder<unknown> | undefined;
    let relTo: ObjectBuilder<unknown> | undefined;
    const args = [];

    for (const prop of model.properties.values()) {
      if (prop.type.kind === "Model") {
        if (prop.type.name === "Array" && prop.type.indexer?.value) {
          const arrType = prop.type.indexer?.value;
          if (arrType.kind === "Model") {
            relTo = relTo ?? new ObjectBuilder();
            relTo.set(prop.name, `many(${arrType.name}Table)`);
            args.push("many");
          }
        } else if (prop.model && prop.type.kind === "Model") {
          if (prop.model.name == prop.type.name) {
            const tableRef = "table";

            this.addDrizzleImport("foreignKey");
            const fkObj = new ObjectBuilder();
            const pk = this.primaryKeyFor(prop.type)?.name;
            fkObj.set("columns", `[${tableRef}.${prop.name}]`);
            fkObj.set("foreignColumns", `[${tableRef}.${pk ?? "_id"}]`);
            fkObj.set(
              "name",
              `"${tableRef}_${pk}__${tableName}_${prop.name}_fk"`.toLowerCase(),
            );
            selfRef ??
              (selfRef = new ObjectBuilder()).set(
                prop.name,
                `foreignKey(${this.objectToString(fkObj)})`,
              );
          } else {
            args.push("one");
            relTo = relTo ?? new ObjectBuilder();
            const pkObj = new ObjectBuilder();
            const relToResult = this.relationTo(prop);
            const fieldsArr = new ArrayBuilder();
            if (relToResult.name)
              pkObj.set("relationName", `'${relToResult.name}'`);

            fieldsArr.push(
              ...relToResult.fields.map((v) => {
                return `${v?.model?.name}Table.${v?.name}`;
              }),
            );
            pkObj.set("fields", `[${fieldsArr}]`);
            const referencesArr = new ArrayBuilder();
            referencesArr.push(
              ...relToResult.references.map((v) => {
                return `${v?.model?.name}Table.${v.name}`;
              }),
            );
            pkObj.set("references", `[${referencesArr}]`);
            relTo.set(
              prop.name,
              `one(${prop.type.name}Table, ${this.objectToString(pkObj)})`,
            );
          }
        } else {
          console.log("not handing primitives yet");
        }
      }
    }

    if (relTo) {
      this.addImport("drizzle-orm", "relations");
    }

    //handle composite keys
    const indexes = this.state('id', model) as IdRef | undefined;
    if (indexes && indexes.fields) {
        this.addDrizzleImport("pgIndex", "primaryKey");
        const indexBuilder = new ObjectBuilder();
        if (indexes.name)
          indexBuilder.set('name', `"${camelToSnake(indexes.name)}"`);
        indexBuilder.set('columns',`[${indexes.fields?.map((v) =>{
          if (!this.findModelPropertyByName(model, v)){
            this.program.reportDiagnostic({
              message: `Field ${v} does not exist on model ${model.name} can not be used as a composite key.`,
              target:model,
              severity:'warning',
              code: 'index-field-does-not-exist',
            });
          }
          return `table.${v}`
      }).join(", ")}]`);      

        selfRef = selfRef?? new ObjectBuilder();
        selfRef.set(`pk${capitalize(indexes.name ?? '')}`, `primaryKey(${this.objectToString(indexBuilder)})`);
    }

    return this.emitter.result.declaration(
      tableName,
      code`
      ${this.doc(model)}
      export const ${name}Table = pgTable('${tableName}', {
        ${this.emitter.emitModelProperties(model)}
      } ${selfRef ? code`,(table)=>(${this.objectToString(selfRef)})` : ""});
      export export type ${name} = typeof ${name}Table.$inferSelect; // return type when queried 
      ${relTo ? `export const ${model.name}TableRelations = relations(${model.name}Table, ({${args.join(",")}})=>(${this.objectToString(relTo)}))` : ""}
      `,
    );
  }

  modelProperties(model: Model) {
    const builder = new StringBuilder();

    for (const prop of model.properties.values()) {
      if (prop.type.kind === "Model") continue;
      builder.push(code`${this.emitter.emitModelProperty(prop)},`);
    }

    return this.emitter.result.rawCode(builder.reduce());
  }

  propertyFor(model: Model | undefined | null | string, propertyName: string) {
    return model
      ? this.modelFor(model)?.properties.get(propertyName)
      : undefined;
  }
  relationTo(property: ModelProperty) {
    const pType = property.type;
    if (!isModel(pType)) {
      this.program.reportDiagnostic({
        code:'only-model-properties-relationships',
        target:property,
        severity:'warning',
        message:'only model properties can have relationships',
      });
      return {
        name: undefined,
        fields: [] as ModelProperty[],
        references: [] as ModelProperty[],
      };
    }
    const relation = getRelation(this.program, property);
    const fields = arrayOrUndefined(relation?.fields)?.map((v) => this.propertyFor(property.model, v)) ?? [property];
    const references = arrayOrUndefined(arrayOrUndefined(relation?.references)?.map((v) => {
        return (typeof v === "string") ? this.propertyFor(pType.name, v) : v;
      })) ?? [this.primaryKeyFor(pType)];

    const name = relation?.name ?? property.name;
    return {
      ...relation,
      name,
      fields: fields as ModelProperty[],
      references: references as ModelProperty[],
    };
  }

  typeToDrizzleDecl(property: ModelProperty, ref?: string) {
    const colName = ref ?? getMap(this.program, property);
    const typeSb = new StringBuilder();
    const type = this.typeToDrizzle(property);
    if (type) this.addDrizzleImport(type);
    typeSb.push(`${type}('${colName}')`);
    if (hasDecorator(property, $id)) {
      if (type === "string") {
        typeSb.push(".defaultRandom()");
      }
      typeSb.push(".primaryKey()");
    } else {
      if (!property.optional) {
        typeSb.push(".notNull()");
      }
      if (hasDecorator(property, $unique)) {
        typeSb.push(".unique()");
      }
    }

    return typeSb;
  }

  typeToDrizzle(property: ModelProperty) {
    if (property.type.kind === "Scalar") {
      let type = intrensicToDrizzle.get(property.type.name);
      switch (property.type.name) {
        case "numeric": {
          if (hasDecorator(property, $id)) {
            return `serial`;
          }
          return type;
        }
        case "string": {
          const uid = property.decorators.find((v) => v.decorator === $uuid);
          return uid ? "uuid" : type;
        }
        default: {
          return type ?? property.type.name;
        }
      }
    }
  }

  modelPropertyLiteral(property: ModelProperty): EmitterOutput<string> {
    const name = property.name;
    const program = this.emitter.getProgram();
    const colName = getMap(program, property);
    const typeSb = new StringBuilder();
    if (property.type.kind === "Scalar") {
      typeSb.push(this.typeToDrizzleDecl(property));
    } else if (property.type.kind === "Enum") {
      typeSb.push(`${property.type.name}Enum('${colName}')`);
    } else {
      this.program.reportDiagnostic({ code: "unknown-literal", target: property, message: "unknown literal", severity: "error" });
      return '';
    }

    return this.emitter.result.rawCode(
      code`${this.doc(property)}${name}${property.optional ? "?" : ""}: ${typeSb}`,
    );
  }

  private modelFor(modelName: string | Model) {
    return typeof modelName == "string" ? this.program.getGlobalNamespaceType().models.get(modelName)
        : modelName;
  }
  
  private findModelPropertyBy(
    modelName: string | Model,
    check: (v: ModelProperty) => boolean,
  ): ModelProperty | undefined {
    const model = this.modelFor(modelName);
    if (!model) return;

    for (const property of model.properties.values()) {
      if (check(property)) {
        return property;
      }
    }
    if (model.baseModel) {
      return this.findModelPropertyBy(model.baseModel, check);
    }
  }
  private findModelPropertyByName(modelName: string | Model, propertyName: string): ModelProperty | undefined {
    return this.findModelPropertyBy(modelName, ({ name }) => name === propertyName);
  }

  private primaryKeyFor(modelName: string | Model): ModelProperty | undefined {
    return this.findModelPropertyBy(modelName, ({ decorators }) =>
      decorators.some(({ decorator }) => decorator === $id),
    );
  }

  addDrizzleImport(...decl: string[]) {
    if (!decl.length) {
      return this;
    }
    return this.addImport("drizzle-orm/pg-core", ...decl);
  }

  addImport(pkgName: string, ...decl: string[]) {
    const sourceFile = this.emitter.getContext().sourceFile;
    const impts = new Set(sourceFile.imports.get(pkgName) ?? []);
    decl.forEach((v) => impts.add(v));
    sourceFile?.imports.set(pkgName, [...impts]);
    return this;
  }

  modelLiteral(model: Model) {
    return "";
  }
  doc(t: Type) {
    const doc = getDoc(this.program, t);
    if (doc) {
      `/**
${doc
  .split("\n")
  .map((v) => ` * ${v}`)
  .join("\n")}      
**/
`;
    }
    return "";
  }

  enumDeclaration(en: Enum, name: string): EmitterOutput<string> {
    //Ignore enums in the drizzle namespace, cause they are for configuration.
    if (en.namespace?.name == "Drizzle") return "";
    this.addDrizzleImport("pgEnum");
    const table = getTableName(this.program, en) ?? name;

    return this.emitter.result.declaration(
      `${en.name}Enum`,
      code`
      ${this.doc(en)}
      export const ${en.name}Enum = pgEnum('${table}', [${Array.from(en.members.keys(), (v) => `'${v}'`).join(",")}]);
      `,
    );
  }
}

function isModel(v: Type): v is Model {
  return v.kind === "Model";
}

function isScalar(v: Type): v is Scalar {
  return v.kind === "Scalar";
}

function hasDecorator(property: ModelProperty | Model, d: unknown) {
  return property.decorators.find((v) => v.decorator == d);
}
