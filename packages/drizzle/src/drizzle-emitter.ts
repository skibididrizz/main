import { TypeScriptEmitter } from "./typescript-emitter.js";
import {
  ArrayBuilder,
  code,
  Context,
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
  Namespace,
  Program,
  Scalar,
  Type,
  Value,
} from "@typespec/compiler";
import { $id, $index, $map, $unique, $uuid } from "./decorators.js";
import {
  getMap,
  getRelation,
  getTableName,
  hasTable,
} from "./decorators-util.js";
import { Configuration, Dialect, FieldRef, IdRef } from "./types.js";
import { camelToSnake, capitalize } from "./string.js";
import { arrayOrUndefined } from "./array.js";
import { StateKeys } from "./lib.js";
import * as Dbs from "./db.js";
import { fromObjectBuilder } from "@skibididrizz/common";
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
  ["plainDate", "timestamp"],
  ["numeric", "numeric"],
]);

type StateKeyType = keyof typeof StateKeys;
export class DrizzleEmitter extends TypeScriptEmitter {
  // context is covered later in this document
  programContext(program: Program): Context {
    const sourceFile = this.emitter.createSourceFile("schema.ts");
    return {
      sourceFile,
      scope: sourceFile.globalScope,
    };
  }

  // namespaceContext(namespace: Namespace): Context {
  //   const ctx = this.programContext(this.program);
  //   let sourceFile = ctx.sourceFile
  //   const config = this.byNamespace("config", namespace) as Configuration;
  //   if (config && config.schema != sourceFile.path.split('/').pop()) {
  //     const name = config.schema ?? `${namespace.name}Schema.ts`;

  //     this.programContext(this.program).sourceFile
  //     ctx.scope.declarations.push(this.emitter.result.rawCode(code`export * from "./${name}";`));

  //     sourceFile = this.emitter.createSourceFile(name);

  //     return {
  //       sourceFile,
  //       scope: sourceFile.globalScope,
  //     };
  //   }
  //   return ctx;
  // }

  get program() {
    return this.emitter.getProgram();
  }
  state(decorator: StateKeyType, v: Type) {
    return this.program.stateMap(StateKeys[decorator]).get(v);
  }
  has(decorator: StateKeyType, v: Type) {
    return this.program.stateMap(StateKeys[decorator]).has(v);
  }
  byNamespace(decorator: StateKeyType, namespace?: Namespace): unknown {
    if (namespace) {
      return (
        this.program.stateMap(StateKeys[decorator]).get(namespace) ??
        this.byNamespace(decorator, namespace.namespace)
      );
    }
    return undefined;
  }

  getDb(namespace?: Namespace) {
    const config = this.byNamespace("config", namespace) as
      | Configuration
      | undefined;
    return new Dbs[config?.dialect ?? "postgres"](
      this.emitter.getContext().sourceFile.imports,
    );
  }

