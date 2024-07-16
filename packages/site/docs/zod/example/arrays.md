
Handles arrays

```tsp

@zod model User {
  id:string; 
  items?:string[];
}
```

## zod.ts
```tsx
import * as z from "zod";

export const User = z.shape({
  id: z.string(),
  items: z.string().array().optional(),
});
export type User = z.infer<typeof User>;
```
         
