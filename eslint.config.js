import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { globalIgnores } from 'eslint/config'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // Autorise l'export de constantes à côté des composants — le préréglage
      // `vite` du plugin est trop strict pour des fichiers de données SEO.
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
  {
    // Point d'entrée : jamais hot-reloadé, les routes lazy ne sont pas
    // exportées par design.
    files: ['src/main.tsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
  {
    // Métadonnées SEO : que des constantes dérivées (Record), pas de
    // composants. Le plugin déclenche la règle car le fichier contient du
    // JSX — non pertinent ici.
    files: ['src/utils/routeMetas.tsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
])
