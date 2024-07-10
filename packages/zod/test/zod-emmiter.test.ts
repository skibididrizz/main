import { describe, it, beforeEach } from "node:test";
import { BasicTestRunner } from "@typespec/compiler/testing";
import { createZodTestRunner, snapshotEmittedTypescript } from "./test-host.js";

describe("zod", () => {
  let runner: BasicTestRunner;

  beforeEach(async () => {
    runner = await createZodTestRunner();
  });

  it("plain", async (t) => {
    const result = await snapshotEmittedTypescript(
      t,
      `
@zod model User {
  id:string; 
  name?:string;
  cool?:int32;
}`,
    );
  });
  it("plain with arrays", async (t) => {
    const result = await snapshotEmittedTypescript(
      t,
      `
@zod model User {
  id:string; 
  items?:string[];
}`,
    );
  });
  it("nested object", async (t) => {
    const result = await snapshotEmittedTypescript(
      t,
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
    const result = await snapshotEmittedTypescript(
      t,
      `@zod model Animal {
  baseId: string;
}      
@zod model Dog extends Animal {
  name?:string;
}`,
    );
  });

  it("should allow for unions object", async (t) => {
    const result = await snapshotEmittedTypescript(
      t,
      `
@zod model Stuff {}
@zod model Idunno {
  baseId: string | int32 | int64 | Stuff;
}      
`,
    );
  });

  it("should allow for enums", async (t) => {
    const result = await snapshotEmittedTypescript(
      t,
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
    await snapshotEmittedTypescript(
      t,
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
