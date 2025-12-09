// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist/', 'coverage/', '.env*', '*.log'] },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: {
          allowDefaultProject: ['*.js', '*.mjs'],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      // WARNING: Previous rule was 'off'. Changed to 'warn' for better type safety.
      // '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',

      '@typescript-eslint/no-floating-promises': 'warn',

      // WARNING: Previous rule was 'off'. Changed to 'warn' to catch unsafe calls.
      // '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-call': 'warn',

      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',

      // WARNING: Previous rule was 'off'. Changed to 'warn' to catch unsafe assignments.
      // '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'warn',

      // WARNING: Previous rule was 'off'. Changed to 'warn' to catch unsafe member access.
      // '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
    },
  },
  eslintPluginPrettierRecommended,
);
