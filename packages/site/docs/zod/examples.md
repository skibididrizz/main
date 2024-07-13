# Examples


## Allows for objects to be branded
Brands are supported


 **schema.tsp**     
 ```tsp
import "@skibididrizz/drizzle";

using Drizzle;



      @zod @brand("Dog") model Dog {
        name:string;
      }
      @zod @brand("Cat") model Cat {
        name:string;
      }

      
            
 ```

Generates **schema.ts**

```tsx

//file: zod.ts
import * as z from "zod";

export const Dog = z
  .shape({
    name: z.string(),
  })
  .brand<"Dog">();
export type Dog = z.infer<typeof Dog>;

export const Cat = z
  .shape({
    name: z.string(),
  })
  .brand<"Cat">();
export type Cat = z.infer<typeof Cat>;

            
```


## Can have default values
Using the default syntax a property can have a default value


 **schema.tsp**     
 ```tsp
import "@skibididrizz/drizzle";

using Drizzle;



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

Generates **schema.ts**

```tsx

//file: zod.ts
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


## format can be used (uuid|email|url|date|datetime|time|ip|cuid|nanoid|cuid|cuid2)
Paterns and formats can be used


 **schema.tsp**     
 ```tsp
import "@skibididrizz/drizzle";

using Drizzle;



@zod model User {
  @format("uuid") id:string;
  @pattern("[^A-Z]*") name:string;

}

            
 ```

Generates **schema.ts**

```tsx

//file: zod.ts
import * as z from "zod";

export const User = z.shape({
  id: z.string().uuid(),
  name: z.string().regex(/[^A-Z]*/),
});
export type User = z.infer<typeof User>;

            
```


## minimums can be used
Minimums can be used


 **schema.tsp**     
 ```tsp
import "@skibididrizz/drizzle";

using Drizzle;



@zod model User {
  id:string;
  @minValue(18) age:int32;
}

            
 ```

Generates **schema.ts**

```tsx

//file: zod.ts
import * as z from "zod";

export const User = z.shape({
  id: z.string(),
  age: z.number().gte(18),
});
export type User = z.infer<typeof User>;

            
```


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
  name: z.string().optional(),
  cool: z.number().optional(),
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
  items: z.string().array().optional(),
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
  name: z.string().optional(),
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


