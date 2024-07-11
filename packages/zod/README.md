# @skibididrizz/zod

## Install

```bash
npm install @skibididrizz/zod
```

## Decorators

### Zod

- [`@brand`](#@brand)
- [`@zod`](#@zod)

#### `@brand`

Mark a model with a brand.

```typespec
@Zod.brand(brand: valueof string)
```

##### Target

`Model`

##### Parameters

| Name  | Type                    | Description |
| ----- | ----------------------- | ----------- |
| brand | `valueof scalar string` |             |

#### `@zod`

zod - Mark this model as a Zod model.

```typespec
@Zod.zod
```

##### Target

`union Model | Enum`

##### Parameters

None
