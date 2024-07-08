exports[`examples > Configure namespaces 1`] = `

Using [@config](/docs/tsdocs/functions/$config) you can configure the dialect and namespace.  You
can also specify the output file.   This is still a experimental feature.  They are all experimental
features.

`;

exports[`examples > Configure namespaces 2`] = `

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
      
`;

exports[`examples > Configure namespaces 3`] = `



import { sqliteTable, uuid, text } from "drizzle-orm/sqlite-core";

export const NSBlogTable = sqliteTable("NSBlog", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
});

export type NSBlog = typeof NSBlogTable.$inferSelect; 

import { mysqlTable, uuid, text } from "drizzle-orm/mysql-core";

export const MyBlogTable = mysqlTable("MyBlog", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
});

export type MyBlog = typeof MyBlogTable.$inferSelect; 

`;

exports[`examples > Create a simple model 1`] = `

This example shows how to use create a model with a uuid primary key.
Notice how description is optional. [@table](/docs/tsdocs/functions/$table) will mark
a table to be in included in the database.


`;

exports[`examples > Create a simple model 2`] = `

 @table model Blog {
 @uuid @id id: string;
 name: string;
 description?: string;
 };      
    
`;

exports[`examples > Create a simple model 3`] = `

`;

exports[`examples > Many-to-one 1`] = `

This example shows how to use a many-to-one relationship.   Notice how the relation is marked
with [@relation](/docs/tsdocs/functions/$relation).  
Fields map to the local fields of the model, relations map to the foreign key(s) in the other model.


`;

exports[`examples > Many-to-one 2`] = `

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

exports[`examples > Many-to-one 3`] = `

`;

exports[`examples > Naming columns and tables 1`] = `

 By default it uses the model name, however passing a string to [@table](/docs/tsdocs/functions/$table) will 
 use that as the table name.    

 For columns use *[@map](/docs/tsdocs/functions/$map)* to map the column name to the database column name.

 
`;

exports[`examples > Naming columns and tables 2`] = `

        @table("blogs") model Blog {
        @map("_id") @uuid @id id: string;
        @map("label") name: string;
        @map("note") description?: string;
        };      
           
`;

exports[`examples > Naming columns and tables 3`] = `

`;

exports[`examples > Simple example using @default 1`] = `

For default values for columns use [@default](/docs/tsdocs/functions/$default).   This can
take a string with an SQL query or a literal.   All strings get evaluated as SQL so you will
need to escape them to use a literal.

`;

exports[`examples > Simple example using @default 2`] = `

@table model Stuff {
     @id id: numeric;
     @default("now()") createdDate: Date;
     @default(int32(42)) answer:int32;
};
            
            
`;

exports[`examples > Simple example using @default 3`] = `

`;
