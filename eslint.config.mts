import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import stylistic from '@stylistic/eslint-plugin'

export default defineConfig([
  globalIgnores([
    "./dist"
  ]),
  js.configs.recommended,
  ...tseslint.configs.recommended,
  { files: ["src/**/*.{js,mjs,cjs,ts,mts,cts}"], languageOptions: { globals: globals.browser }},
  { 
    files: ["src/**/*.{js,mjs,cjs,ts,mts,cts}"], 
    plugins: { stylistic },
    rules: {
      "stylistic/array-bracket-newline": "error",
      "stylistic/array-bracket-spacing": "error",
      "stylistic/arrow-parens": "error",
      "stylistic/arrow-spacing": "error",
      "stylistic/block-spacing": "error",
      "stylistic/comma-dangle": "error",
      "stylistic/comma-spacing": "error",
      "stylistic/comma-style": "error",
      "stylistic/computed-property-spacing": "error",
      "stylistic/function-call-spacing": "error",
      "stylistic/implicit-arrow-linebreak": "error",
      "stylistic/indent": ["error", 2],
      "stylistic/indent-binary-ops": ["error", 2],
      "stylistic/key-spacing": ["error", { "beforeColon": false, "afterColon": true, "align": { "on": "value", "mode": "minimum" } }],
      "stylistic/keyword-spacing": "error",
      "stylistic/line-comment-position": ["error", { "position": "above" }],
      "stylistic/linebreak-style": ["error", "unix"],
      "stylistic/lines-between-class-members": "error",
      "stylistic/max-len": ["warn", { "code": 100, "ignoreComments": true, "ignoreUrls": true, "ignoreStrings": true, "ignoreTemplateLiterals": true, "ignorePattern": "class .+ extends|^\\s*\\w+:\\s*\\w+" }],
      "stylistic/member-delimiter-style": "error",
      "stylistic/multiline-comment-style": ["error", "starred-block"],
      "stylistic/new-parens": "error",
      "stylistic/no-confusing-arrow": "error",
      "stylistic/no-extra-semi": "error",
      "stylistic/no-mixed-spaces-and-tabs": "error",
      "stylistic/no-tabs": "error",
      "stylistic/no-trailing-spaces": "error",
      "stylistic/no-whitespace-before-property": "error",
      "stylistic/quotes": ["error", "double"]
  }}
]);
