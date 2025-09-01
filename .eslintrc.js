module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  plugins: ['node'],
  extends: [
    'plugin:node/recommended', // Use the recommended settings from the Node plugin
    'eslint:recommended',
    'prettier', // If you're using Prettier for code formatting
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    // Customize your rules here
    'no-console': 'off', // Allow console logs
    'no-unused-vars': 'warn', // Warn for unused variables
    semi: ['error', 'always'], // Require semicolons
    'no-undef': ['error', { typeof: true }],
  },
  // Explicitly define 'process' as a global
  globals: {
    process: 'readonly',
  },
};
