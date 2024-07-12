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
  it("minimums can be used", async (t) => {
    await ctx.emitExample(
      t,
      "Minimums can be used",
      `
@zod model User {
  id:string;
  @minValue(18) age:int32;
}
`,
    );
  });
  it("format can be used (uuid|email|url|date|datetime|time|ip|cuid|nanoid|cuid|cuid2)", async (t) => {
    await ctx.emitExample(
      t,
      "Paterns and formats can be used",
      `
@zod model User {
  @format("uuid") id:string;
  @pattern("[^A-Z]*") name:string;

}
`,
    );
  });

  it("Allows for objects to be branded", async (t) =>
    ctx.emitExample(
      t,
      "Brands are supported",
      `
      @zod @brand("Dog") model Dog {
        name:string;
      }
      @zod @brand("Cat") model Cat {
        name:string;
      }

      `,
    ));

  it("Can have default values", async (t) =>
    ctx.emitExample(
      t,
      "Using the default syntax a property can have a default value",
      `
        @zod model Dog {
          name:string = "Fido";
          age:int32 = 10;
        }
        `,
    ));

});
