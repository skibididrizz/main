exports[`@table > should handle multiple relationships 1`] = `
import { relations } from "drizzle-orm";

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

exports[`@table > should parse base objects 1`] = `
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

exports[`@table > should parse objects 1`] = `
import { relations } from "drizzle-orm";

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

exports[`@table > should work with composite keys 1`] = `
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

exports[`@table > should work with defaults 1`] = `
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

exports[`@table > should work with enums 1`] = `
export const ActionTable = pgTable("Action", {
  id: uuid("id").defaultRandom().primaryKey(),
  state: StateEnum("state"),
});

export type Action = typeof ActionTable.$inferSelect; 
export const StateEnum = pgEnum("State", ["do", "doing", "done", "failed"]);

`;

exports[`@table > should work with indexes 1`] = `
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

exports[`@table > should work with indexes unique 1`] = `
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

exports[`@table > should work with timestamps 1`] = `
import { sql } from "drizzle-orm";

export const TimeTable = pgTable("Time", {
  timestamp1: timestamp("timestamp1").notNull(),
  timestamp2: timestamp("timestamp2")
    .notNull()
    .default(sql\`now()\`),
});

export type Time = typeof TimeTable.$inferSelect; 
`;

exports[`@table > use the relation decorator 1`] = `
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
