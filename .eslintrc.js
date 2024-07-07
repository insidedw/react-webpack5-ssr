module.exports = {
  parser: '@babel/eslint-parser',
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  settings: {
    react: {
      version: '18.2.0',
    },
  },
  plugins: ['react', 'jsx-a11y', 'import', 'prettier'],
  rules: {
    'spaced-comment': ['error', 'always', { markers: ['/'] }],
    'prettier/prettier': ['error'],
    semi: ['error', 'never'],
    'import/no-cycle': [
      'error',
      {
        maxDepth: 10,
        ignoreExternal: true,
      },
    ],
    'no-unused-vars': 'off',
  },
}
