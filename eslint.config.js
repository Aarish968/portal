import antfu from '@antfu/eslint-config'

export default antfu({
  unocss: true,
  stylistic: true,
  files: ['**/*.ts', '**/*.tsx'],
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      rules: {
        'no-console': 'off',
      },
    },
  ],
})
