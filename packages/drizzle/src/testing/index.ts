import {
  createTestLibrary,
  findTestPackageRoot,
  TypeSpecTestLibrary,
} from "@typespec/compiler/testing";
export const DrizzleTestLibrary: TypeSpecTestLibrary = createTestLibrary({
  name: "drizzle",
  packageRoot: await findTestPackageRoot(import.meta.url),
});
