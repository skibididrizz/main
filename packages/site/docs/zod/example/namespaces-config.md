

Using [@config](/docs/drizzle/api/decorators#@Drizzle.config) you can configure the dialect and namespace.  You
can also specify the output file.   This is still a experimental feature.  They are all experimental
features.


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

## schema.ts
```tsx
import { sqliteTable, uuid, text } from "drizzle-orm/sqlite-core";
import { mysqlTable, uuid, text } from "drizzle-orm/mysql-core";

export const NSBlogTable = sqliteTable("NSBlog", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
});

export type NSBlog = typeof NSBlogTable.$inferSelect; // return type when queried

export const MyBlogTable = mysqlTable("MyBlog", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
});

export type MyBlog = typeof MyBlogTable.$inferSelect; // return type when queried
```
         
