### Drizz Drizzle

Drizz Drizzle is a schema for Drizzle, that is based on [TypeSpec](https://typespec.io). This is an experimental implementation, and is not yet ready for production use. It is inspired by [Prisma](https://prisma.io)'s schema layout. From a schema.tsp file it
will generate a drizzle schema. Currently only the postgres client is supported, but the idea is to support other clients. This should ease the transition between clients. In theory this could support a variety of ORM's.

## Why?

I liked Prisma's schema, but disliked Prisma. I was annoyed you couldn't add your own decorators to your models, and I wanted to be able to add my own decorators to my models. [Drizzle](https://orm.drizzle.team/) seems to be the new hip kid in the TS ORM landscape so I figured I'd give it a try.

## Setup.

To setup Drizz Drizzle, you need to install it as tsp plugin.

```sh
$ yarn install @skibididrizz/drizzle @typespec/compiler -D
```

And then add the following to scripts in your package.json. This will overwrite the 'schema.ts' in `drizzle/schema.ts` so be careful.

```js package.json
"scripts":{
    "build": "tsp compile --emit @skibididrizz/drizzle ./lib/schema.tsp --option \"@skibididrizz/drizzle.emitter-output-dir={project-root}/drizzle\"",
    ...
}
```

Create a 'lib/schema.tsp' file and add your models. The decorators are not well documented yet, but you can look at the tests to see how they work. Feel free to contribute patches.

##
