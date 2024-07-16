
Using [@message](https://github.com/colinhacks/zod#custom-error-messages) to customize error message

```tsp


          @zod model Dog {
            @Zod.error("Name is required") name:string = "Fido";
            @Zod.error("Age must be greater than 10", "incorrect type") age:int32 = 10;
          }
          
```

## zod.ts
```tsx
import * as z from "zod";

export const Dog = z.shape({
  name: z.string({ required_error: "Name is required" }).default("Fido"),
  age: z
    .number({
      required_error: "Age must be greater than 10",
      invalid_type_error: "incorrect type",
    })
    .default(10),
});
export type Dog = z.infer<typeof Dog>;
```
         
