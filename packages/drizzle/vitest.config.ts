import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    resolveSnapshotPath: (testPath, snapExtension) =>
      testPath.replace(".ts", "") + ".snapshot.cjs",
  },
});
