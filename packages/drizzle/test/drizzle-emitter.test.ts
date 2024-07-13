import { describe, it, beforeEach } from "node:test";
import { SkibididrizzTestContext } from "@skibididrizz/common";
import { DrizzleTestLibrary } from "../src/testing/index.js";

describe("drizzle", () => {
  let ctx: SkibididrizzTestContext;

  beforeEach(async () => {
    ctx = new SkibididrizzTestContext(DrizzleTestLibrary);
  });
  it("should work with timestamps", async (t) => {
    await ctx.snapshotEmittedTypescript(
      t,
      `
    @table model Time {
      timestamp1:Date;
      @default("now()") timestamp2:Date;
    };
    `,
    );
  });
  it("should work with defaults", async (t) => {
    await ctx.snapshotEmittedTypescript(
      t,
      `
    @table model Uuid {
      @default(int32(42)) int1:integer; 
      @default("'42'::integer'") int2:integer;
      @uuid(true) uuid1: string;
      @uuid @default("gen_random_uuid()")  uuid2: string;
    };
    `,
    );
  });
  it("should work with indexes and unique email", async (t) => {
    await ctx.snapshotEmittedTypescript(
      t,
      `
    @table model User {
      @id id: integer;
      name:string;
      @index @unique email:string;
    };
    `,
    );
  });
  it("should work with indexes unique with sql", async (t) => {
    await ctx.snapshotEmittedTypescript(
      t,
      `
    @table model User {
      @id id: integer;
      name:string;
      @index("email", "lower({column})") @unique  email:string;
    };
    `,
    );
  });
  it("should handle multiple relationships", async (t) => {
    await ctx.snapshotEmittedTypescript(
      t,
      `
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
       

        `,
    );
  });
  it("should work with composite keys", async (t) => {
    await ctx.snapshotEmittedTypescript(
      t,
      `
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
 
        `,
    );
  });
  it("should work with enums", async (t) => {
    const result = await ctx.snapshotEmittedTypescript(
      t,
      `
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
        `,
    );
  });
  it("should parse base objects", async (t) => {
    const result = await ctx.snapshotEmittedTypescript(
      t,
      `model BaseModel {
          @uuid @id id: string; 
        };

        @table model BlogBO extends BaseModel {
          name:string;
        };

        @table model PostBO extends BaseModel {
          @map("blog_id") blogId: string;
          @relation(#{name:"blog", fields:#["blogId"], references:#["id"]}) blog:BlogBO;
        } 
  
   
        `,
    );
  });
  it("should parse objects", async (t) => {
    const result = await ctx.snapshotEmittedTypescript(
      t,
      `
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
        
   
        `,
    );
  });
  it("use the relation decorator", async (t) => {
    const [code, diagnostics] = await ctx.snapshotEmittedTypescript(
      t,
      `@table("users") model User {
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
        `,
    );
  });
  it("should work with default values", async (t) => {
    const [code, diagnostics] = await ctx.snapshotEmittedTypescript(
      t,
      `@table("ex") model ExampleDefaultValue {
         name?: string = "foo";
         count:int32 = 1;
        };
        
        `,
    );
  });
});
