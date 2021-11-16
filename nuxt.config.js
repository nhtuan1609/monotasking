// import colors from 'vuetify/es5/util/colors'

export default {
  ssr: false,
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: 'Monotasking - %s',
    title: 'Home',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['@/assets/css/main.scss'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/dateHelper.js', ssr: false },
    { src: '~/plugins/firebase.js', ssr: false }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: false,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios'
  ],

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      options: {
        customProperties: true
      },
      themes: {
        dark: {
          primary: '#60a3bc',
          primaryDark: '#3c6382',
          secondary: '#82ccdd',
          _primary: '#60a3bc',
          _secondary: '#2f3C4e',
          _accent: '#fca311',
          _base: '#f5f5f5',
          _white: '#ffffff',
          _text: '#191a1a',
          _success: '#43a047',
          _warning: '#ff9800',
          _error: '#d32f2f',
          _clickable: '#0654ba',
          _hightLight: '#fffde7'
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},

  // env information using to connect width realtime database
  env: {
    API_KEY: 'AIzaSyBqbOBPePEyTvabTrKDZe8b1ZNPq56TS48',
    AUTH_DOMAIN: 'monotasking-380c8.firebaseapp.com',
    PROJECT_ID: 'monotasking-380c8',
    STORAGE_BUCKET: 'monotasking-380c8.appspot.com',
    MESSAGING_SENDER_ID: '242889508859',
    APP_ID: '1:242889508859:web:11156011714f21ef8e2d5e',
    MEASUREMENT_ID: 'G-8JHERJPLWR'
  }
}
