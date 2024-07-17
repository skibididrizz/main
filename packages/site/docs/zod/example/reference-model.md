
Can reference other models

```tsp
@zod
model Blog {
  id: string;
  owner?: User;
}
@zod
model User {
  id: string;
  name?: string;
  cool?: int32;
}

```

## zod.ts
```tsx
import * as z from "zod";

export const Blog = z.shape({
  id: z.string(),
  owner: z.lazy(() => User).optional(),
});
export type Blog = z.infer<typeof Blog>;

export const User = z.shape({
  id: z.string(),
  name: z.string().optional(),
  cool: z.number().optional(),
});
export type User = z.infer<typeof User>;
```
         
