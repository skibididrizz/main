import type { DecoratorContext, Model, ModelProperty, Program, Type} from "@typespec/compiler";
import { StateKeys } from "./lib.js";
import { FieldRef } from "./types.js";
import { camelToSnake } from "./string.js";

export const namespace = "Drizzle";

export function $table(context: DecoratorContext, target: Type, name: string) {
  context.program.stateMap(StateKeys.table).set(target, name);
}

export function $id(context: DecoratorContext, target: ModelProperty | Model, name?:string | string[], fields?:string[]) {
  if (fields == null && Array.isArray(name)) {
    context.program.stateMap(StateKeys.id).set(target,  { fields:name });
  }else{
    context.program.stateMap(StateKeys.id).set(target,  {name, fields});
  }
}

export function $index(context: DecoratorContext, target: ModelProperty, name?:string, sql?:string) {
  context.program.stateMap(StateKeys.index).set(target, {name:name || `${target.name}Idx`, sql:sql?.replaceAll('{column}', `\${table.${target.name}}`)});
}

export function $sql(context: DecoratorContext, target: ModelProperty, sql: string) {
  context.program.stateMap(StateKeys.sql).set(target, sql);
}

export function getSql(program: Program, property: ModelProperty) {
  return program.stateMap(StateKeys.sql).get(property);
}

export function $unique(context: DecoratorContext, target: ModelProperty | Type, ...string:string[]) {
  context.program.stateMap(StateKeys.unique).set(target, 'unique');

}

export function $uuid(context: DecoratorContext, target: ModelProperty, name:string) {
  context.program.stateMap(StateKeys.uuid).set(target, name);
}


export function $default(context: DecoratorContext, target: ModelProperty, name:string) {
  context.program.stateMap(StateKeys.default).set(target, name);

}

export function $relation(context: DecoratorContext, target: ModelProperty, relation:FieldRef) {
  context.program.stateMap(StateKeys.relation).set(target, relation);
}

export function $map(context: {program:Program}, target: ModelProperty, name:string) {
  context.program.stateMap(StateKeys.map).set(target, name);

}
export function hasTable(program:Program, entity:Type){
   return program.stateMap(StateKeys.table).has(entity);
}
export function getTableName(program: Program, entity: Type) {
  const state = program.stateMap(StateKeys.table).get(entity);
  return state ?? (entity.kind == 'Model' ? entity.name : undefined);
}

export function getMap(program: Program,  property: ModelProperty) {
  return program.stateMap(StateKeys.map).get(property) ??  property.name;
}

export function getRelation(program:Program, property: ModelProperty):FieldRef | undefined {
  return program.stateMap(StateKeys.relation).get(property) as any;

}