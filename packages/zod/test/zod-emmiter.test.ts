import { describe, it, beforeEach } from "vitest";
import { SkibididrizzTestContext } from "@skibididrizz/common-test";
import { ZodTestLibrary } from "../src/testing/index.js";

describe("zod", () => {
  let ctx: SkibididrizzTestContext;

  beforeEach(async () => {
    ctx = new SkibididrizzTestContext(ZodTestLibrary);
  });

  it("plain", async () => {
    await ctx.emitExampleFile(
      "docs/zod/example/simple.md",

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
    await ctx.emitExampleFile(
      "docs/zod/example/arrays.md",

      "Handles arrays",
      `
@zod model User {
  id:string; 
  items?:string[];
}`,
    );
  });
  it("nested object", async () => {
    await ctx.emitExampleFile(
      "docs/zod/example/reference-model.md",

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
    await ctx.emitExampleFile(
      "docs/zod/example/extends.md",

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
    await ctx.emitExampleFile(
      "docs/zod/example/unions.md",

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
    await ctx.emitExampleFile(
      "docs/zod/example/enums.md",

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
    await ctx.emitExampleFile(
      "docs/zod/example/enum-only.md",

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
    await ctx.emitExampleFile(
      "docs/zod/example/minValue.md",

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
    await ctx.emitExampleFile(
      "docs/zod/example/pattern-format.md",

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
    ctx.emitExampleFile(
      "docs/zod/example/brand.md",

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
      "docs/zod/example/default-value.md",
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

  it("Can have custom error message", async () =>
    ctx.emitExampleFile(
      "docs/zod/example/error-message.md",
      "Using [@message](https://github.com/colinhacks/zod#custom-error-messages) to customize error message",
      `

          @zod model Dog {
            @Zod.error("Name is required") name:string = "Fido";
            @Zod.error("Age must be greater than 10", "incorrect type") age:int32 = 10;
          }
          `,
    ));
});
