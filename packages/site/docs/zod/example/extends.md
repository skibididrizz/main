
Inheritance is supported

```tsp
@zod model Animal {
  baseId: string;
}      
@zod model Dog extends Animal {
  name?:string;
}
```

## zod.ts
```tsx
import * as z from "zod";

export const Animal = z.shape({
  baseId: z.string(),
});
export type Animal = z.infer<typeof Animal>;

export const Dog = Animal.extend({
  name: z.string().optional(),
});
export type Dog = z.infer<typeof Dog>;
```
         
