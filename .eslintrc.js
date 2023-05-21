module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  ignorePatterns: ["projects/**/*"],
  overrides: [
    {
      files: ["*.ts"],
      extends: [
        "eslint:recommended",
        "prettier",
        "plugin:import/recommended",
        "plugin:import/typescript",
        "plugin:@typescript-eslint/recommended",
      ],
      rules: {
        "sort-imports": [
          "error",
          {
            ignoreCase: false,
            ignoreDeclarationSort: true, // don"t want to sort import lines, use eslint-plugin-import instead
            ignoreMemberSort: false,
            memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
            allowSeparatedGroups: true,
          },
        ],
        "import/no-unresolved": [2, { caseSensitive: false }],
        "import/order": [
          "error",
          {
            groups: [
              "builtin",
              "external",
              "internal",
              ["sibling", "parent"],
              "index",
              "unknown",
            ],
            "newlines-between": "always",
            alphabetize: {
              order: "asc",
              caseInsensitive: true,
            },
          },
        ],
        "object-curly-spacing": ["error", "always"],
        quotes: ["error", "single"],
        "semi-style": ["error", "last"],
        semi: ["error", "always"],
        "max-len": ["error", { code: 85, comments: 150 }],
        "@typescript-eslint/no-non-null-assertion": "off",
        "comma-dangle": ["error", "always-multiline"],
      },
    },
  ],
  plugins: ["@typescript-eslint", "prettier", "import"],

  settings: {
    "import/resolver": {
      typescript: {
        project: "./tsconfig.json",
      },
    },
  },
};
