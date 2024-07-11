[**@skibididrizz/drizzle**](../README.md) • **Docs**

***

[@skibididrizz/drizzle](../README.md) / $index

# Function: $index()

> **$index**(`context`, `target`, `name`?, `sql`?): `void`

Allows for columns to be indexed.   If using `@id` then this is not needed, as an index will be
created.

## Parameters

• **context**: `DecoratorContext`

• **target**: `ModelProperty`

• **name?**: `string`

Name of the index, defaults to the name of the property with Idx appendded.

• **sql?**: `string`

The SQL query to use on the index.

## Returns

`void`

## Defined in

[decorators.ts:57](https://github.com/skibididrizz/main/blob/def61ef5794ebf1ee607e686f105a6c585684916/packages/drizzle/src/decorators.ts#L57)
