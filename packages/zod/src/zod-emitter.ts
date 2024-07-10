import {
  Enum,
  getDoc,
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
import { ObjectBuilderExt } from "@skibididrizz/common";

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
    const builder = new StringBuilder();

    const objBuilder = new ObjectBuilderExt();
    builder.push("z.nativeEnum(");

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
    builder.push(objBuilder.toStringBuilder());
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

    return this.emitter.result.declaration(
      model.name,
      code`
${this.toDoc(model)}           
export const ${model.name} = ${this.modelProperties(model)};
export type ${model.name} = z.infer<typeof ${model.name}>;

            `,
    );
  }
  modelProperties(model: Model): EmitterOutput<string> {
    const properties = model.properties;

    const objectBuilder = new ObjectBuilderExt();
    for (const [name, property] of properties) {
      objectBuilder.set(name, this.modelProperty(property));
    }
    let objStr = model.baseModel ? "extend" : "z.shape";
    if (model.baseModel) {
      objStr = `${model.baseModel.name}.extend`;
    }

    return this.emitter.result.declaration(
      model.name,
      code`
      ${objStr}(${objectBuilder.toStringBuilder()})})
      `,
    );
  }


  typeToZod(type: Type) {
    const builder = new StringBuilder();
    switch (type.kind) {
      case "Enum": {
        builder.push(`z.lazy(()=>${type.name})`);
        break;
      }
      case "Union": {
        builder.push("z.union([");
        const arr = new ArrayBuilder();
        Array.from(type.variants.values(), (v) =>
          arr.push(this.typeToZod(v.type).reduce()),
        );
        builder.push(arr.join(","));
        builder.push("])");
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
          const args = type.templateMapper?.args;
          if (args && args.length === 1) {
            const arg = args[0];
            if (arg.entityKind === "Type") {
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
            break;
          }
        }
        builder.push(`z.lazy(()=>${type.name})`);
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
      builder.push(".nullable()");
    }
    return builder.reduce();
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

    emittedSourceFile.contents = await prettier.format(
      emittedSourceFile.contents,
      {
        parser: "typescript",
      },
    );

    return emittedSourceFile;
  }
}
