import pluginJs from "@eslint/js"
import simpleImportSort from "eslint-plugin-simple-import-sort"
import unusedImports from "eslint-plugin-unused-imports"
import globals from "globals"
import tseslint from "typescript-eslint"

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    ignores: [
      "/**/*.d.ts",
      "/**/*.types.ts",
      "*.next-env.js",
      "*.config.js",
      "package.json",
    ],
    plugins: {
      "simple-import-sort": simpleImportSort,
      "unused-imports": unusedImports,
    },
    rules: {
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
      "simple-import-sort/exports": "error",
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            ["server-only"],
            // For example: `^(${require("module").builtinModules.join("|")})(/|$)`
            [
              "^(assert|buffer|child_process|cluster|console|constants|crypto|dgram|dns|domain|events|fs|http|https|module|net|os|path|punycode|querystring|readline|repl|stream|string_decoder|sys|timers|tls|tty|url|util|vm|zlib|freelist|v8|process|async_hooks|http2|perf_hooks)(/.*|$)",
            ],

            // Group for 'react' and sub-paths like 'react/jsx-runtime'
            ["^react$", "^react/.+"],
            // Group for 'next' and sub-paths like 'next/router'
            ["^next$", "^next/.+"],

            ["^@?\\w"],

            // Internal packages.
            ["^data(/.*|$)"],

            ["^hooks(/.*|$)"],

            [
              "^(@|components|constants|contexts|data|helpers|utils|views)(/.*|$)",
            ],

            // Side effect imports.
            ["^\\u0000"],

            // Parent imports. Put `..` last.
            ["^\\.\\.(?!/?$)", "^\\.\\./?$"],

            // Other relative imports. Put same-folder imports and `.` last.
            ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],

            // Style imports.
            ["^.+\\.s?css$"],
          ],
        },
      ],
    },
  },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
]
