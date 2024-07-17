

For default values for columns use [@default](/docs/drizzle/api/decorators#@Drizzle.default).   This can
take a string with an SQL query or a literal.   All strings get evaluated as SQL so you will
need to escape them to use a literal.


```tsp
@table
model Stuff {
  @id id: numeric;
  @default("now()") createdDate: Date;
  answer: int32 = int32(42);
}

```

## schema.ts
```tsx
import { pgTable, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const StuffTable = pgTable("Stuff", {
  id: serial("id").primaryKey(),
  createdDate: timestamp("createdDate")
    .notNull()
    .default(sql`now()`),
  answer: integer("answer").notNull().default(42),
});

export type Stuff = typeof StuffTable.$inferSelect; // return type when queried
```
         
