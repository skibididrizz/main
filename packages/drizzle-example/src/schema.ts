import { pgTable, uuid, text, integer, relations } from "drizzle-orm/pg-core";

export const UserTable = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  rank: integer("rank").notNull(),
  coolScore: integer("cool_score").notNull(),
});
export type User = typeof UserTable.$inferSelect; // return type when queried

export const BlogTable = pgTable("blogs", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
});
export type Blog = typeof BlogTable.$inferSelect; // return type when queried

export const PostTable = pgTable("posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  blog: uuid("blog_id").references(() => BlogTable.id),
});
export type Post = typeof PostTable.$inferSelect; // return type when queried
