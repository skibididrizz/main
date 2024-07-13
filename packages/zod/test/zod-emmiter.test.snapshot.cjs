exports[`zod > Allows for objects to be branded 1`] = `
Brands are supported
`;

exports[`zod > Allows for objects to be branded 2`] = `

      @zod @brand("Dog") model Dog {
        name:string;
      }
      @zod @brand("Cat") model Cat {
        name:string;
      }

      
`;

exports[`zod > Allows for objects to be branded 3`] = `
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

`;

exports[`zod > Can have default values 1`] = `
Using the default syntax a property can have a default value
`;

exports[`zod > Can have default values 2`] = `

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
        
`;

exports[`zod > Can have default values 3`] = `
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

`;

exports[`zod > format can be used (uuid|email|url|date|datetime|time|ip|cuid|nanoid|cuid|cuid2) 1`] = `
Paterns and formats can be used
`;

exports[`zod > format can be used (uuid|email|url|date|datetime|time|ip|cuid|nanoid|cuid|cuid2) 2`] = `

@zod model User {
  @format("uuid") id:string;
  @pattern("[^A-Z]*") name:string;

}

`;

exports[`zod > format can be used (uuid|email|url|date|datetime|time|ip|cuid|nanoid|cuid|cuid2) 3`] = `
//file: zod.ts
import * as z from "zod";

export const User = z.shape({
  id: z.string().uuid(),
  name: z.string().regex(/[^A-Z]*/),
});
export type User = z.infer<typeof User>;

`;

exports[`zod > minimums can be used 1`] = `
Minimums can be used
`;

exports[`zod > minimums can be used 2`] = `

@zod model User {
  id:string;
  @minValue(18) age:int32;
}

`;

exports[`zod > minimums can be used 3`] = `
//file: zod.ts
import * as z from "zod";

export const User = z.shape({
  id: z.string(),
  age: z.number().gte(18),
});
export type User = z.infer<typeof User>;

`;

exports[`zod > nested object 1`] = `
Can reference other models
`;

exports[`zod > nested object 2`] = `
@zod model Blog {
  id: string;
  owner?: User;
}      
  @zod model User {
  id:string; 
  name?:string;
  cool?:int32;
}
`;

exports[`zod > nested object 3`] = `
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

`;

exports[`zod > plain 1`] = `
A simple example numbers and optional
`;

exports[`zod > plain 2`] = `

@zod model User {
  id:string; 
  name?:string;
  cool?:int32;
}
`;

exports[`zod > plain 3`] = `
//file: zod.ts
import * as z from "zod";

export const User = z.shape({
  id: z.string(),
  name: z.string().optional(),
  cool: z.number().optional(),
});
export type User = z.infer<typeof User>;

`;

exports[`zod > plain with arrays 1`] = `
Handles arrays
`;

exports[`zod > plain with arrays 2`] = `

@zod model User {
  id:string; 
  items?:string[];
}
`;

exports[`zod > plain with arrays 3`] = `
//file: zod.ts
import * as z from "zod";

export const User = z.shape({
  id: z.string(),
  items: z.string().array().optional(),
});
export type User = z.infer<typeof User>;

`;

exports[`zod > should allow for enums 1`] = `
Enums are supported
`;

exports[`zod > should allow for enums 2`] = `

@zod enum Status {
Good,
Bad,
Ugly,
}    
@zod model User {
  id:string;
  status:Status;
}

`;

exports[`zod > should allow for enums 3`] = `
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

`;

exports[`zod > should allow for enums with values 1`] = `
Just an enum
`;

exports[`zod > should allow for enums with values 2`] = `

@zod enum Foo {
  One: 1,
  Ten: 10,
  Hundred: 100,
  Thousand: 1000,
}

`;

exports[`zod > should allow for enums with values 3`] = `
//file: zod.ts
import * as z from "zod";

export const Foo = z.nativeEnum({
  One: 1,
  Ten: 10,
  Hundred: 100,
  Thousand: 1000,
});
export type Foo = z.infer<typeof Foo>;

`;

exports[`zod > should allow for extension object 1`] = `
Inheritance is supported
`;

exports[`zod > should allow for extension object 2`] = `
@zod model Animal {
  baseId: string;
}      
@zod model Dog extends Animal {
  name?:string;
}
`;

exports[`zod > should allow for extension object 3`] = `
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

`;

exports[`zod > should allow for unions object 1`] = `
Unions are supported
`;

exports[`zod > should allow for unions object 2`] = `

@zod model Stuff {
id:string;
};
@zod model Idunno {
  baseId: string | int32 | int64 | Stuff;
}      ;

`;

exports[`zod > should allow for unions object 3`] = `
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

`;
