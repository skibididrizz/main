import { Diagnostic, formatTypeSpec } from "@typespec/compiler";
import {
  createTestHost,
  createTestWrapper,
  TypeSpecTestLibrary,
} from "@typespec/compiler/testing";
import ts from "typescript";
import { resolve } from "node:path";
import { expect, assert } from "vitest";

const niceString = (v: string) =>
  v.replaceAll(/\\n/g, "\n").replaceAll("`", "`").replaceAll("$", "$");

const serialize = (v: unknown) =>
  v == null
    ? null
    : typeof v == "string"
      ? niceString(v)
      : typeof v == "object"
        ? Object.entries(v)
            .map(([k, v]) => `//file: ${k}\n${niceString(v)}`)
            .join("\n\n")
        : JSON.stringify(v);

expect.addSnapshotSerializer({
  serialize(val, config, indentation, depth, refs, printer) {
    // `printer` is a function that serializes a value using existing plugins.
    return printer(val, config, indentation, depth, refs);
  },
  test(val) {
    return val && Object.prototype.hasOwnProperty.call(val, "foo");
  },
});

function snakeToPascal(p = "") {
  return p
    .split("-")
    .map((s) => s[0].toUpperCase() + s.slice(1))
    .join("");
}
export class SkibididrizzTestContext {
  constructor(
    library: TypeSpecTestLibrary,
    autoUsings: string[] = [snakeToPascal(library.name.split("/").pop())],
    autoImports: string[] = [library.name],
    private readonly target = library.name,
    createHost = () => createTestHost({ libraries: [library] }),
    private readonly wrapper = async () =>
      createTestWrapper(await createHost(), {
        autoImports,
        autoUsings,
        compilerOptions: {
          outputDir: "./tsp-output",
          noEmit: false,
          emit: [target],
        },
      }),
  ) {}

  async emitWithDiagnostics(
    code: string,
  ): Promise<[Record<string, string>, readonly Diagnostic[]]> {
    const runner = await this.wrapper();
    const ret = await runner.compileAndDiagnose(code, {
      outputDir: "./tsp-output",
      noEmit: false,
      emit: [this.target],
    });
    const outputDir = `/test/tsp-output/${this.target}`;
    const files = await runner.program.host.readDir(outputDir);

    const result: Record<string, string> = {};
    for (const file of files) {
      result[file] = (
        await runner.program.host.readFile(`${outputDir}/${file}`)
      ).text;
    }
    return [result, runner.program.diagnostics];
  }

  async _snapshotEmittedTypescript(
    code: string,
  ): Promise<[Record<string, string>, readonly Diagnostic[]]> {
    const [result, diags] = await this.emitWithDiagnostics(code);
    let warnings = "";
    for (const diag of diags) {
      warnings = `${warnings}${diag.message} ${diag.code} \n`;
    }
    assert.ok(
      diags.length == 0,
      `Should not have diagnostics (but does):\n${warnings}\ncode:\n${code}\n typescript:\n${serialize(
        result,
      )}\n`,
    );
    const tsDiags = compileTs(result);
    assert.ok(
      tsDiags.length == 0,
      `Should not have typescript diagnostics (but does):\n ${code}\n typescript:\n${serialize(
        result,
      )}\n`,
    );

    return [result, diags?.length ? diags : compileTs(result)];
  }
  async snapshotEmittedTypescript(
    code: string,
  ): Promise<[Record<string, string>, readonly Diagnostic[]]> {
    const [result, diags] = await this._snapshotEmittedTypescript(code);
    expect(code).toMatchSnapshot();
    expect(result).toMatchSnapshot();
    return [result, diags];
  }

  async emitExample( doc: string, code: string) {
    expect(doc).toMatchSnapshot();
    await this.snapshotEmittedTypescript( code);
  }
  async emitExampleFile(
    fileName: string,
    doc: string,
    code: string,
  ) {

    const formattedCode = await formatTypeSpec(code);
    const site = resolve(require.resolve("@skibididrizz/site/package.json"), "..");
    const [result] = await this._snapshotEmittedTypescript( code);
    expect(`
${doc}

\`\`\`tsp
${formattedCode}
\`\`\`

${Object.entries(result)
  .map(([k, v]) => `## ${k}\n\`\`\`tsx\n${v}\`\`\``)
  .join("\n\n")}
         
`).toMatchFileSnapshot(`${site}/${fileName}`);
  }
}

function compileTs(source: Record<string, string>): Diagnostic[] {
  const host = ts.createCompilerHost({
    noEmit: true,
  });

  const createdFiles = new Map<string, string>();

  const oReadFile = host.readFile;
  host.writeFile = (fileName: string, contents: string) =>
    createdFiles.set(fileName, contents);
  host.readFile = (fileName: string) =>
    source[fileName] ?? oReadFile.call(host, fileName);

  const program = ts.createProgram(
    [...createdFiles.keys()],
    {
      useDefineForClassFields: true,
      target: ts.ScriptTarget.ES2023,
      rootDir: ".",
      outDir: "dist",
      skipLibCheck: true,
      module: ts.ModuleKind.NodeNext,
      moduleResolution: ts.ModuleResolutionKind.NodeNext,
    },
    host,
  );
  const emitResult = program.emit();
  const allDiagnostics = ts
    .getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics);

  return allDiagnostics.map((diagnostic) => {
    const { line, character } = ts.getLineAndCharacterOfPosition(
      diagnostic.file!,
      diagnostic.start!,
    );

    //return `${ret}\n${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`;
    const ret: Diagnostic = {
      code: diagnostic.code + "",
      severity: "error",
      message: ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"),
      target: {
        pos: diagnostic.start ?? 0,
        end: diagnostic.length ?? 0,
        file: {
          path: diagnostic.file?.fileName!,
          text: diagnostic.file?.text ?? "",
          getLineStarts() {
            return diagnostic.file?.getLineStarts() ?? [line, character];
          },
          getLineAndCharacterOfPosition() {
            return { line, character };
          },
        },
      },
    };

    return ret;
  });
}
