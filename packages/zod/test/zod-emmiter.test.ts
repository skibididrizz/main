import { describe, it, beforeEach } from "node:test";
import {
  BasicTestRunner,
  expectDiagnostics,
  extractCursor,
} from "@typespec/compiler/testing";
import {
  createZodTestRunner,
  snapshotEmittedTypescript,
  emitWithDiagnostics,
} from "./test-host.js";

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
}`);
  });
  it("plain with arrays", async (t) => {
    const result = await snapshotEmittedTypescript(
      t,
      `
@zod model User {
  id:string; 
  items?:string[];
}`);
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
}`);
  });
  it("should allow for extension object", async (t) => {
    const result = await snapshotEmittedTypescript(
      t,
`@zod model Animal {
  baseId: string;
}      
@zod model Dog extends Animal {
  name?:string;
}`);
  });

  it("should allow for unions object", async (t) => {
    const result = await snapshotEmittedTypescript(
      t,
`@zod model Idunno {
  baseId: string | int32 | int64;
}      
`);
  });
});
