import { describe, it, beforeEach } from "vitest";
import { SkibididrizzTestContext } from "@skibididrizz/common-test";
import { ZodTestLibrary } from "../src/testing/index.js";

describe("zod", () => {
  let ctx: SkibididrizzTestContext;

  beforeEach(async () => {
    ctx = new SkibididrizzTestContext(ZodTestLibrary);
  });

  it("plain", async () => {
    await ctx.emitExample(
      
      "A simple example numbers and optional",
      `
@zod model User {
  id:string; 
  name?:string;
  cool?:int32;
}`,
    );
  });
  it("plain with arrays", async () => {
    await ctx.emitExample(
      
      "Handles arrays",
      `
@zod model User {
  id:string; 
  items?:string[];
}`,
    );
  });
  it("nested object", async () => {
    await ctx.emitExample(
      
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
  it("should allow for extension object", async () => {
    await ctx.emitExample(
      
      "Inheritance is supported",
      `@zod model Animal {
  baseId: string;
}      
@zod model Dog extends Animal {
  name?:string;
}`,
    );
  });

  it("should allow for unions object", async () => {
    await ctx.emitExample(
      
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

  it("should allow for enums", async () => {
    await ctx.emitExample(
      
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
  it("should allow for enums with values", async () => {
    await ctx.emitExample(
      
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
  it("minimums can be used", async () => {
    await ctx.emitExample(
      
      "Minimums can be used",
      `
@zod model User {
  id:string;
  @minValue(18) age:int32;
}
`,
    );
  });
  it("format can be used (uuid|email|url|date|datetime|time|ip|cuid|nanoid|cuid|cuid2)", async () => {
    await ctx.emitExample(
      
      "Paterns and formats can be used",
      `
@zod model User {
  @format("uuid") id:string;
  @pattern("[^A-Z]*") name:string;

}
`,
    );
  });

  it("Allows for objects to be branded", async () =>
    ctx.emitExample(
      
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

  it("Can have default values", async () =>
    ctx.emitExampleFile(
      "./docs/default-values.md",
      "Using the default syntax a property can have a default value",
      `
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
        `,
    ));
});
