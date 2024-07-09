import {
  createTestLibrary,
  findTestPackageRoot,
  TypeSpecTestLibrary,
} from "@typespec/compiler/testing";

export const ZodTestLibrary: TypeSpecTestLibrary = createTestLibrary({
  name: "@skibididrizz/zod",
  packageRoot: await findTestPackageRoot(import.meta.url),
});
