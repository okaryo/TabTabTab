module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'autofix',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    'semi': ['error', 'never'],
    'quotes': ['error', 'single'],
    'no-trailing-spaces': ['error'],
    'no-multi-spaces': 'error',
    'autofix/no-unused-vars': 'error',
  },
}
