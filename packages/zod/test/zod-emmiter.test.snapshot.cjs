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
