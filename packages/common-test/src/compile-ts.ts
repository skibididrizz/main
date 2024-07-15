import { Diagnostic } from "@typespec/compiler";
import ts from 'typescript';

export async function compileTs(source: Record<string, string>,
  tsConfig: ts.CompilerOptions = {
    useDefineForClassFields: true,
    target: ts.ScriptTarget.ES2023,
    rootDir: '.',
    outDir: "dist",
    skipLibCheck: true,
    module: ts.ModuleKind.NodeNext,
    moduleResolution: ts.ModuleResolutionKind.NodeNext,
  }
): Promise<Diagnostic[] | undefined> {
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
    const program = ts.createProgram(Object.keys(source), tsConfig, host);
    const emitResult = program.emit();
    const allDiagnostics = ts
      .getPreEmitDiagnostics(program)
      .concat(emitResult.diagnostics);
  
    return allDiagnostics?.length ? Promise.all(
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
    ) : undefined;
  }