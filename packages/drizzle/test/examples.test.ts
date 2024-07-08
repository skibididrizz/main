import { describe, it } from "node:test";
import { exampleEmittedTypescript } from "./test-host.js";

describe("examples", () => {
  it("Create a simple model", (t) =>
    exampleEmittedTypescript(
      t,
`
This example shows how to use create a model with a uuid primary key.
Notice how description is optional. [@table](/docs/tsdocs/functions/$table) will mark
a table to be in included in the database.

`      
,    `
 @table model Blog {
 @uuid @id id: string;
 name: string;
 description?: string;
 };      
    `,
    ));

  it("Naming columns and tables", (t) =>
    exampleEmittedTypescript(
      t,
 `
 By default it uses the model name, however passing a string to [@table](/docs/tsdocs/functions/$table) will 
 use that as the table name.    

 For columns use *[@map](/docs/tsdocs/functions/$map)* to map the column name to the database column name.

 `,     
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
For default values for columns use [@default](/docs/tsdocs/functions/$default).   This can
take a string with an SQL query or a literal.   All strings get evaluated as SQL so you will
need to escape them to use a literal.
`      
 ,     `
@table model Stuff {
     @id id: numeric;
     @default("now()") createdDate: Date;
     @default(int32(42)) answer:int32;
};
            
            `,
    ));

  it("Many-to-one", (t) =>
    exampleEmittedTypescript(
      t,
`
This example shows how to use a many-to-one relationship.   Notice how the relation is marked
with [@relation](/docs/tsdocs/functions/$relation).  
Fields map to the local fields of the model, relations map to the foreign key(s) in the other model.

`,
      
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

  it.only("Configure namespaces", (t) =>
  exampleEmittedTypescript(
      t,
`
Using [@config](/docs/tsdocs/functions/$config) you can configure the dialect and namespace.  You
can also specify the output file.   This is still a experimental feature.  They are all experimental
features.
`,      
      `
    @config(#{dialect:"sqlite"})
    namespace HelloSqLite {

    @table model NSBlog {
        @uuid @id id: string;
        name: string;
        description?:string;
      };
    }

    @config(#{dialect:"mysql"})
    namespace HelloMySql {

    @table model MyBlog {
        @uuid @id id: string;
        name: string;
        description?:string;
      };
    }
      `,
    ));
});
