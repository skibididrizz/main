
Just an enum

```tsp
@zod
enum Foo {
  One: 1,
  Ten: 10,
  Hundred: 100,
  Thousand: 1000,
}

```

## zod.ts
```tsx
import * as z from "zod";

export const Foo = z.nativeEnum({
  One: 1,
  Ten: 10,
  Hundred: 100,
  Thousand: 1000,
});
export type Foo = z.infer<typeof Foo>;
```
         
