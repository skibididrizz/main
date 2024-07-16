import type {
  Model,
  DecoratorContext,
  Enum,
  ModelProperty,
} from "@typespec/compiler";
import { StateKeys } from "./lib.js";

export const namespace = "Zod";

export function $zod(context: DecoratorContext, target: Model | Enum) {
  context.program.stateMap(StateKeys.zod).set(target, true);
}
export function $brand(context: DecoratorContext, target: Model, name: string) {
  context.program.stateMap(StateKeys.brand).set(target, name);
}
export function $error(
  context: DecoratorContext,
  target: ModelProperty,
  required_error?: string,
  invalid_type_error?: string,
) {
  context.program
    .stateMap(StateKeys.error)
    .set(target, { required_error, invalid_type_error });
}
