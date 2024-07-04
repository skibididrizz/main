# Examples


## Create a simple model


```tsp


 @table model Blog {
 @uuid @id id: string;
 name: string;
 description?:string;
 };      
    
            
```

Generates

```tsx

import { pgTable, text } from "drizzle-orm/pg-core";

export const BlogTable = pgTable("Blog", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
});

export type Blog = typeof BlogTable.$inferSelect; 
            
```

## Naming columns and tables


```tsp


        @table("blogs") model Blog {
        @map("_id") @uuid @id id: string;
        @map("label") name: string;
        @map("note") description?: string;
        };      
           
            
```

Generates

```tsx

import { pgTable, text } from "drizzle-orm/pg-core";

export const BlogTable = pgTable("blogs", {
  id: uuid("_id").defaultRandom().primaryKey(),
  name: text("label").notNull(),
  description: text("note"),
});

export type Blog = typeof BlogTable.$inferSelect; 
            
```

## Simple example using @default


```tsp


  @table model Stuff {
     @id id: numeric;
     @default("now()") createdDate: Date;
     @default(int32(42)) answer:int32;
  };
            
            
            
```

Generates

```tsx

import { pgTable, numeric, timestamp, integer } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const StuffTable = pgTable("Stuff", {
  id: serial("id").primaryKey(),
  createdDate: timestamp("createdDate")
    .notNull()
    .default(sql`now()`),
  answer: integer("answer").notNull().default(42),
});

export type Stuff = typeof StuffTable.$inferSelect; 
            
```

## many-to-one


```tsp


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
        
        
        
            
```

Generates

```tsx

import { pgTable, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const BlogTable = pgTable("Blog", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  authorId: text("author_id").notNull(),
});

export type Blog = typeof BlogTable.$inferSelect; 
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

export type Author = typeof AuthorTable.$inferSelect; 
export const AuthorTableRelations = relations(AuthorTable, ({ many }) => ({
  blogs: many(BlogTable),
}));

            
```

