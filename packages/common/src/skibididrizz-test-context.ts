import { Diagnostic } from "@typespec/compiler";
import {  createTestHost, createTestWrapper,  TypeSpecTestLibrary } from "@typespec/compiler/testing";
import type {TestContext} from "node:test";
import  ts from "typescript";
import test from "node:test";
const niceString = (v: string) => v.replace(/\/\/.*\n/g, "");

const serialize =  (v: unknown) =>
  v == null
    ? null
    : typeof v == "string"
      ? niceString(v)
      : typeof v == "object"
        ? Object.entries(v)
            .map(([k, v]) => `//file: ${k}\n${niceString(v)}`)
            .join("\n\n")
        : JSON.stringify(v);
(test as any).snapshot?.setDefaultSnapshotSerializers([serialize]);


(test as any).snapshot?.setResolveSnapshotPath((path: string) =>  path.replace(/\.[jt]s$/, '.snapshot.cjs'));

function snakeToPascal(p=''){
    return p.split("-").map(s => s[0].toUpperCase() + s.slice(1)).join("");
}
export class SkibididrizzTestContext {
    constructor(
        library:TypeSpecTestLibrary, 
        autoUsings:string[] = [snakeToPascal(library.name.split("/").pop())],
        autoImports:string[] = [library.name],
        private readonly target = library.name,
        createHost = ()=> createTestHost({ libraries: [library]  }),
        private readonly wrapper = async ()=>createTestWrapper(await createHost(), {
                autoImports,
                autoUsings,
                 compilerOptions: {
            outputDir: "./tsp-output",
            noEmit: false,
            emit: [target],
        },
      })
    
    ) {
    }

    async emitWithDiagnostics(
        code: string,
      ): Promise<[Record<string, string>, readonly Diagnostic[]]> {
        const runner = await this.wrapper();
        const ret = await runner.compileAndDiagnose(code, {
            outputDir: "./tsp-output",
            noEmit: false,
            emit: [this.target],
        });
        const outputDir = `/test/tsp-output/${this.target}`
        const files = await runner.program.host.readDir(outputDir);
      
        const result: Record<string, string> = {};
        for (const file of files) {
          result[file] = (
            await runner.program.host.readFile(`${outputDir}/${file}`)
          ).text;
        }
        return [result, runner.program.diagnostics];
      
      }
    

      async snapshotEmittedTypescript(
        t: TestContext,
        code: string,
      ): Promise<[Record<string, string>, readonly Diagnostic[]]> {
        const [result, diags] = await this.emitWithDiagnostics(code);
        let warnings = '';
        for (const diag of diags) {
          warnings = `${warnings}${diag.message} ${diag.code} \n`;
        }
        t.assert.ok(diags.length == 0, `Should not have diagnostics (but does):\n${warnings}\ncode:\n${code}\n typescript:\n${
          serialize(result)
        }\n`);
        const tsDiags = compileTs(result);
        t.assert.ok(tsDiags.length == 0, `Should not have typescript diagnostics (but does):\n ${code}\n typescript:\n${
          serialize(result)
        }\n`);
        t.assert.snapshot(code);
        t.assert.snapshot(result);
      

        return [result, diags?.length ? diags :  compileTs(result)];
      }

       async  emitExample(t: TestContext, doc: string, code: string) {
        t.assert.snapshot(doc);
        await this.snapshotEmittedTypescript(t, code);
        
      }
    
}

  
  function compileTs(source: Record<string, string>): Diagnostic[] {
    const host = ts.createCompilerHost({
      noEmit: true,

    });
  
    const createdFiles = new Map<string, string>();
  
    const oReadFile = host.readFile;
    host.writeFile = (fileName: string, contents: string) =>createdFiles.set(fileName, contents);
    host.readFile = (fileName: string) => source[fileName] ?? oReadFile.call(host, fileName);
  
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
  
    return allDiagnostics.map( (diagnostic) => {
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
  