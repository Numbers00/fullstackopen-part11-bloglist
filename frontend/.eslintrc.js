/* eslint-env node */
module.exports = {
  'env': {
    'browser': true,
    'es6': true,
    'jest/globals': true,
    'cypress/globals': true
  },
  'extends': [
    'eslint:recommended',
    'plugin:react/recommended'
  ],
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true
    },
    'ecmaVersion': 2018,
    'sourceType': 'module'
  },
  'plugins': [
    'react', 'jest', 'cypress'
  ],
  'rules': {
    'indent': [
      'error',
      2
    ],
    'linebreak-style': [
      'error',
      'windows'
    ],
    'quotes': [
      'error',
      'single'
    ],
    'eqeqeq': 'error',
    'no-trailing-spaces': 'error',
    'object-curly-spacing': [
      'error', 'always'
    ],
    'arrow-spacing': [
      'error', { 'before': true, 'after': true }
    ],
    'no-console': 0,
    'react/prop-types': 0,
    'react/react-in-jsx-scope': 'off'
  },
  'overrides': [
    {
      'files': ['*.js'], // Apply semicolon rule to other JavaScript files
      'rules': {
        'semi': ['error', 'always'] // Require semicolons
      }
    },
    {
      'files': ['cypress/**/*.js'],
      'rules': {
        'semi': 'off' // Disable semicolon rule for Cypress files
      }
    },
  ],
  'settings': {
    'react': {
      'version': 'detect'
    }
  }
};
