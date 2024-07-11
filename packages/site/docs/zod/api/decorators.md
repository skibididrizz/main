---
title: "Decorators"
toc_min_heading_level: 2
toc_max_heading_level: 3
---

# Decorators

## Zod

### `@brand` {#@Zod.brand}

Mark a model with a brand.

```typespec
@Zod.brand(brand: valueof string)
```

#### Target

`Model`

#### Parameters

| Name  | Type                    | Description |
| ----- | ----------------------- | ----------- |
| brand | `valueof scalar string` |             |

### `@zod` {#@Zod.zod}

zod - Mark this model as a Zod model.

```typespec
@Zod.zod
```

#### Target

`union Model | Enum`

#### Parameters

None
