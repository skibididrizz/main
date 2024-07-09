import type { Model, DecoratorContext } from "@typespec/compiler";
import { StateKeys } from "./lib.js";

export const namespace = "Zod";

export function $zod(context: DecoratorContext, target: Model) {
  context.program.stateMap(StateKeys.zod).set(target, true);
}
