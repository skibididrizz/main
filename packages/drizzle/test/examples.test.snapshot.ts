exports[`examples > Create a simple model 1`] = `

 @table model Blog {
 @uuid @id id: string;
 name: string;
 description?:string;
 };      
    
`;

exports[`examples > Create a simple model 2`] = `
import { pgTable, text } from "drizzle-orm/pg-core";

export const BlogTable = pgTable("Blog", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
});

export type Blog = typeof BlogTable.$inferSelect; 
`;

exports[`examples > Naming columns and tables 1`] = `

        @table("blogs") model Blog {
        @map("_id") @uuid @id id: string;
        @map("label") name: string;
        @map("note") description?: string;
        };      
           
`;

exports[`examples > Naming columns and tables 2`] = `
import { pgTable, text } from "drizzle-orm/pg-core";

export const BlogTable = pgTable("blogs", {
  id: uuid("_id").defaultRandom().primaryKey(),
  name: text("label").notNull(),
  description: text("note"),
});

export type Blog = typeof BlogTable.$inferSelect; 
`;

exports[`examples > Simple example using @default 1`] = `

  @table model Stuff {
     @id id: numeric;
     @default("now()") createdDate: Date;
     @default(int32(42)) answer:int32;
  };
            
            
`;

exports[`examples > Simple example using @default 2`] = `
import { pgTable, numeric, timestamp, integer } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const StuffTable = pgTable("Stuff", {
  id: serial("id").primaryKey(),
  createdDate: timestamp("createdDate")
    .notNull()
    .default(sql\`now()\`),
  answer: integer("answer").notNull().default(42),
});

export type Stuff = typeof StuffTable.$inferSelect; 
`;

exports[`examples > many-to-one 1`] = `

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
        
        
        
`;

exports[`examples > many-to-one 2`] = `
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

`;
