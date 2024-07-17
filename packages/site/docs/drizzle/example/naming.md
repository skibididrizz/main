

 By default it uses the model name, however passing a string to [@table](/docs/drizzle/api/decorators#@Drizzle.table) will 
 use that as the table name.    

 For columns use *[@map](/docs/drizzle/api/decorators#@Drizzle.map)* to map the column name to the database column name.

 

```tsp
@table("blogs")
model Blog {
  @map("_id")
  @uuid
  @id
  id: string;

  @map("label") name: string;
  @map("note") description?: string;
}

```

## schema.ts
```tsx
import { pgTable, uuid, text } from "drizzle-orm/pg-core";

export const BlogTable = pgTable("blogs", {
  id: uuid("_id").defaultRandom().primaryKey(),
  name: text("label").notNull(),
  description: text("note"),
});

export type Blog = typeof BlogTable.$inferSelect; // return type when queried
```
         
