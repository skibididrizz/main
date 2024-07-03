import { pgTable, numeric, text, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const UserTable = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  rank: integer("rank").notNull(),
  coolScore: integer("cool_score").notNull(),
});
export type User = typeof UserTable.$inferSelect; // return type when queried

export const BlogTable = pgTable("blogs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});
export type Blog = typeof BlogTable.$inferSelect; // return type when queried
export const BlogTableRelations = relations(BlogTable, ({ many }) => ({
  posts: many(PostTable),
}));

export const PostTable = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  blogId: integer("blog_id").notNull(),
});
export type Post = typeof PostTable.$inferSelect; // return type when queried
export const PostTableRelations = relations(PostTable, ({ one }) => ({
  blog: one(BlogTable, {
    relationName: "blog",
    fields: [PostTable.blogId],
    references: [BlogTable.id],
  }),
}));
