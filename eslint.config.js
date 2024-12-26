import antfu from '@antfu/eslint-config'

export default antfu({
  unocss: true,
  stylistic: true,
  files: ['**/*.ts', '**/*.tsx'],
  rules: {
    // 'no-console': 'off',
    'import/order': 'off',
  },
})
