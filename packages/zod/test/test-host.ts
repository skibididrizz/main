import { Diagnostic, resolvePath } from "@typespec/compiler";
import {
  createTestHost,
  createTestWrapper,
  expectDiagnosticEmpty,
} from "@typespec/compiler/testing";
import { ZodTestLibrary } from "../src/testing/index.js";
import { TestContext } from "node:test";
import * as ts from "typescript";
//@ts-expect-error - not officially supported yet.
import { snapshot } from "node:test";
const niceString = (v:string)=> v.replace(/\/\/.*\n/g, "")
snapshot.setDefaultSnapshotSerializers([
  (v: unknown) =>
    v == null ? null :
    typeof v == "string" ? niceString(v) : 
  
 typeof v == 'object' ? Object.entries(v).map(([k, v]) => `//file: ${k}\n${niceString(v)}`).join('\n\n') : JSON.stringify(v) 
])
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

  return [result, diags];
}

function compileTs(source: Record<string, string>) {
  const host = ts.createCompilerHost({
    noEmit: true,
  });

  const createdFiles: Record<string, string> = {};

  host.writeFile = (fileName: string, contents: string) =>
    (createdFiles[fileName] = contents);
  host.readFile = (fileName: string) => source[fileName];

  const program = ts.createProgram(Object.keys(source), {}, host);
  const emitResult = program.emit();

  const allDiagnostics = ts
    .getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics);

  return allDiagnostics?.length
    ? allDiagnostics.reduce((ret, diagnostic) => {
        if (diagnostic.file) {
          const { line, character } = ts.getLineAndCharacterOfPosition(
            diagnostic.file,
            diagnostic.start!,
          );
          const message = ts.flattenDiagnosticMessageText(
            diagnostic.messageText,
            "\n",
          );
          return `${ret}\n${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`;
        } else {
          return `${ret}\n${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`;
        }
      }, "")
    : undefined;
}
