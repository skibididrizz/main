
Paterns and formats can be used

```tsp
@zod
model User {
  @format("uuid") id: string;
  @pattern("[^A-Z]*") name: string;
}

```

## zod.ts
```tsx
import * as z from "zod";

export const User = z.shape({
  id: z.string().uuid(),
  name: z.string().regex(/[^A-Z]*/),
});
export type User = z.infer<typeof User>;
```
         
