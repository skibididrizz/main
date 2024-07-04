### Skibididrizz 
Skibididrizz is a schema for Drizzle, that is based on [TypeSpec](https://typespec.io).  This is an experimental implementation, and is not yet ready for production use.  It is inspired by [Prisma](https://prisma.io)'s schema layout.   From a schema.tsp file it
will generate a drizzle schema.  Currently only the postgres client is supported, but the idea is to support other clients.  This should ease the transition between clients.  In theory this could support a variety of ORM's. 

## Why?
I liked Prisma's schema, but disliked Prisma.   I was annoyed you couldn't add your own decorators to your models, and I wanted to be able to add my own decorators to my models.  [Drizzle](https://orm.drizzle.team/) seems to be the new hip kid in the TS ORM landscape so I figured I'd give it a try.
