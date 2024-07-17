

This example shows how to use a many-to-one relationship.   Notice how the relation is marked
with [@relation](/docs/drizzle/api/decorators#@Drizzle.relation).  
Fields map to the local fields of the model, relations map to the foreign key(s) in the other model.



```tsp
@table
model Blog {
  @uuid @id id: string;
  name: string;
  @map("author_id") authorId: string;
  @relation(#{ fields: "authorId" }) author: Author;
}

@table
model Author {
  @id id: string;
  name: string;
  blogs: Blog[];
}

```

## schema.ts
```tsx
import { relations } from "drizzle-orm";
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
```
         
