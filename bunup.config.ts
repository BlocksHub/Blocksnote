import { defineConfig } from "bunup";

export default defineConfig({
  clean: true,
  dts: {
    inferTypes: false
  },
  entry: [
    "src/index.ts"
  ],
  format: ["cjs", "esm"],
  minify: false,
  outDir: "dist",
  splitting: false,
  target: "browser"
});
