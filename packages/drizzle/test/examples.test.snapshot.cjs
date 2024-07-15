// Vitest Snapshot v1, https://vitest.dev/guide/snapshot.html

exports[`examples > Configure namespaces 1`] = `
"
Using [@config](/docs/drizzle/api/decorators#@Drizzle.config) you can configure the dialect and namespace.  You
can also specify the output file.   This is still a experimental feature.  They are all experimental
features.
"
`;

exports[`examples > Configure namespaces 2`] = `
"
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
      "
`;

exports[`examples > Configure namespaces 3`] = `
{
  "schema.ts": "import { sqliteTable, uuid, text } from "drizzle-orm/sqlite-core";
import { mysqlTable, uuid, text } from "drizzle-orm/mysql-core";

export const NSBlogTable = sqliteTable("NSBlog", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
});

export type NSBlog = typeof NSBlogTable.$inferSelect; // return type when queried

export const MyBlogTable = mysqlTable("MyBlog", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
});

export type MyBlog = typeof MyBlogTable.$inferSelect; // return type when queried
",
}
`;

exports[`examples > Create a simple model 1`] = `
"
      This example shows how to use create a model with a uuid primary key.
Notice how description is optional. [@table](/docs/drizzle/api/decorators#@Drizzle.table) will mark
a table to be in included in the database."
`;

exports[`examples > Create a simple model 2`] = `
"@table model Blog {
 @uuid @id id: string;
 name: string;
 description?: string;
 };      
    "
`;

exports[`examples > Create a simple model 3`] = `
{
  "schema.ts": "import { pgTable, uuid, text } from "drizzle-orm/pg-core";

export const BlogTable = pgTable("Blog", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
});

export type Blog = typeof BlogTable.$inferSelect; // return type when queried
",
}
`;

exports[`examples > Many-to-one 1`] = `
"
This example shows how to use a many-to-one relationship.   Notice how the relation is marked
with [@relation](/docs/drizzle/api/decorators#@Drizzle.relation).  
Fields map to the local fields of the model, relations map to the foreign key(s) in the other model.

"
`;

exports[`examples > Many-to-one 2`] = `
"
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
        "
`;

exports[`examples > Many-to-one 3`] = `
{
  "schema.ts": "import { relations } from "drizzle-orm";
import { pgTable, uuid, text } from "drizzle-orm/pg-core";

export const BlogTable = pgTable("Blog", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  authorId: text("author_id").notNull(),
});

export type Blog = typeof BlogTable.$inferSelect; // return type when queried

export const BlogTableRelations = relations(BlogTable, ({ one }) => ({
  author: one(AuthorTable, {
    relationName: "author",
    fields: [BlogTable.authorId],
    references: [AuthorTable.id],
  }),
}));

export const AuthorTable = pgTable("Author", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
});

export type Author = typeof AuthorTable.$inferSelect; // return type when queried

export const AuthorTableRelations = relations(AuthorTable, ({ many }) => ({
  blogs: many(BlogTable),
}));
",
}
`;

exports[`examples > Naming columns and tables 1`] = `
"
 By default it uses the model name, however passing a string to [@table](/docs/drizzle/api/decorators#@Drizzle.table) will 
 use that as the table name.    

 For columns use *[@map](/docs/drizzle/api/decorators#@Drizzle.map)* to map the column name to the database column name.

 "
`;

exports[`examples > Naming columns and tables 2`] = `
"
        @table("blogs") model Blog {
        @map("_id") @uuid @id id: string;
        @map("label") name: string;
        @map("note") description?: string;
        };      
           "
`;

exports[`examples > Naming columns and tables 3`] = `
{
  "schema.ts": "import { pgTable, uuid, text } from "drizzle-orm/pg-core";

export const BlogTable = pgTable("blogs", {
  id: uuid("_id").defaultRandom().primaryKey(),
  name: text("label").notNull(),
  description: text("note"),
});

export type Blog = typeof BlogTable.$inferSelect; // return type when queried
",
}
`;

exports[`examples > Simple example using @default 1`] = `
"
For default values for columns use [@default](/docs/drizzle/api/decorators#@Drizzle.default).   This can
take a string with an SQL query or a literal.   All strings get evaluated as SQL so you will
need to escape them to use a literal.
"
`;

exports[`examples > Simple example using @default 2`] = `
"
@table model Stuff {
     @id id: numeric;
     @default("now()") createdDate: Date;
     @default(int32(42)) answer:int32;
};
            
            "
`;

exports[`examples > Simple example using @default 3`] = `
{
  "schema.ts": "import { pgTable, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const StuffTable = pgTable("Stuff", {
  id: serial("id").primaryKey(),
  createdDate: timestamp("createdDate")
    .notNull()
    .default(sql\`now()\`),
  answer: integer("answer").notNull().default(42),
});

export type Stuff = typeof StuffTable.$inferSelect; // return type when queried
",
}
`;
