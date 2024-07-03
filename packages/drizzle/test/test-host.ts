import { Diagnostic, resolvePath } from "@typespec/compiler";
import {
  createTestHost,
  createTestWrapper,
  expectDiagnosticEmpty,
} from "@typespec/compiler/testing";
import * as ts from "typescript";

import { DrizzleTestLibrary } from "../src/testing/index.js";
import assert from "node:assert";
import type { TestContext } from "node:test";
//@ts-expect-error - not officially supported yet.
import { snapshot } from "node:test";

snapshot.setDefaultSnapshotSerializers([
  (v: unknown) =>
    typeof v == "string" ? v.replace(/\/\/.*\n/g, "") : JSON.stringify(v),
]);

const COMPILER_OPTIONS = {
  outputDir: "./tsp-output",
  noEmit: false,
  emit: ["drizzle"],
};

export async function createDrizzleTestHost() {
  return createTestHost({
    libraries: [DrizzleTestLibrary],
  });
}

export async function createDrizzleTestRunner() {
  const host = await createDrizzleTestHost();

  return createTestWrapper(host, {
    autoUsings: ["Drizzle"],
    compilerOptions: COMPILER_OPTIONS,
  });
}

export async function emitWithDiagnostics(
  code: string,
): Promise<[string | undefined, readonly Diagnostic[], unknown?]> {
  const runner = await createDrizzleTestRunner();
  try {
    await runner.compileAndDiagnose(code, COMPILER_OPTIONS);
  } catch (e) {
    console.trace(e);
    throw e;
  }
  try {
    const f = await runner.program.host.readFile(
      "/test/tsp-output/@skibididrizz/drizzle/schema.ts",
    );

    return [f.text, runner.program.diagnostics];
  } catch (e) {
    return [undefined, runner.program.diagnostics, e];
  }
}

export async function snapshotEmittedTypescript(
  t: TestContext,
  code: string,
): Promise<[string, readonly Diagnostic[]]> {
  const [result = "", diags] = await emitWithDiagnostics(code);

  for (const diag of diags) {
    console.log(`${diag.message} ${diag.code} `);
  }
  const tsResult = await compile(result, {});
  //@ts-expect-error
  t.assert.ok(tsResult, "successfully compiled.");
  //@ts-expect-error
  t.assert.snapshot(result);
  return [result, diags];
}

export async function exampleEmittedTypescript(
  t: TestContext,
  code: string,
): Promise<void> {
  const [result = "", diags] = await emitWithDiagnostics(code);

  for (const diag of diags) {
    console.log(`${diag.message} ${diag.code} `);
  }
  //@ts-expect-error
  t.assert.ok(diags.length == 0, "no diagnostics.");
  const tsResult = await compile(result, {});
  //@ts-expect-error
  t.assert.ok(tsResult, "successfully compiled.");
  //@ts-expect-error
  t.assert.snapshot(code);
  //@ts-expect-error
  t.assert.snapshot(result);

}

export async function emit(code: string): Promise<string> {
  const [result, diagnostics] = await emitWithDiagnostics(code);
  expectDiagnosticEmpty(diagnostics);
  return result ?? "";
}

async function compile(source: string, options: ts.CompilerOptions = {}) {
  const result = await ts.transpileModule(source, {
    compilerOptions: { ...options, module: ts.ModuleKind.CommonJS },
  });
  if (result?.diagnostics?.length) {
    console.log(result.diagnostics);
    return false;
  }
  return true;
}
