import "@drizz/drizzle";

using Drizzle;

@table("users") 
model User {
 @uuid @id id: string;
 @unique email: string;
 rank: int32;
 @map("cool_score") coolScore: int32;
};

@table("blogs") 
model Blog {
  @uuid @id id: string;
  @unique name: string;
  posts: Post[];
};

@table("posts") 
model Post {
  @uuid @id id: string;
  title: string;
  content: string;
  @map("blog_id") @relation blog: Blog;
};
