---
sidebar_position: 3
---

# Create a Model

To create a model add @table to a model in your schema.tsp
```tsp
@table("blog") Blog {
  @id id:string;
  name: string;
}

```

This will generate a schema roughly
```ts
import { pgTable, text } from "drizzle-orm/pg-core";

export const BlogTable = pgTable("blog", {
  id: text("id").primaryKey(),
});

export type Blog = typeof BlogTable.$inferSelect; 
```

