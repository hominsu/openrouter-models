const { getDefaultIgnorePatterns } = require('./src/helpers')

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    extraFileExtensions: ['.json'],
    tsconfigRootDir: __dirname,
    project: 'tsconfig.json',
  },
  ignorePatterns: [...getDefaultIgnorePatterns()],
  extends: ['./src/bases/prettier-plugin', './src/bases/typescript'],
  overrides: [
    {
      files: ['package.json', 'tsconfig.json'],
      rules: {
        '@typescript-eslint/no-unused-expressions': 'off',
      },
    },
  ],
}
