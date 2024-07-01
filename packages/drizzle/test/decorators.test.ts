import {describe, it, beforeEach} from "node:test";
import {BasicTestRunner, expectDiagnostics, extractCursor} from "@typespec/compiler/testing";
import {createDrizzleTestRunner, debugWithDiagnostics, emitWithDiagnostics} from "./test-host.js";

describe("@table", () => {
    let runner: BasicTestRunner;

    beforeEach(async () => {
        runner = await createDrizzleTestRunner();
    })
    it.only('should handle multiple relationships', async ()=>{
        await debugWithDiagnostics(
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
       

        `
        );
    })
    it('should work with composite keys', async ()=>{
       await debugWithDiagnostics(
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
 
        `
        );
    })
    it('should work with enums', async () => {
        const result = (await debugWithDiagnostics(
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
        `));
    });
    it('should parse base objects', async () => {
        const result = (await debugWithDiagnostics(
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
  
   
        `));

    });
    it('should parse objects', async () => {
        const result = (await debugWithDiagnostics(
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
        
   
        `));
    });
    it("set alternate name on operation", async () => {

        const [code, diagnostics] = (await emitWithDiagnostics(
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
          @relation(#{fields:#["blogId"]}) blog: Blog;
        };
        `
        ));

        console.log(code);
        for (const diag of diagnostics) {
            console.log(diag.message + ' [' + diag.code + '] ');
        }
    })

    // it("emit diagnostic if not used on an operation", async () => {
    //   const diagnostics = await runner.diagnose(
    //     `@alternateName("bar") model Test {}`
    //   );
    //   expectDiagnostics(diagnostics, {
    //     severity: "error",
    //     code: "decorator-wrong-target",
    //     message: "Cannot apply @alternateName decorator to Test since it is not assignable to Operation"
    //   })
    // });
    //
    //
    // it("emit diagnostic if using banned name", async () => {
    //   const {pos, source} = extractCursor(`@alternateName(┆"banned") op test(): void;`)
    //   const diagnostics = await runner.diagnose(
    //     source
    //   );
    //   expectDiagnostics(diagnostics, {
    //     severity: "error",
    //     code: "drizzle-decorator/banned-alternate-name",
    //     message: `Banned alternate name "banned".`,
    //     pos: pos + runner.autoCodeOffset
    //   })
    // });
});
