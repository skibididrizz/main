exports[`drizzle > should handle multiple relationships 1`] = `

        @table model User {
          @id id: integer;
          name:string;
          followedBy: Follow[];
          follows: Follow[];
        };

        @id("follows_followedby_user",#["followedById", "followingId"]) @table model Follow {
            @relation(#{name:"followedBy", fields: "followedById"})
            followedBy:User;
            followedById: integer;
            
            @relation(#{name:"follows", fields: "followingId"})
            following:User;
            followingId:integer;      
        };
       

        
`;

exports[`drizzle > should handle multiple relationships 2`] = `
//file: schema.ts
import { relations } from "drizzle-orm";
import { pgTable, integer, text, primaryKey } from "drizzle-orm/pg-core";

export const UserTable = pgTable("User", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
});

export type User = typeof UserTable.$inferSelect; 
export const UserTableRelations = relations(UserTable, ({ many, many }) => ({
  followedBy: many(FollowTable),
  follows: many(FollowTable),
}));

export const FollowTable = pgTable(
  "Follow",
  {
    followedById: integer("followedById").notNull(),
    followingId: integer("followingId").notNull(),
  },
  (table) => ({
    pkFollows_followedby_user: primaryKey({
      name: "follows_followedby_user",
      columns: [table.followedById, table.followingId],
    }),
  }),
);

export type Follow = typeof FollowTable.$inferSelect; 
export const FollowTableRelations = relations(FollowTable, ({ one, one }) => ({
  followedBy: one(UserTable, {
    relationName: "followedBy",
    fields: [FollowTable.followedById],
    references: [UserTable.id],
  }),
  following: one(UserTable, {
    relationName: "follows",
    fields: [FollowTable.followingId],
    references: [UserTable.id],
  }),
}));

`;

exports[`drizzle > should parse base objects 1`] = `
model BaseModel {
          @uuid @id id: string; 
        };

        @table model BlogBO extends BaseModel {
          name:string;
        };

        @table model PostBO extends BaseModel {
          @map("blog_id") blogId: string;
          @relation(#{name:"blog", fields:#["blogId"], references:#["id"]}) blog:BlogBO;
        } 
  
   
        
`;

exports[`drizzle > should parse base objects 2`] = `
//file: schema.ts
import { pgTable, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const BlogBOTable = pgTable("BlogBO", {
  name: text("name").notNull(),
});

export type BlogBO = typeof BlogBOTable.$inferSelect; 
export const PostBOTable = pgTable("PostBO", {
  blogId: text("blog_id").notNull(),
});

export type PostBO = typeof PostBOTable.$inferSelect; 
export const PostBOTableRelations = relations(PostBOTable, ({ one }) => ({
  blog: one(BlogBOTable, {
    relationName: "blog",
    fields: [PostBOTable.blogId],
    references: [BaseModelTable.id],
  }),
}));

`;

exports[`drizzle > should parse objects 1`] = `

        @table("users") model User {
          @id _id: numeric;    
          comments:Comment[];   
        };

        @table("blogs") model Blog {
          @id id:numeric;
          content:string;
          @map("author_id") authorId:numeric;
          posts:Post[];
        };
        
        @table("comments") model Comment {
          @id id:numeric;
          text:string;
          @map("author_id") authorId:numeric;
          @map("post_id") postId:numeric;
          @relation(#{fields:#["postId"], references:#["id"]}) post: Post;
          @relation(#{fields:#["authorId"], references:#["id"]}) author: User;

        }
        @table("posts") model Post {
          @id id:string;
          @map("blog_id") blogId:string;
          @relation(#{name:"blog", fields:#["blogId"], references:#["id"]}) blog: Blog;
        } 
        
   
        
`;

