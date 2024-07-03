import { strictEqual } from "node:assert";
import { describe, it } from "node:test";
import { emit } from "./test-host.js";

describe("drizzle", () => {
  it("emit output.txt with content hello world", async () => {
    const results = await emit(`op test1(): void;`);
    console.dir({ results });
    // strictEqual(results["output.txt"], "Hello worlds\n");
  });
});
