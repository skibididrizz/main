import { describe, it } from "node:test";
import { exampleEmittedTypescript } from "./test-host.js";

describe("examples", () => {
  it("Create a simple model", (t) =>
    exampleEmittedTypescript(
      t,
      `
 @table model Blog {
 @uuid @id id: string;
 name: string;
 description?:string;
 };      
    `,
    ));

  it("Naming columns and tables", (t) =>
    exampleEmittedTypescript(
      t,
      `
        @table("blogs") model Blog {
        @map("_id") @uuid @id id: string;
        @map("label") name: string;
        @map("note") description?: string;
        };      
           `,
    ));

  it("Simple example using @default", (t) =>
    exampleEmittedTypescript(
      t,
      `
  @table model Stuff {
     @id id: numeric;
     @default("now()") createdDate: Date;
     @default(int32(42)) answer:int32;
  };
            
            `,
    ));

  it("many-to-one", (t) =>
    exampleEmittedTypescript(
      t,
      `
        @table model Blog {
            @uuid @id id: string;
            name: string;
            @map("author_id") authorId: string;
            @relation(#{fields:"authorId"}) author: Author;
        };

        @table model Author {
            @id id: string;
            name: string;
            blogs:Blog[];
        };
        
        
        `,
    ));
});
