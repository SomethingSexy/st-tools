import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tsEslint from "typescript-eslint";
import tsParser from "@typescript-eslint/parser";

export default [
  js.configs.recommended,
  ...tsEslint.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js"],
    plugins: {
      "react-refresh": reactRefresh,
      "react-hooks": reactHooks,
    },
    languageOptions: {
      parser: tsParser,
    },
    rules: {
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "sort-imports": "error",
    },
  },
];
