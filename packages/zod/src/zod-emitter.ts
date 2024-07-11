import {
  Enum,
  getDoc,
  getFormat,
  getMaxItems,
  getMaxLength,
  getMaxValue,
  getMaxValueExclusive,
  getMinItems,
  getMinLength,
  getMinValue,
  getMinValueExclusive,
  getPattern,
  Model,
  ModelProperty,
  Program,
  Type,
} from "@typespec/compiler";
import {
  AssetEmitter,
  code,
  CodeTypeEmitter,
  Context,
  EmittedSourceFile,
  EmitterOutput,
  ObjectBuilder,
  StringBuilder,
  SourceFile,
  ArrayBuilder,
} from "@typespec/compiler/emitter-framework";
import { StateKeys } from "./lib.js";
import * as prettier from "prettier";
import { fromArrayBuilder, fromObjectBuilder } from "@skibididrizz/common";
const typeSpecToZod = new Map([
  ["unknown", "unknown"],
  ["string", "string"],
  ["int32", "number"],
  ["int64", "number"],
  ["int16", "number"],
  ["int8", "number"],
  ["float16", "number().float"],
  ["float32", "number().float"],
  ["numeric", "number()"],
  ["int64", "bigint"],
  ["boolean", "boolean"],
  ["null", "null"],
  ["void", "unknown"],
]);

export class ZodEmitter extends CodeTypeEmitter {
  constructor(emitter: AssetEmitter<any, any>) {
    super(emitter);
  }
  get program() {
    return this.emitter.getProgram();
  }
  programContext(program: Program): Context {
    const sourceFile = this.emitter.createSourceFile("zod.ts");
    return {
      sourceFile,
      scope: sourceFile.globalScope,
    };
  }

  toDoc(type: Type) {
    const doc = getDoc(this.program, type);
    return doc
      ? `/** 
    ${doc.split("\n").map((v) => ` * ${v}`)} 
**/`
      : "";
  }
  has(type: Type, key: keyof typeof StateKeys) {
    return this.program.stateMap(StateKeys[key]).has(type);
  }
  get(type: Type, key: keyof typeof StateKeys) {
    return this.program.stateMap(StateKeys[key]).get(type);
  }

  enumDeclaration(en: Enum, name: string): EmitterOutput<string> {
    if (!this.has(en, "zod")) {
      return this.emitter.result.none();
    }

    const objBuilder = new ObjectBuilder();

    for (const [memberName, { value }] of en.members) {
      objBuilder.set(
        memberName,
        typeof value === "string"
          ? JSON.stringify(value)
          : value == null
            ? JSON.stringify(memberName)
            : value,
      );
    }
    const builder = new StringBuilder();
    builder.push("z.nativeEnum(");
    builder.pushStringBuilder(fromObjectBuilder(objBuilder));
    builder.push(")");
    return this.emitter.result.declaration(
      name,
      code`
${this.toDoc(en)}           
export const ${name} = ${builder};
export type ${name} = z.infer<typeof ${name}>;
`,
    );
  }
  modelDeclaration(model: Model, name: string): EmitterOutput<string> {
    if (!this.has(model, "zod")) {
      return this.emitter.result.none();
    }
    const brand = this.get(model, "brand");
    const brandStr = brand? `.brand<"${brand}">()` : "";
    return this.emitter.result.declaration(
      model.name,
      code`
${this.toDoc(model)}           
export const ${model.name} = ${this.modelProperties(model)}${brandStr};
export type ${model.name} = z.infer<typeof ${model.name}>;
            `,
    );
  }
  modelProperties(model: Model): EmitterOutput<string> {
    const objectBuilder = new ObjectBuilder();

    for (const [name, property] of model.properties) {
      objectBuilder.set(name, this.modelProperty(property));
    }
    const strBuilder = new StringBuilder();
    strBuilder.push(
      model.baseModel ? `${model.baseModel.name}.extend` : "z.shape",
    );
    strBuilder.push("(");
    strBuilder.pushStringBuilder(fromObjectBuilder(objectBuilder));
    strBuilder.push(")");
    return this.emitter.result.declaration(model.name, strBuilder);
  }

