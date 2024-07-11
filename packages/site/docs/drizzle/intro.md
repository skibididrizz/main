---
sidebar_position: -1
title: Getting Started
---

# Skibididrizz  Drizzle

Let's discover **Skibididrizz in less than 5 minutes**.

Skibididrizz is a project to use [typespec.io](https://typespec.io) to do type safe database access in typescript.   It uses [drizzle](https://orm.drizzle.team/), to do the DB access.  Currently only
postgres is supported, but if its useful, we can create others.  

## Getting Started

Get started by **installing @skibididrizz/drizzle**.
```sh
$ yarn install @skibididrizz/drizzle @typespec/compiler -D
```

Then adding the following line to `package.json`
```json
{
  "scripts":{
    "build": "tsp compile --emit @skibididrizz/drizzle ./lib/schema.tsp --option \"@skibididrizz/drizzle.emitter-output-dir={project-root}/drizzle\"",

  }
}

```

Create a schema file in `./lib/schema.tsp`

```
@table("user") User {
  @id id:numeric;
  name:string;

}


```

Then run build it to generate the schema.ts
```sh
$ yarn build
```


Go ahead and setup `drizzle.config.ts`.

```ts
import { defineConfig } from 'drizzle-kit'
export default defineConfig({
  schema: "./drizzle/schema.ts",
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DB_URL ?? 'postgresql://postgres:postgres@127.0.0.1:5432/postgres',
  },
  verbose: true,
  strict: true,
})
```


