/**
 * Specific eslint rules for this app/package, extends the base rules
 * @see https://github.com/belgattitude/nextjs-monorepo-example/blob/main/docs/about-linters.md
 */

// Workaround for https://github.com/eslint/eslint/issues/3458 (re-export of @rushstack/eslint-patch)
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
  ignorePatterns: [...getDefaultIgnorePatterns(), '.next', '.out'],
  extends: [
    '@openrouter-models/eslint-config-bases/prettier-plugin',
    '@openrouter-models/eslint-config-bases/react',
    '@openrouter-models/eslint-config-bases/tailwind',
    '@openrouter-models/eslint-config-bases/typescript',
    'plugin:@next/next/core-web-vitals',
    'plugin:eslint-plugin-next-on-pages/recommended',
    'plugin:prettier/recommended',
    'plugin:tailwindcss/recommended',
  ],
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
    '@typescript-eslint/no-base-to-string': 'off',
    '@typescript-eslint/no-empty-object-type': 'off',
    'jsx-a11y/heading-has-content': 'off',
    'tailwindcss/no-custom-classname': 'off',
    'tailwindcss/no-contradicting-classname': 'off',
  },
  settings: {
    tailwindcss: {
      callees: ['cn', 'cva'],
      config: 'tailwind.config.ts',
    },
    next: {
      rootDir: ['.'],
    },
  },
  overrides: [
    {
      files: ['lib/fonts.ts'],
      rules: {
        'import/no-unresolved': 'off',
      },
    },
    {
      files: ['next.config.mjs', 'src/lib/env/*.mjs'],
      rules: {
        'import/order': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
      },
    },
    {
      files: ['tailwind.config.ts'],
      rules: {
        '@typescript-eslint/no-require-imports': 'off',
      },
    },
    {
      files: ['package.json', 'tsconfig.json'],
      rules: {
        '@typescript-eslint/no-unused-expressions': 'off',
      },
    },
  ],
}