  modelDeclaration(model: Model, name: string) {
    if (!hasTable(this.program, model)) {
      return "";
    }
    const db = this.getDb(model.namespace);

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
        } else if (prop.model) {
          if (prop.model.name == prop.type.name) {
            const tableRef = db.table();

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
                `${db.type("foreignKey")}(${fromObjectBuilder(fkObj).reduce()})`,
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
              `one(${prop.type.name}Table, ${fromObjectBuilder(pkObj).reduce()})`,
            );
          }
        }
      } else if (prop.type.kind === "Scalar") {
        const index = this.state("index", prop) as
          | { name: string; sql?: string }
          | undefined;
        const isUnique = this.state("unique", prop) as boolean | undefined;
        if (index?.name) {
          const idxType = db.type(isUnique ? "uniqueIndex" : "index");
          this.addImport("drizzle-orm", index.sql ? "sql" : undefined);
          selfRef = selfRef || new ObjectBuilder();
          selfRef.set(
            index.name,
            `${idxType}("${camelToSnake(index.name)}")${index.sql ? `.on(${sql(index.sql)})` : `.on(table.${prop.name})`}`,
          );
        }
      }
    }

    if (relTo) {
      this.addImport("drizzle-orm", "relations");
    }

    //handle composite keys
    const primaryKey = this.state("id", model) as IdRef | undefined;
    if (primaryKey && primaryKey.fields) {
      const indexBuilder = new ObjectBuilder();
      if (primaryKey.name)
        indexBuilder.set("name", `"${camelToSnake(primaryKey.name)}"`);
      indexBuilder.set(
        "columns",
        `[${primaryKey.fields
          ?.map((v) => {
            if (!this.findModelPropertyByName(model, v)) {
              this.program.reportDiagnostic({
                message: `Field ${v} does not exist on model ${model.name} can not be used as a composite key.`,
                target: model,
                severity: "warning",
                code: "index-field-does-not-exist",
              });
            }
            return `table.${v}`;
          })
          .join(", ")}]`,
      );

      selfRef = selfRef ?? new ObjectBuilder();
      selfRef.set(
        `pk${capitalize(primaryKey.name ?? "")}`,
        `${db.type("primaryKey")}(${fromObjectBuilder(indexBuilder)})`,
      );
    }

    return this.emitter.result.declaration(
      tableName,
      code`
      ${this.doc(model)}
      export const ${name}Table = ${this.getDb(model.namespace).table()}('${tableName}', {
        ${this.emitter.emitModelProperties(model)}
      } ${selfRef ? code`,(table)=>(${fromObjectBuilder(selfRef)})` : ""});

      export export type ${name} = typeof ${name}Table.$inferSelect; // return type when queried 

      ${relTo ? `export const ${model.name}TableRelations = relations(${model.name}Table, ({${args.join(",")}})=>(${fromObjectBuilder(relTo).reduce()}))` : ""}      `,
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
        code: "only-model-properties-relationships",
        target: property,
        severity: "warning",
        message: "only model properties can have relationships",
      });
      return {
        name: undefined,
        fields: [] as ModelProperty[],
        references: [] as ModelProperty[],
      };
    }
    const relation = getRelation(this.program, property);
    const fields = arrayOrUndefined(relation?.fields)?.map((v) =>
      this.propertyFor(property.model, v),
    ) ?? [property];
    const references = arrayOrUndefined(
      arrayOrUndefined(relation?.references)?.map((v) => {
        return typeof v === "string" ? this.propertyFor(pType.name, v) : v;
      }),
    ) ?? [this.primaryKeyFor(pType)];

    const name = relation?.name ?? property.name;
    return {
      ...relation,
      name,
      fields: fields as ModelProperty[],
      references: references as ModelProperty[],
    };
  }

  typeToDrizzleDecl(property: ModelProperty, ref?: string) {
    const db = this.getDb(property.model?.namespace);
    const colName = ref ?? getMap(this.program, property);
    const typeSb = new StringBuilder();
    const id = this.state("id", property) as IdRef | undefined;
    const isUuid = this.has("uuid", property);
    const type = db.type(
      isUuid ? "uuid" : this.typeToDrizzle(property) ?? "unknown",
    );

    typeSb.push(`${type}('${colName}')`);
    if (isUuid) {
      //a uuid type that's an ID we will make random.
      if (id || this.state("uuid", property)) {
        typeSb.push(".defaultRandom()");
      }
    }

    if (id) {
      typeSb.push(".primaryKey()");
    } else {
      if (!property.optional) {
        typeSb.push(".notNull()");
      }
      if (this.state("unique", property) && !this.state("index", property)) {
        typeSb.push(".unique()");
      }

      const def = this.state("default", property);
      if (def) {
        if (typeof def === "string") {
          this.addImport("drizzle-orm", "sql");
          typeSb.push(`.default(${sql(def)})`);
        } else {
          typeSb.push(`.default(${def})`);
        }
      }
    }

    return typeSb;
  }

  typeToDrizzle(property: ModelProperty) {
    if (property.type.kind === "Scalar") {
      let type = intrensicToDrizzle.get(property.type.name);

      switch (property.type.name) {
        case "numeric": {
          if (this.state("id", property)) {
            return `serial`;
          }
          return type;
        }
        case "string": {
          const uid = this.state("uuid", property);
          if (uid) {
            return `uuid`;
          }
          return type;
        }
        default: {
          return type ?? property.type.name;
        }
      }
    }
  }

  fromValue(value: Value): string | undefined {
    // type Value = ScalarValue | NumericValue | StringValue | BooleanValue | ObjectValue | ArrayValue | EnumValue | NullValue;
    switch (value.valueKind) {
      case "StringValue":
        return JSON.stringify(value.value);
      case "BooleanValue":
        return value.value + "";
      case "NumericValue":
        return value.value + "";
      case "NullValue":
        return value.value + "";
      case "ArrayValue":
        return `[${value.values.map((v) => this.fromValue(v)).join(", ")}]`;
      case "ObjectValue":
        this.program.reportDiagnostic({
          code: "object-literals-not-allowed",
          target: value,
          severity: "error",
          message: "object literals are not allowed in drizzle",
        });
        return;
      case "EnumValue":
        return `${value.type}.${value.value.name}`;
    }
    return;
  }
  modelPropertyLiteral(property: ModelProperty): EmitterOutput<string> {
    const name = property.name;
    const program = this.emitter.getProgram();
    const colName = getMap(program, property);
    const typeSb = new StringBuilder();

    if (property.type.kind === "Scalar") {
      typeSb.push(this.typeToDrizzleDecl(property));
      if (property.defaultValue?.entityKind === "Value") {
        const value = this.fromValue(property.defaultValue);
        if (value != null) {
          typeSb.push(`.default(${value})`);
        }
      }
    } else if (property.type.kind === "Enum") {
      typeSb.push(`${property.type.name}Enum('${colName}')`);
    } else {
      this.program.reportDiagnostic({
        code: "unknown-literal",
        target: property,
        message: "unknown literal",
        severity: "error",
      });
      return "";
    }

    return this.emitter.result.rawCode(
      code`${this.doc(property)}${name}: ${typeSb}`,
    );
  }

  private modelFor(modelName: string | Model) {
    return typeof modelName == "string"
      ? this.program.getGlobalNamespaceType().models.get(modelName)
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
  private findModelPropertyByName(
    modelName: string | Model,
    propertyName: string,
  ): ModelProperty | undefined {
    return this.findModelPropertyBy(
      modelName,
      ({ name }) => name === propertyName,
    );
  }

  private primaryKeyFor(modelName: string | Model): ModelProperty | undefined {
    return this.findModelPropertyBy(modelName, ({ decorators }) =>
      decorators.some(({ decorator }) => decorator === $id),
    );
  }

  addImport(pkgName: string, ...decl: (string | undefined)[]) {
    const sourceFile = this.emitter.getContext().sourceFile;
    const impts = new Set(sourceFile.imports.get(pkgName) ?? []);
    decl.forEach((v) => v && impts.add(v));
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
    const db = this.getDb(en.namespace);
    const table = getTableName(this.program, en) ?? name;

    return this.emitter.result.declaration(
      `${en.name}Enum`,
      code`
      ${this.doc(en)}
      export const ${en.name}Enum = ${db.enum()}('${table}', [${Array.from(en.members.keys(), (v) => `'${v}'`).join(",")}]);
      `,
    );
  }
}

function isModel(v: Type): v is Model {
  return v.kind === "Model";
}

const sql = (v = "") => "sql`" + v.replaceAll("$", "$") + "`";
