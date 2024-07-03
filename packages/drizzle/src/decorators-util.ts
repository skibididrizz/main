
import { StateKeys } from "./lib.js";
import {Program, ModelProperty, Type } from "@typespec/compiler";
import { FieldRef } from "./types.js";

export function hasTable(program: Program, entity: Type) {
    return program.stateMap(StateKeys.table).has(entity);
  }
  export function getTableName(program: Program, entity: Type) {
    const state = program.stateMap(StateKeys.table).get(entity);
    return state ?? (entity.kind == "Model" ? entity.name : undefined);
  }
  
  export function getMap(program: Program, property: ModelProperty) {
    return program.stateMap(StateKeys.map).get(property) ?? property.name;
  }
  
  export function getRelation(
    program: Program,
    property: ModelProperty,
  ): FieldRef | undefined {
    return program.stateMap(StateKeys.relation).get(property) as any;
  }
  export function getSql(program: Program, property: ModelProperty) {
    return program.stateMap(StateKeys.sql).get(property);
  }
  