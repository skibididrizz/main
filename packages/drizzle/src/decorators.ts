import type {
  DecoratorContext,
  Model,
  ModelProperty,
  Program,
  Type,
} from "@typespec/compiler";
import { StateKeys } from "./lib.js";
import { FieldRef } from "./types.js";
import { camelToSnake } from "./string.js";

export const namespace = "Drizzle";
/**
 * Marks a model to be used as a table.  If an argument is
 * passed it will be used as the name of the table.  Otherwise the name of the
 * name of the model will be used.
 *
 * @param context
 * @param target
 * @param name - The name of the table, defaults to the name of the model
 */
export function $table(context: DecoratorContext, target: Type, name: string) {
  context.program.stateMap(StateKeys.table).set(target, name);
}
/**
 * id - is used to make a column, if on a property as an model id (primary key) or
 * if on a model as a columns that are the keys.   This can be a string or an array.
 * 
 * Depending on the type of property different output will be created.

 * @param context 
 * @param target 
 * @param name 
 * @param fields 
 */
export function $id(
  context: DecoratorContext,
  target: ModelProperty | Model,
  name?: string | string[],
  fields?: string[],
) {
  if (fields == null && Array.isArray(name)) {
    context.program.stateMap(StateKeys.id).set(target, { fields: name });
  } else {
    context.program.stateMap(StateKeys.id).set(target, { name, fields });
  }
}
/**
 * Allows for columns to be indexed.   If using `@id` then this is not needed, as an index will be
 * created.
 *
 * @param context
 * @param target
 * @param name - Name of the index, defaults to the name of the property with Idx appendded.
 * @param sql - The SQL query to use on the index.
 */
export function $index(
  context: DecoratorContext,
  target: ModelProperty,
  name?: string,
  sql?: string,
) {
  context.program.stateMap(StateKeys.index).set(target, {
    name: name || `${target.name}Idx`,
    sql: sql?.replaceAll("{column}", `\${table.${target.name}}`),
  });
}

export function $sql(
  context: DecoratorContext,
  target: ModelProperty,
  sql: string,
) {
  context.program.stateMap(StateKeys.sql).set(target, sql);
}

/**
 * Ensures that column or columns are unique.
 * @param context
 * @param target
 * @param string
 */
export function $unique(
  context: DecoratorContext,
  target: ModelProperty | Model,
  ...string: string[]
) {
  context.program.stateMap(StateKeys.unique).set(target, "unique");
}
/**
 * Marks a column to use uuid.  If the column is marked `@id` then the uuid will be used as the primary key.
 * @param context
 * @param target
 * @param name
 */
export function $uuid(
  context: DecoratorContext,
  target: ModelProperty,
  name: string,
) {
  context.program.stateMap(StateKeys.uuid).set(target, name);
}

/**
 *
 * The `default` decorator allows for columns to have values by default.  These can be literals or SQL queries.
 *
 *
 * @param context - context to use on.
 * @param target  - use on model properties.
 * @param name - The SQL query that will be used to create the column.
 */
export function $default(
  context: DecoratorContext,
  target: ModelProperty,
  name: string,
) {
  context.program.stateMap(StateKeys.default).set(target, name);
}

/**
 * Defines a property as a relation.   If supplied the name will match the opposing sides relation, if
 * it is not an array than an unique will be added to that column(s). The fields are the fields in the
 * current model context, while the references are the column(s) that match on the other side.
 *
 *
 * @param context
 * @param target
 * @param relation
 */
export function $relation(
  context: DecoratorContext,
  target: ModelProperty,
  relation: FieldRef,
) {
  context.program.stateMap(StateKeys.relation).set(target, relation);
}

/**
 * Rename the column of a model property.   If the name is not supplied the name of the property will be used.
 *
 * @param context
 * @param target
 * @param name
 */
export function $map(
  context: { program: Program },
  target: ModelProperty,
  name: string,
) {
  context.program.stateMap(StateKeys.map).set(target, name);
}
