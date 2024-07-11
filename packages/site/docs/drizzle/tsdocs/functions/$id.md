[**@skibididrizz/drizzle**](../README.md) • **Docs**

***

[@skibididrizz/drizzle](../README.md) / $id

# Function: $id()

> **$id**(`context`, `target`, `name`?, `fields`?): `void`

id - is used to make a column, if on a property as an model id (primary key) or
if on a model as a columns that are the keys.   This can be a string or an array.

Depending on the type of property different output will be created.

## Parameters

• **context**: `DecoratorContext`

• **target**: `ModelProperty` \| `Model`

• **name?**: `string` \| `string`[]

• **fields?**: `string`[]

## Returns

`void`

## Defined in

[decorators.ts:36](https://github.com/skibididrizz/main/blob/def61ef5794ebf1ee607e686f105a6c585684916/packages/drizzle/src/decorators.ts#L36)
