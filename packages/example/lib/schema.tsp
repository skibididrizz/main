import "@skibididrizz/drizzle";

using Drizzle;

@config(#{dialect:"postgres"})
namespace ExamplePostgres;

@table("users") 
model User {
 @id id: numeric;
 @unique email: string;
 rank: int32;
 @map("cool_score") coolScore: int32;
};

/**
 * This is the blog
 */
@table("blogs") 
model Blog {
  @id id: numeric;
  @unique name: string;
  posts: Post[];
};

@table("posts") 
model Post {
  @id id: numeric;
  title: string;
  content: string;
  @map("blog_id") blogId:integer;
  @relation(#{fields:#["blogId"]}) blog: Blog;
};
