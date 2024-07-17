
Enums are supported

```tsp
@zod
enum Status {
  Good,
  Bad,
  Ugly,
}
@zod
model User {
  id: string;
  status: Status;
}

```

## zod.ts
```tsx
import * as z from "zod";

export const User = z.shape({
  id: z.string(),
  status: z.lazy(() => Status),
});
export type User = z.infer<typeof User>;

export const Status = z.nativeEnum({
  Good: "Good",
  Bad: "Bad",
  Ugly: "Ugly",
});
export type Status = z.infer<typeof Status>;
```
         
