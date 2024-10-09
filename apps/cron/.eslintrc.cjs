/**
 * Specific eslint rules for this workspace, learn how to compose
 * @see https://github.com/belgattitude/perso/tree/main/packages/eslint-config-bases
 */

// Workaround for https://github.com/eslint/eslint/issues/3458
require('@openrouter-models/eslint-config-bases/patch/modern-module-resolution')

const { getDefaultIgnorePatterns } = require('@openrouter-models/eslint-config-bases/helpers')

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    extraFileExtensions: ['.json'],
    tsconfigRootDir: __dirname,
    project: 'tsconfig.json',
  },
  ignorePatterns: [...getDefaultIgnorePatterns(), 'src/generated'],
  extends: [
    '@openrouter-models/eslint-config-bases/prettier-plugin',
    '@openrouter-models/eslint-config-bases/typescript',
    'plugin:prettier/recommended',
  ],
  overrides: [
    {
      files: ['package.json', 'tsconfig.json'],
      rules: {
        '@typescript-eslint/no-unused-expressions': 'off',
      },
    },
  ],
}
