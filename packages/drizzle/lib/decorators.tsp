import "../dist/src/decorators.js";

using TypeSpec.Reflection;

namespace Drizzle;

enum DeleteAction {
  SetNull,
  Restrict, 
  Cascade
}

enum UpdateAction {
  Cascade,
  Restrict,
}

model RelationOptions {
  name?:  string;
  fields?:  string[] | string;
  references?:  (string | ModelProperty)[] | string;
  onDelete?: DeleteAction;
  onUpdate?: UpdateAction;
}

enum DefaultType {
  uuid,
  autoincrement
};
enum Sequence {
    identity,
    sequence
};
/**
 * __Example Decorator__
 * Provide an alternate name for an operation.
 * @param name The alternate name.
 */
extern dec table(target: Model | Enum, tableName?: valueof string);
extern dec id(target: ModelProperty | Model, name?: valueof string , fields?:valueof string[]);
extern dec index(target: ModelProperty);
extern dec default(target: ModelProperty, type?:valueof string );
extern dec sql(target:ModelProperty, statement:valueof string);
extern dec uuid(target: ModelProperty);
extern dec unique(target: ModelProperty, ...columns:valueof string[]);
extern dec map(target:ModelProperty, column:valueof string);
extern dec relation(target:ModelProperty, relation?:valueof RelationOptions);