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
  owner: z.lazy(() => User).nullable(),
});
export type Blog = z.infer<typeof Blog>;

export const User = z.shape({
  id: z.string(),
  name: z.string().nullable(),
  cool: z.number().nullable(),
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
  name: z.string().nullable(),
  cool: z.number().nullable(),
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
  items: z.string().array().nullable(),
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
  name: z.string().nullable(),
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