  typeToZod(type: Type) {
    const builder = new StringBuilder();
    switch (type.kind) {
      case "Enum": {
        builder.push(`z.lazy(()=>${type.name})`);
        break;
      }
      case "Union": {
        const union = new StringBuilder();
        union.push("z.union(");
        const arr = new ArrayBuilder();
        for (const v of type.variants.values()) {
          arr.push(this.typeToZod(v.type));
        }
        union.pushStringBuilder(fromArrayBuilder(arr));
        union.push(")");
        builder.pushStringBuilder(union);
        break;
      }
      case "Scalar": {
        const zodType = typeSpecToZod.get(type.name);

        if (zodType) {
          builder.push("z.");
          builder.push(zodType);
          builder.push("()");
        } else {
          this.program.reportDiagnostic({
            message: `Type  ${type.name} is unknown.`,
            target: type,
            severity: "warning",
            code: "unknown-type",
          });
        }
        break;
      }
      case "Model": {
        if (type.name === "Array") {
          const [arg] = type.templateMapper?.args ?? [];
          if (arg?.entityKind === "Type") {
            builder.pushStringBuilder(this.typeToZod(arg));
            builder.push(".array()");
          } else {
            this.program.reportDiagnostic({
              message: `Type  ${type.name} is unknown.`,
              target: type,
              severity: "warning",
              code: "unknown-type",
            });
          }
        } else {
          builder.push(`z.lazy(()=>${type.name})`);
        }
        break;
      }
      default: {
        this.program.reportDiagnostic({
          message: `Type  ${type.kind} is unknown.`,
          target: type,
          severity: "warning",
          code: "unknown-type",
        });
      }
    }

    return builder;
  }
  modelProperty(property: ModelProperty): EmitterOutput<string> {
    const builder = this.typeToZod(property.type);
    if (property.optional) {
      builder.push(".optional()");
    }
    const doc = getDoc(this.program, property);
    const validations: Record<string, string | undefined> = {};
    const program = this.program;

    if (property.type.kind === "Scalar") {
      if (property.type.name === "string") {
        validations.min = asString(getMinLength(program, property));
        validations.max = asString(getMaxLength(program, property));
        validations.regex = asRegex(getPattern(program, property));
        const format = getFormat(program, property);
        if (format) validations[format] = "";
      } else if (property.type.name === "Number") {
        validations.gt = asString(getMinValue(program, property));
        validations.lt = asString(getMaxValue(program, property));
        validations.gte = asString(getMaxValueExclusive(program, property));
        validations.gte = asString(getMinValueExclusive(program, property));
      }
    } else if (
      property.type.kind === "Model" &&
      property.type.name === "Array"
    ) {
      validations.min = asString(getMinItems(program, property));
      validations.max = asString(getMaxItems(program, property));
    }

    for (const [key, value] of Object.entries(validations)) {
      if (value != null) {
        builder.push(`.${key}(${value})`);
      }
    }
    if (doc){
      builder.push(`.describe(${JSON.stringify(doc)})`);
    }
    return builder;
  }

  async sourceFile(sourceFile: SourceFile<string>): Promise<EmittedSourceFile> {
    const emittedSourceFile: EmittedSourceFile = {
      path: sourceFile.path,
      contents: "import * as z from 'zod';\n",
    };

    for (const [importPath, typeNames] of sourceFile.imports) {
      emittedSourceFile.contents += `import {${[...new Set(typeNames)].join(",")}} from "${importPath}";\n`;
    }

    for (const decl of sourceFile.globalScope.declarations) {
      emittedSourceFile.contents += decl.value + "\n";
    }

    try {
      emittedSourceFile.contents = await prettier.format(
        emittedSourceFile.contents,
        {
          parser: "typescript",
        },
      );
    } catch (e) {
      console.log(emittedSourceFile.contents);
      throw e;
    }

    return emittedSourceFile;
  }
}

function asString(v: unknown): string | undefined {
  if (v == null) return undefined;
  if (typeof v === "string") {
    return v;
  }
  return String(v);
}
function asRegex(v: unknown): string | undefined {
  if (v == null) return undefined;
  if (typeof v === "string") {
    return `/${v}/`;
  }
  return JSON.stringify(String(v));
}
