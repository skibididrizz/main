
Using the default syntax a property can have a default value

```tsp

        @zod enum Status {
          Good,
          Bad,
          Ugly,
        }
        
        @zod model Dog {
          status:Status = Status.Good;
          name:string = "Fido";
          age:int32 = 10;
        }
        
```

## zod.ts
```tsx
import * as z from "zod";

export const Dog = z.shape({
  status: z.lazy(() => Status).default(() => Status.Good),
  name: z.string().default("Fido"),
  age: z.number().default(10),
});
export type Dog = z.infer<typeof Dog>;

export const Status = z.nativeEnum({
  Good: "Good",
  Bad: "Bad",
  Ugly: "Ugly",
});
export type Status = z.infer<typeof Status>;
```
         
