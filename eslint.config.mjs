import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import prettier from 'eslint-config-prettier/flat';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  prettier,
  nextTs,
  ...nextVitals,
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'src/generated/**'
  ]),
])

export default eslintConfig