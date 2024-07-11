# Examples


## nested object
Can reference other models


 **schema.tsp**     
 ```tsp
import "@skibididrizz/drizzle";

using Drizzle;


@zod model Blog {
  id: string;
  owner?: User;
}      
  @zod model User {
  id:string; 
  name?:string;
  cool?:int32;
}
            
 ```

Generates **schema.ts**

```tsx

//file: zod.ts
import * as z from "zod";

export const Blog = z.shape({
  id: z.string(),
  owner: z.lazy(() => User).nullable(),
});
export type Blog = z.infer<typeof Blog>;

export const User = z.shape({
  id: z.string(),
  name: z.string().nullable(),
  cool: z.number().nullable(),
});
export type User = z.infer<typeof User>;

            
```


## plain
A simple example numbers and optional


 **schema.tsp**     
 ```tsp
import "@skibididrizz/drizzle";

using Drizzle;



@zod model User {
  id:string; 
  name?:string;
  cool?:int32;
}
            
 ```

Generates **schema.ts**

```tsx

//file: zod.ts
import * as z from "zod";

export const User = z.shape({
  id: z.string(),
  name: z.string().nullable(),
  cool: z.number().nullable(),
});
export type User = z.infer<typeof User>;

            
```


## plain with arrays
Handles arrays


 **schema.tsp**     
 ```tsp
import "@skibididrizz/drizzle";

using Drizzle;



@zod model User {
  id:string; 
  items?:string[];
}
            
 ```

Generates **schema.ts**

```tsx

//file: zod.ts
import * as z from "zod";

export const User = z.shape({
  id: z.string(),
  items: z.string().array().nullable(),
});
export type User = z.infer<typeof User>;

            
```


## should allow for enums
Enums are supported


 **schema.tsp**     
 ```tsp
import "@skibididrizz/drizzle";

using Drizzle;



@zod enum Status {
Good,
Bad,
Ugly,
}    
@zod model User {
  id:string;
  status:Status;
}

            
 ```

Generates **schema.ts**

```tsx

//file: zod.ts
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


## should allow for enums with values
Just an enum


 **schema.tsp**     
 ```tsp
import "@skibididrizz/drizzle";

using Drizzle;



@zod enum Foo {
  One: 1,
  Ten: 10,
  Hundred: 100,
  Thousand: 1000,
}

            
 ```

Generates **schema.ts**

```tsx

//file: zod.ts
import * as z from "zod";

export const Foo = z.nativeEnum({
  One: 1,
  Ten: 10,
  Hundred: 100,
  Thousand: 1000,
});
export type Foo = z.infer<typeof Foo>;

            
```


## should allow for extension object
Inheritance is supported


 **schema.tsp**     
 ```tsp
import "@skibididrizz/drizzle";

using Drizzle;


@zod model Animal {
  baseId: string;
}      
@zod model Dog extends Animal {
  name?:string;
}
            
 ```

Generates **schema.ts**

```tsx

//file: zod.ts
import * as z from "zod";

export const Animal = z.shape({
  baseId: z.string(),
});
export type Animal = z.infer<typeof Animal>;

export const Dog = Animal.extend({
  name: z.string().nullable(),
});
export type Dog = z.infer<typeof Dog>;

            
```


## should allow for unions object
Unions are supported


 **schema.tsp**     
 ```tsp
import "@skibididrizz/drizzle";

using Drizzle;



@zod model Stuff {
id:string;
};
@zod model Idunno {
  baseId: string | int32 | int64 | Stuff;
}      ;

            
 ```

Generates **schema.ts**

```tsx

//file: zod.ts
import * as z from "zod";

export const Stuff = z.shape({
  id: z.string(),
});
export type Stuff = z.infer<typeof Stuff>;

export const Idunno = z.shape({
  baseId: z.union([z.string(), z.number(), z.bigint(), z.lazy(() => Stuff)]),
});
export type Idunno = z.infer<typeof Idunno>;

            
```


