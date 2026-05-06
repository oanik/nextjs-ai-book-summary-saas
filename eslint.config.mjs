import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import eslintConfigPrettier from 'eslint-config-prettier';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      ...jsxA11y.flatConfigs.recommended.rules,
    },
  },
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^react$', '^next', '^@?\\w'],
            ['^@/'],
            ['^\\.(?!.*\\.(css|scss|sass)$)'],
            ['^.+\\.(css|scss|sass)$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
    },
  },
  eslintConfigPrettier,
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
]);

export default eslintConfig;
