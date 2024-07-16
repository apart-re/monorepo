/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["@apart-re/eslint-config/react.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
};
