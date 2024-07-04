# Examples


## Can be configured with decorators


  ```tsp
  

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
      
            
  ```
  
Generates

```tsx
  
import { sqliteTable, uuid, text } from "drizzle-orm/sqlite-core";
import { mysqlTable, uuid, text } from "drizzle-orm/mysql-core";

export const NSBlogTable = sqliteTable("NSBlog", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
});

export type NSBlog = typeof NSBlogTable.$inferSelect; 
export const MyBlogTable = mysqlTable("MyBlog", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
});

export type MyBlog = typeof MyBlogTable.$inferSelect; 
            
  ```

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

