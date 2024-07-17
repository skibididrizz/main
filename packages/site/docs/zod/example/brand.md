
Brands are supported

```tsp
@zod
@brand("Dog")
model Dog {
  name: string;
}
@zod
@brand("Cat")
model Cat {
  name: string;
}

```

## zod.ts
```tsx
import * as z from "zod";

export const Dog = z
  .shape({
    name: z.string(),
  })
  .brand<"Dog">();
export type Dog = z.infer<typeof Dog>;

export const Cat = z
  .shape({
    name: z.string(),
  })
  .brand<"Cat">();
export type Cat = z.infer<typeof Cat>;
```
         
