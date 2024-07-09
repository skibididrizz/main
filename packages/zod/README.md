# @skibididrizz/zod

A schema language based on [TypeSpec](https://typespec.io) that generates
[zod](https://github.com/colinhacks/zod) parsers. It is meant to be used with other
tooling to be able to have a single source of truth for models (i.e. the schema).

## Installation

Add the packages to your package.json

```sh
$ yarn add @skibididrizz/zod @typespec/compiler -D
```

Modify your build to generate the zod output

```json
"scripts":{
  "build":    "build": "tsp compile --emit @skibididrizz/zod ./lib/schema.tsp --option \"@skibididrizz/zod.emitter-output-dir={project-root}/src\"",

}
```

Create your schema in **lib/schema.tsp**

Run the build

```sh
$ yarn run build
```
