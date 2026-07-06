module.exports = {
  env: {
    node: true,
    es2022: true,
    jest: true,
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'commonjs',
  },
  rules: {
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-unreachable': 'error',
    'no-redeclare': 'error',
    'prefer-const': 'warn',
    'no-var': 'warn',
    eqeqeq: ['warn', 'smart'],
  },
  overrides: [
    {
      files: ['public/**/*.html'],
      rules: {
        'no-console': 'off',
      },
    },
  ],
  ignorePatterns: ['node_modules/', 'public/vendor/'],
};
