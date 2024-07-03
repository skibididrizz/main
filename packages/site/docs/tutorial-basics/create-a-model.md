---
sidebar_position: 1
---

# Create a Model

To create a model add  [@table](/docs/tsdocs/functions/$table) to a model in your **lib/schema.tsp**. We
also use [@id](/docs/tsdocs/functions/$id)  to identify the identity column and [@uuid](/docs/tsdocs/functions/$uuid)  to identifiy the column as a uuid type.

```tsp

 @table model Blog {
   @uuid @id id: string;
   name: string;
   description?:string;
 };      

```

Will result in a **drizzle/schema.ts** like:
```ts
import { pgTable, text } from "drizzle-orm/pg-core";

export const BlogTable = pgTable("Blog", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
});

export type Blog = typeof BlogTable.$inferSelect; 
```

# Naming 
Renaming the table in **lib/schema.tsp** will change the name of the table and the type.  You
can use [@map](/docs/tsdocs/functions/$map) annotation to rename columns,
and the [@table](/docs/tsdocs/functions/$table) annotation to rename the table.
In addition [@default](/docs/tsdocs/functions/$default) can be used for default values.

```tsp

  @table model Stuff {
     @id id: numeric;
     @default("now()") createdDate: Date;
     @default(int32(42)) answer:int32;
  };
            
```

Will result in a **drizzle/schema.ts** like:

```ts
import { pgTable, numeric, timestamp, integer } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const StuffTable = pgTable("Stuff", {
  id: serial("id").primaryKey(),
  createdDate: timestamp("createdDate").notNull().default(sql\`now()\`),
  answer: integer("answer").notNull().default(42),
});

export type Stuff = typeof StuffTable.$inferSelect; 
```