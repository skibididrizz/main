---
sidebar_position: 1
---

# Create a Model

To create a model add  [@table](/docs/drizzle/api/decorators#@Drizzle.table) to a model in your **lib/schema.tsp**. We
also use [@id](/docs/drizzle/api/decorators#@Drizzle.id)  to identify the identity column and [@uuid](/docs/drizzle/api/decorators#@Drizzle.uuid)  to identifiy the column as a uuid type.

```tsp
import "@skibididrizz/drizzle";
using Drizzle;

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
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
});

export type Blog = typeof BlogTable.$inferSelect;
```

# Naming 
Renaming the table in **lib/schema.tsp** will change the name of the table and the type.  You
can use [@map](/docs/drizzle/api/decorators#@Drizzle.map) annotation to rename columns,
and the [@table](/docs/drizzle/api/decorators#@Drizzle.able) annotation to rename the table.
In addition [@default](/docs/drizzle/api/decorators#@Drizzle.default) can be used for default values.

```tsp
import "@skibididrizz/drizzle";
using Drizzle;

  @table("blogs") model Blog {
        @map("_id") @uuid @id id: string;
        @map("label") name: string;
        @map("note") description?: string;
        };      
            
```

Will result in a **drizzle/schema.ts** like:

```ts
import { pgTable, text } from "drizzle-orm/pg-core";

export const BlogTable = pgTable("blogs", {
  id: uuid("_id").defaultRandom().primaryKey(),
  name: text("label").notNull(),
  description: text("note"),
});

export type Blog = typeof BlogTable.$inferSelect; 
```