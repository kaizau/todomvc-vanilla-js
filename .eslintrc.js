module.exports = {
  extends: ["eslint:recommended", "plugin:prettier/recommended"],
  parserOptions: {
    sourceType: "module",
  },
  env: {
    browser: true,
    es2020: true,
  },
  rules: {
    "no-console": "error",
  },
};
