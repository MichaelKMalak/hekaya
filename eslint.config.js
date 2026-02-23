import tseslint from 'typescript-eslint';

export default tseslint.config(
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  {
    files: ['apps/**/*.ts'],
    rules: {
      'no-console': 'off',
    },
  },
  {
    ignores: ['**/dist/**', '**/node_modules/**', 'docs/**'],
  },
);
