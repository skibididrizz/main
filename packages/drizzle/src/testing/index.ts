import {
  createTestLibrary,
  findTestPackageRoot,
  TypeSpecTestLibrary,
} from "@typespec/compiler/testing";
export const DrizzleTestLibrary: TypeSpecTestLibrary = createTestLibrary({
  name: "@skibididrizz/drizzle",
  packageRoot: await findTestPackageRoot(import.meta.url),
});
