

      This example shows how to use create a model with a uuid primary key.
Notice how description is optional. [@table](/docs/drizzle/api/decorators#@Drizzle.table) will mark
a table to be in included in the database.

```tsp
@table model Blog {
 @uuid @id id: string;
 name: string;
 description?: string;
 };      
    
```

## schema.ts
```tsx
import { pgTable, uuid, text } from "drizzle-orm/pg-core";

export const BlogTable = pgTable("Blog", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
});

export type Blog = typeof BlogTable.$inferSelect; // return type when queried
```
         