exports[`drizzle > should parse objects 2`] = `
//file: schema.ts
import { relations } from "drizzle-orm";
import { pgTable, serial, text, numeric } from "drizzle-orm/pg-core";

export const UserTable = pgTable("users", {
  _id: serial("_id").primaryKey(),
});

export type User = typeof UserTable.$inferSelect; 
export const UserTableRelations = relations(UserTable, ({ many }) => ({
  comments: many(CommentTable),
}));

export const CommentTable = pgTable("comments", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  authorId: numeric("author_id").notNull(),
  postId: numeric("post_id").notNull(),
});

export type Comment = typeof CommentTable.$inferSelect; 
export const CommentTableRelations = relations(
  CommentTable,
  ({ one, one }) => ({
    post: one(PostTable, {
      relationName: "post",
      fields: [CommentTable.postId],
      references: [PostTable.id],
    }),
    author: one(UserTable, {
      relationName: "author",
      fields: [CommentTable.authorId],
      references: [UserTable._id],
    }),
  }),
);

export const PostTable = pgTable("posts", {
  id: text("id").primaryKey(),
  blogId: text("blog_id").notNull(),
});

export type Post = typeof PostTable.$inferSelect; 
export const PostTableRelations = relations(PostTable, ({ one }) => ({
  blog: one(BlogTable, {
    relationName: "blog",
    fields: [PostTable.blogId],
    references: [BlogTable.id],
  }),
}));

export const BlogTable = pgTable("blogs", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  authorId: numeric("author_id").notNull(),
});

export type Blog = typeof BlogTable.$inferSelect; 
export const BlogTableRelations = relations(BlogTable, ({ many }) => ({
  posts: many(PostTable),
}));

`;

exports[`drizzle > should work with composite keys 1`] = `

        @table model User {
          @id id: integer;
          name:string;
        };
        @table model Book {
          @id id: integer;
          name: string;
        };
        @table("books_to_authors") 
        @id("booksToAuthor", #["authorId", "bookId"])
        model BooksToAuthors {
          authorId: integer;
          bookId: integer;
        };
 
        
`;

exports[`drizzle > should work with composite keys 2`] = `
//file: schema.ts
import { pgTable, integer, text, primaryKey } from "drizzle-orm/pg-core";

export const UserTable = pgTable("User", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
});

export type User = typeof UserTable.$inferSelect; 
export const BookTable = pgTable("Book", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
});

export type Book = typeof BookTable.$inferSelect; 
export const BooksToAuthorsTable = pgTable(
  "books_to_authors",
  {
    authorId: integer("authorId").notNull(),
    bookId: integer("bookId").notNull(),
  },
  (table) => ({
    pkBooksToAuthor: primaryKey({
      name: "books_to_author",
      columns: [table.authorId, table.bookId],
    }),
  }),
);

export type BooksToAuthors = typeof BooksToAuthorsTable.$inferSelect; 
`;

exports[`drizzle > should work with default values 1`] = `
@table("ex") model ExampleDefaultValue {
         name?: string = "foo";
         count:int32 = 1;
        };
        
        
`;

exports[`drizzle > should work with default values 2`] = `
//file: schema.ts
import { pgTable, text, integer } from "drizzle-orm/pg-core";

export const ExampleDefaultValueTable = pgTable("ex", {
  name: text("name").default("foo"),
  count: integer("count").notNull().default(1),
});

export type ExampleDefaultValue = typeof ExampleDefaultValueTable.$inferSelect; 
`;

exports[`drizzle > should work with defaults 1`] = `

    @table model Uuid {
      @default(int32(42)) int1:integer; 
      @default("'42'::integer'") int2:integer;
      @uuid(true) uuid1: string;
      @uuid @default("gen_random_uuid()")  uuid2: string;
    };
    
`;

exports[`drizzle > should work with defaults 2`] = `
//file: schema.ts
import { pgTable, integer, uuid } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const UuidTable = pgTable("Uuid", {
  int1: integer("int1").notNull().default(42),
  int2: integer("int2")
    .notNull()
    .default(sql\`'42'::integer'\`),
  uuid1: uuid("uuid1").defaultRandom().notNull(),
  uuid2: uuid("uuid2")
    .notNull()
    .default(sql\`gen_random_uuid()\`),
});

export type Uuid = typeof UuidTable.$inferSelect; 
`;

