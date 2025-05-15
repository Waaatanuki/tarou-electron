const antfu = require('@antfu/eslint-config').default

module.exports = antfu({
  unocss: true,
  rules: {
    'no-unused-vars': 'warn',
    'node/prefer-global/process': 'off',
  },
})