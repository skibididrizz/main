import { createTypeSpecLibrary } from "@typespec/compiler";

export const $lib = createTypeSpecLibrary({
  name: "zod",
  diagnostics: {},
  state: {
    zod: {
      description: "Mark a model as a zod schema",
    },
    brand: {
      description: "Make a model brand",
    },
  },
});

export const {
  reportDiagnostic,
  createDiagnostic,
  stateKeys: StateKeys,
  createStateSymbol,
} = $lib;
