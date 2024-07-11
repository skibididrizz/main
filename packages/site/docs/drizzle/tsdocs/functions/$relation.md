

[**@skibididrizz/drizzle**](../README.md) • **Docs**

***

[@skibididrizz/drizzle](../README.md) / $relation

# Function: $relation()

> **$relation**(`context`, `target`, `relation`): `void`

Defines a property as a relation.   If supplied the name will match the opposing sides relation, if
it is not an array than an unique will be added to that column(s). The fields are the fields in the
current model context, while the references are the column(s) that match on the other side.

## Parameters

• **context**: `DecoratorContext`

• **target**: `ModelProperty`

• **relation**: `FieldRef`

## Returns

`void`

## Defined in

[decorators.ts:131](https://github.com/skibididrizz/main/blob/def61ef5794ebf1ee607e686f105a6c585684916/packages/drizzle/src/decorators.ts#L131)
