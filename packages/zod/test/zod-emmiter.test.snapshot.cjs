exports[`zod > nested object 1`] = `
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

exports[`zod > nested object 2`] = `
//file: zod.ts
import { string, lazy, shape, number } from "zod";

export const Blog = shape({
  id: string(),
  owner: lazy(() => User).nullable(),
});
export type Blog = z.infer<typeof Blog>;

export const User = shape({
  id: string(),
  name: string().nullable(),
  cool: number().nullable(),
});
export type User = z.infer<typeof User>;

`;

exports[`zod > plain 1`] = `

@zod model User {
  id:string; 
  name?:string;
  cool?:int32;
}
`;

exports[`zod > plain 2`] = `
//file: zod.ts
import { string, number, shape } from "zod";

export const User = shape({
  id: string(),
  name: string().nullable(),
  cool: number().nullable(),
});
export type User = z.infer<typeof User>;

`;

exports[`zod > plain with arrays 1`] = `

@zod model User {
  id:string; 
  items?:string[];
}
`;

exports[`zod > plain with arrays 2`] = `
//file: zod.ts
import { string, shape } from "zod";

export const User = shape({
  id: string(),
  items: string().array().nullable(),
});
export type User = z.infer<typeof User>;

`;

exports[`zod > should allow for extension object 1`] = `
@zod model Animal {
  baseId: string;
}      
@zod model Dog extends Animal {
  name?:string;
}
`;

exports[`zod > should allow for extension object 2`] = `
//file: zod.ts
import { string, shape, extend } from "zod";

export const Animal = shape({
  baseId: string(),
});
export type Animal = z.infer<typeof Animal>;

export const Dog = Animal.extend({
  name: string().nullable(),
});
export type Dog = z.infer<typeof Dog>;

`;

exports[`zod > should allow for unions object 1`] = `
@zod model Idunno {
  baseId: string | int32 | int64;
}      

`;

exports[`zod > should allow for unions object 2`] = `
//file: zod.ts
import { union, string, number, bigint, shape } from "zod";

export const Idunno = shape({
  baseId: union([string(), number(), bigint()]),
});
export type Idunno = z.infer<typeof Idunno>;

`;
