module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false
  },
  extends: ['@nuxtjs', 'prettier', 'plugin:prettier/recommended', 'plugin:nuxt/recommended'],
  // add your custom rules here
  rules: {
    'vue/no-mutating-props': 'warn',
    'comma-dangle': ['error', 'never']
  }
}
