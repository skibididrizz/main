import { describe, it, beforeEach } from "node:test";
import { SkibididrizzTestContext } from "@skibididrizz/common";
import { ZodTestLibrary } from "../src/testing/index.js";

describe("zod", () => {
  let ctx: SkibididrizzTestContext;

  beforeEach(async () => {
    ctx = new SkibididrizzTestContext(ZodTestLibrary);
  });

  it("plain", async (t) => {
    await ctx.emitExample(
      t,
      "A simple example numbers and optional",
      `
@zod model User {
  id:string; 
  name?:string;
  cool?:int32;
}`,
    );
  });
  it("plain with arrays", async (t) => {
    await ctx.emitExample(
      t,
      "Handles arrays",
      `
@zod model User {
  id:string; 
  items?:string[];
}`,
    );
  });
  it("nested object", async (t) => {
    await ctx.emitExample(
      t,
      "Can reference other models",
      `@zod model Blog {
  id: string;
  owner?: User;
}      
  @zod model User {
  id:string; 
  name?:string;
  cool?:int32;
}`,
    );
  });
  it("should allow for extension object", async (t) => {
    await ctx.emitExample(
      t,
      "Inheritance is supported",
      `@zod model Animal {
  baseId: string;
}      
@zod model Dog extends Animal {
  name?:string;
}`,
    );
  });

  it("should allow for unions object", async (t) => {
    await ctx.emitExample(
      t,
      "Unions are supported",
      `
@zod model Stuff {
id:string;
};
@zod model Idunno {
  baseId: string | int32 | int64 | Stuff;
}      ;
`,
    );
  });

  it("should allow for enums", async (t) => {
    await ctx.emitExample(
      t,
      "Enums are supported",
      `
@zod enum Status {
Good,
Bad,
Ugly,
}    
@zod model User {
  id:string;
  status:Status;
}
`,
    );
  });
  it("should allow for enums with values", async (t) => {
    await ctx.emitExample(
      t,
      "Just an enum",
      `
@zod enum Foo {
  One: 1,
  Ten: 10,
  Hundred: 100,
  Thousand: 1000,
}
`,
    );
  });
});
