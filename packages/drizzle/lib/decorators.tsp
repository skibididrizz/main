import "../dist/src/decorators.js";

using TypeSpec.Reflection;

namespace Drizzle;


/**
 * table - Mark this model as a table, optionally with a name.
 * @param name The alternate name.
 */
extern dec table(target: Model | Enum, tableName?: valueof string);
/**
 * id - Mark this property as the primary key, or the list of columns that make up the primary key.
 * @param name The alternate name.
 * @param fields The list of columns that make up the primary key.
 */
extern dec id(target: ModelProperty | Model, name?: valueof string , fields?:valueof string[]);
/**
 * index - Mark this property as an index.
 * @param name The alternate name.
 * @param sql The SQL statement to use for the index. It will replace {column} with the name of the current column. so you can use {columns} in the SQL statement. 
 *  Think ```lower({column})``` to lower case the index.  If \@unique is used in combination it will generate a unique index.
 */
extern dec index(target: ModelProperty, name?: valueof string, sql?:valueof string);
/**
 * default - Mark this property as a default value.
 */
extern dec default(target: ModelProperty, type?:valueof string |  int32 | int16 | int8 | uint32 | uint16 | uint8 | float32 | float64 | boolean );
/**
 * sql - Mark this property as the value of a SQL statement.
 */
extern dec sql(target:ModelProperty, statement:valueof string);
/**
 * uuid - Mark this property as a UUID.
 */
extern dec uuid(target: ModelProperty, defaultRandom?: boolean);
/**
 * unique - Mark this property as a unique value.
 */
extern dec unique(target: ModelProperty | Model, ...columns:valueof string[]);
/**
 * map - Mark this property as a column in a table.
 */
extern dec map(target:ModelProperty, column:valueof string);
/**
 * relation - Mark this property as a relation.
 */
extern dec relation(target:ModelProperty, relation?:valueof RelationOptions);