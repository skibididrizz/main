import { Diagnostic, Program, resolvePath } from "@typespec/compiler";
import {
  createTestHost,
  createTestWrapper,
  expectDiagnosticEmpty,
} from "@typespec/compiler/testing";
import { ZodTestLibrary } from "../src/testing/index.js";
import { TestContext } from "node:test";
import * as ts from "typescript";
import { resolve } from "node:path";

//@ts-expect-error - not officially supported yet.
import { snapshot } from "node:test";
const niceString = (v: string) => v.replace(/\/\/.*\n/g, "");
snapshot.setDefaultSnapshotSerializers([
  (v: unknown) =>
    v == null
      ? null
      : typeof v == "string"
        ? niceString(v)
        : typeof v == "object"
          ? Object.entries(v)
              .map(([k, v]) => `//file: ${k}\n${niceString(v)}`)
              .join("\n\n")
          : JSON.stringify(v),
]);
snapshot.setResolveSnapshotPath((path: string) => {
  return `${path.replace(/\.[jt]s$/, "")}.snapshot.cjs`;
});

const COMPILER_OPTIONS = {
  outputDir: "./tsp-output",
  noEmit: false,
  emit: ["@skibididrizz/zod"],
};
const outputDir = "/test/tsp-output/@skibididrizz/zod";

export async function createZodTestHost() {
  return createTestHost({
    libraries: [ZodTestLibrary],
  });
}

export async function createZodTestRunner() {
  const host = await createZodTestHost();

  return createTestWrapper(host, {
    autoImports: ["@skibididrizz/zod"],
    autoUsings: ["Zod"],
    compilerOptions: COMPILER_OPTIONS,
  });
}

export async function emitWithDiagnostics(
  code: string,
): Promise<[Record<string, string>, readonly Diagnostic[]]> {
  const runner = await createZodTestRunner();
  await runner.compileAndDiagnose(code, COMPILER_OPTIONS);

  const files = await runner.program.host.readDir(outputDir);

  const result: Record<string, string> = {};
  for (const file of files) {
    result[file] = (
      await runner.program.host.readFile(resolvePath(outputDir, file))
    ).text;
  }
  return [result, runner.program.diagnostics];
}

export async function emitExample(t: TestContext, doc: string, code: string) {
  //@ts-expect-error
  t.assert.snapshot(doc);
  await snapshotEmittedTypescript(t, code);
}

export async function emit(code: string): Promise<Record<string, string>> {
  const [result, diagnostics] = await emitWithDiagnostics(code);
  expectDiagnosticEmpty(diagnostics);
  return result;
}

export async function snapshotEmittedTypescript(
  t: TestContext,
  code: string,
): Promise<[Record<string, string>, readonly Diagnostic[]]> {
  const [result, diags] = await emitWithDiagnostics(code);
  for (const diag of diags) {
    console.log(`${diag.message} ${diag.code} `);
  }
  //@ts-expect-error - these will exist when they come out of experimental
  t.assert.ok(diags.length == 0, "Should not have diagnostics (but does)");
  //@ts-expect-error
  t.assert.snapshot(code);
  //@ts-expect-error
  t.assert.snapshot(result);

  return [result, diags?.length ? diags : await compileTs(result)];
}

function compileTs(source: Record<string, string>): Promise<Diagnostic[]> {
  const host = ts.createCompilerHost({
    noEmit: true,
  });

  const createdFiles: Record<string, string> = {};

  const oReadFile = host.readFile;
  host.writeFile = (fileName: string, contents: string) =>
    (createdFiles[fileName] = contents);
  host.readFile = (fileName: string) => {
    return source[fileName] ?? oReadFile.call(host, fileName);
  };
  const program = ts.createProgram(
    Object.keys(source),
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

  return Promise.all(
    allDiagnostics.map(async (diagnostic) => {
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
    }),
  );
}
