import { EmitContext } from "@typespec/compiler";
import { ZodEmitter } from "./zod-emitter.js";

export async function $onEmit(context: EmitContext) {
  const assetEmitter = context.getAssetEmitter(ZodEmitter);
  // emit my entire TypeSpec program
  assetEmitter.emitProgram();
  // or, maybe emit types just in a specific namespace
  // const ns = context.program.resolveTypeReference("Drizzle")!;
  // if (ns) {
  //   assetEmitter.emitType(ns);
  // }

  // lastly, write your emit output into the output directory

  await assetEmitter.writeOutput();
}
