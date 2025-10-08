// This configuration only applies to the package manager root.
/** @type {import("eslint").Linter.Config} */
module.exports = {
  ignorePatterns: ["apps/**", "packages/**"],
  extends: ["@workspace/eslint-config/library.js", "plugin:prettier/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
}
