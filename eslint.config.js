import pluginVue from 'eslint-plugin-vue'
import vuePrettierConfig from '@vue/eslint-config-prettier'
import globals from 'globals'

export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'build/**'],
  },
  ...pluginVue.configs['flat/essential'],
  vuePrettierConfig,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-plusplus': 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'return' },
        { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
        {
          blankLine: 'never',
          prev: ['const', 'let', 'var'],
          next: ['const', 'let', 'var'],
        },
        { blankLine: 'always', prev: '*', next: 'block-like' },
        { blankLine: 'always', prev: 'block-like', next: '*' },
      ],
      'vue/order-in-components': [
        'error',
        {
          order: [
            'el',
            'name',
            'parent',
            'functional',
            ['delimiters', 'comments'],
            ['components', 'directives', 'filters'],
            'extends',
            'mixins',
            'inheritAttrs',
            'model',
            ['props', 'propsData'],
            'data',
            'computed',
            'watch',
            'LIFECYCLE_HOOKS',
            'methods',
            'head',
            ['template', 'render'],
            'renderError',
          ],
        },
      ],
    },
  },
  {
    files: ['**/tests/unit/**/*.spec.{j,t}s?(x)'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
      },
    },
  },
]
