# @skibididrizz/drizzle

## Install

```bash
npm install @skibididrizz/drizzle
```

## Decorators

### Drizzle

- [`@config`](#@config)
- [`@default`](#@default)
- [`@id`](#@id)
- [`@index`](#@index)
- [`@map`](#@map)
- [`@relation`](#@relation)
- [`@sql`](#@sql)
- [`@table`](#@table)
- [`@unique`](#@unique)
- [`@uuid`](#@uuid)

#### `@config`

config - Mark this property as a configuration.

```typespec
@Drizzle.config(config: valueof Drizzle.Configuration)
```

##### Target

`Namespace`

##### Parameters

| Name   | Type                                  | Description |
| ------ | ------------------------------------- | ----------- |
| config | `valueof model Drizzle.Configuration` |             |

#### `@default`

default - Mark this property as a default value.

```typespec
@Drizzle.default(type?: valueof string | int32 | int16 | int8 | uint32 | uint16 | uint8 | float32 | float64 | boolean)
```

##### Target

`ModelProperty`

##### Parameters

| Name | Type                                                                                                           | Description |
| ---- | -------------------------------------------------------------------------------------------------------------- | ----------- |
| type | `valueof union string \| int32 \| int16 \| int8 \| uint32 \| uint16 \| uint8 \| float32 \| float64 \| boolean` |             |

#### `@id`

id - Mark this property as the primary key, or the list of columns that make up the primary key.

```typespec
@Drizzle.id(name?: valueof string, fields?: valueof string[])
```

##### Target

`union ModelProperty | Model`

##### Parameters

| Name   | Type                     | Description                                       |
| ------ | ------------------------ | ------------------------------------------------- |
| name   | `valueof scalar string`  | The alternate name.                               |
| fields | `valueof model string[]` | The list of columns that make up the primary key. |

#### `@index`

index - Mark this property as an index.

```typespec
@Drizzle.index(name?: valueof string, sql?: valueof string)
```

##### Target

`ModelProperty`

##### Parameters

| Name | Type                    | Description                                                                                                                                                                                                            |
| ---- | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name | `valueof scalar string` | The alternate name.                                                                                                                                                                                                    |
| sql  | `valueof scalar string` | The SQL statement to use for the index. It will replace \{column\} with the name of the current column. so you can use \{column\} in the SQL statement. <br />Think `lower(\{column\})` to lower case the index. If \  |

#### `@map`

map - Mark this property as a column in a table.

```typespec
@Drizzle.map(column: valueof string)
```

##### Target

`ModelProperty`

##### Parameters

| Name   | Type                    | Description |
| ------ | ----------------------- | ----------- |
| column | `valueof scalar string` |             |

#### `@relation`

relation - Mark this property as a relation.

```typespec
@Drizzle.relation(relation?: valueof Drizzle.RelationOptions)
```

##### Target

`ModelProperty`

##### Parameters

| Name     | Type                                    | Description |
| -------- | --------------------------------------- | ----------- |
| relation | `valueof model Drizzle.RelationOptions` |             |

#### `@sql`

sql - Mark this property as the value of a SQL statement.

```typespec
@Drizzle.sql(statement: valueof string)
```

##### Target

`ModelProperty`

##### Parameters

| Name      | Type                    | Description |
| --------- | ----------------------- | ----------- |
| statement | `valueof scalar string` |             |

#### `@table`

table - Mark this model as a table, optionally with a name.

```typespec
@Drizzle.table(tableName?: valueof string)
```

##### Target

`union Model | Enum`

##### Parameters

| Name      | Type                    | Description |
| --------- | ----------------------- | ----------- |
| tableName | `valueof scalar string` |             |

#### `@unique`

unique - Mark this property as a unique value.

```typespec
@Drizzle.unique(...columns: valueof string[])
```

##### Target

`union ModelProperty | Model`

##### Parameters

| Name    | Type                     | Description |
| ------- | ------------------------ | ----------- |
| columns | `valueof model string[]` |             |

#### `@uuid`

uuid - Mark this property as a UUID.

```typespec
@Drizzle.uuid(defaultRandom?: boolean)
```

##### Target

`ModelProperty`

##### Parameters

| Name          | Type             | Description |
| ------------- | ---------------- | ----------- |
| defaultRandom | `scalar boolean` |             |
