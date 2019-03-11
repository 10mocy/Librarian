const pkg = require('./package')

const meta = {
  title: 'Librarian',
  description: 'Librarian',
  themeColor: '#ff8800'
}

module.exports = {
  mode: 'spa',
  srcDir: './client',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: meta.description },
      { name: 'theme-color', content: meta.themeColor }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: meta.themeColor },

  /*
  ** Global CSS
  */
  css: [
    '@fortawesome/fontawesome-free-webfonts',
    '@fortawesome/fontawesome-free-webfonts/css/fa-brands.css',
    '@fortawesome/fontawesome-free-webfonts/css/fa-regular.css',
    '@fortawesome/fontawesome-free-webfonts/css/fa-solid.css',
    '~/assets/css/scss/style.scss'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: ['~/plugins/vue-gravatar'],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    'nuxt-fontawesome'
  ],

  meta: {
    mobileAppIOS: true,
    name: meta.title,
    description: meta.description,
    theme_color: meta.themeColor,
    lang: 'ja'
  },

  manifest: {
    name: meta.title,
    short_name: meta.title,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    description: meta.description,
    lang: 'ja'
  },

  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {}
  },

  fontawesome: {
    imports: [
      {
        set: '@fortawesome/free-solid-svg-icons',
        icons: ['fas']
      }
    ]
  },

  serverMiddleware: ['~~/api']
}
