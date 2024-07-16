
A simple example numbers and optional

```tsp

@zod model User {
  id:string; 
  name?:string;
  cool?:int32;
}
```

## zod.ts
```tsx
import * as z from "zod";

export const User = z.shape({
  id: z.string(),
  name: z.string().optional(),
  cool: z.number().optional(),
});
export type User = z.infer<typeof User>;
```
         