exports[`drizzle > should work with enums 1`] = `

        enum State {
          do,
          doing,
          done,
          failed
        }
        @table model Action {
          @uuid @id id: string; 
          state:State;
        };
        
`;

exports[`drizzle > should work with enums 2`] = `
//file: schema.ts
import { pgTable, uuid, pgEnum } from "drizzle-orm/pg-core";

export const ActionTable = pgTable("Action", {
  id: uuid("id").defaultRandom().primaryKey(),
  state: StateEnum("state"),
});

export type Action = typeof ActionTable.$inferSelect; 
export const StateEnum = pgEnum("State", ["do", "doing", "done", "failed"]);

`;

exports[`drizzle > should work with indexes and unique email 1`] = `

    @table model User {
      @id id: integer;
      name:string;
      @index @unique email:string;
    };
    
`;

exports[`drizzle > should work with indexes and unique email 2`] = `
//file: schema.ts
import { uniqueIndex, pgTable, integer, text } from "drizzle-orm/pg-core";
import {} from "drizzle-orm";

export const UserTable = pgTable(
  "User",
  {
    id: integer("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
  },
  (table) => ({
    emailIdx: uniqueIndex("email_idx").on(table.email),
  }),
);

export type User = typeof UserTable.$inferSelect; 
`;

exports[`drizzle > should work with indexes unique with sql 1`] = `

    @table model User {
      @id id: integer;
      name:string;
      @index("email", "lower({column})") @unique  email:string;
    };
    
`;

exports[`drizzle > should work with indexes unique with sql 2`] = `
//file: schema.ts
import { uniqueIndex, pgTable, integer, text } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const UserTable = pgTable(
  "User",
  {
    id: integer("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
  },
  (table) => ({
    email: uniqueIndex("email").on(sql\`lower(\${table.email})\`),
  }),
);

export type User = typeof UserTable.$inferSelect; 
`;

exports[`drizzle > should work with timestamps 1`] = `

    @table model Time {
      timestamp1:Date;
      @default("now()") timestamp2:Date;
    };
    
`;

exports[`drizzle > should work with timestamps 2`] = `
//file: schema.ts
import { pgTable, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const TimeTable = pgTable("Time", {
  timestamp1: timestamp("timestamp1").notNull(),
  timestamp2: timestamp("timestamp2")
    .notNull()
    .default(sql\`now()\`),
});

export type Time = typeof TimeTable.$inferSelect; 
`;

exports[`drizzle > use the relation decorator 1`] = `
@table("users") model User {
          @uuid @id id: string; 
          @unique email: string;
          rank: int32;
          @map("cool_score") coolScore: int32;
        };
        @table("blogs") model Blog {
          @uuid @id id: string; 
          @unique name: string;
          posts: Post[];
        };
        @table("posts") model Post {
          @uuid @id id: string; 
          title: string;
          content: string;
          blogId: string;
          @relation(#{fields:#["blogId"]}) blog: Blog;
        };
        
`;

exports[`drizzle > use the relation decorator 2`] = `
//file: schema.ts
import { pgTable, uuid, text, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const UserTable = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  rank: integer("rank").notNull(),
  coolScore: integer("cool_score").notNull(),
});

export type User = typeof UserTable.$inferSelect; 
export const BlogTable = pgTable("blogs", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
});

export type Blog = typeof BlogTable.$inferSelect; 
export const BlogTableRelations = relations(BlogTable, ({ many }) => ({
  posts: many(PostTable),
}));

export const PostTable = pgTable("posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  blogId: text("blogId").notNull(),
});

export type Post = typeof PostTable.$inferSelect; 
export const PostTableRelations = relations(PostTable, ({ one }) => ({
  blog: one(BlogTable, {
    relationName: "blog",
    fields: [PostTable.blogId],
    references: [BlogTable.id],
  }),
}));

`;
