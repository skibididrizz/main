import { Diagnostic, resolvePath } from "@typespec/compiler";
import {
  createTestHost,
  createTestWrapper,
  expectDiagnosticEmpty,
} from "@typespec/compiler/testing";
import * as ts from "typescript";

import { DrizzleTestLibrary } from "../src/testing/index.js";
import assert from 'node:assert';

const COMPILER_OPTIONS = {
  outputDir:'./tsp-output',
  noEmit:false,
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
    compilerOptions: COMPILER_OPTIONS
  });
}


export async function emitWithDiagnostics(
  code: string,
): Promise<[string|undefined, readonly Diagnostic[], unknown?]> {
  const runner = await createDrizzleTestRunner();
  try {
  await runner.compileAndDiagnose(code, COMPILER_OPTIONS);
  }catch(e){
    console.trace(e);
    throw e;
  }
  try {
  const f = await runner.program.host.readFile("/test/tsp-output/@skibididrizz/drizzle/schema.ts");

  return [f.text, runner.program.diagnostics];
  }catch(e){
    return [undefined, runner.program.diagnostics, e];
  }
}


export async function debugWithDiagnostics(
  code: string,
): Promise<[string, readonly Diagnostic[]]> {

  const [result = '', diags] = await emitWithDiagnostics(code);
  console.log(code);
  console.log(result);
  for(const diag of diags){
    console.log(`${diag.message} ${diag.code} `)
  }
  const tsResult = await compile(result, {});
  assert(tsResult, 'successfully compiled.');
  return [result, diags];
}

export async function emit(code: string): Promise<string> {
  const [result, diagnostics] = await emitWithDiagnostics(code);
  expectDiagnosticEmpty(diagnostics);
  return result ?? '';
}


async function compile(source:string, options: ts.CompilerOptions = {}) {
  const result =  
  await ts.transpileModule(source, { compilerOptions: { ...options, module: ts.ModuleKind.CommonJS }});
  if (result?.diagnostics?.length ) {
    console.log(result.diagnostics);
    return false;
  }
  return true;
}