
Minimums can be used

```tsp
@zod
model User {
  id: string;
  @minValue(18) age: int32;
}

```

## zod.ts
```tsx
import * as z from "zod";

export const User = z.shape({
  id: z.string(),
  age: z.number().gte(18),
});
export type User = z.infer<typeof User>;
```
         
