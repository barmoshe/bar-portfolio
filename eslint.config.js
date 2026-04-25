// Flat config (ESLint v9). Scope is intentionally narrow: a11y rules from
// jsx-a11y plus react-hooks correctness checks. The TypeScript compiler with
// `strict` + `noUnusedLocals` already covers the things core JS rules would
// duplicate, so `no-undef` / `no-unused-vars` stay off here.
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import globals from 'globals';

export default tseslint.config(
  { ignores: ['dist', 'node_modules', 'public/showcase.html', '.claude'] },
  {
    files: ['**/*.{ts,tsx,js,jsx,mjs}'],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parser: tseslint.parser,
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser, ...globals.es2022 },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.flatConfigs.recommended.rules,
      'no-undef': 'off',
      'no-unused-vars': 'off',
      'no-empty': ['error', { allowEmptyCatch: true }],
    },
  },
);
