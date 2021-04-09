import colors from 'vuetify/es5/util/colors'
export default {
    // Global page headers: https://go.nuxtjs.dev/config-head
    head: {
        title: 'Autoabastecimiento',
        htmlAttrs: {
            lang: 'es'
        },
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: '' }
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
        ]
    },

    // Global CSS: https://go.nuxtjs.dev/config-css
    css: [],

    // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
    plugins: [],

    // Auto import components: https://go.nuxtjs.dev/config-components
    components: true,

    // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
    buildModules: [
        '@nuxtjs/vuetify',
    ],

    // Modules: https://go.nuxtjs.dev/config-modules
    modules: [
        '@nuxtjs/axios',
        'nuxtjs-mdi-font',
        'nuxt-leaflet',
        '@nuxtjs/auth'
    ],
    axios: {
        proxy: true
    },
    router: {
        middleware: ['auth']
    },
    auth: {
        localStorage: false,
        cookie: {
            prefix: 'sec.',
            options: {
                path: '/',
                expires: 1825
            }
        },
        redirect: {
            login: '/login',
            logout: '/login',
            home: '/'
        },
        strategies: {
            local: {
                endpoints: {
                    login: { url: '/api/login', method: 'post', propertyName: 'data.token' },
                    logout: { url: '/api/logout', method: 'post' },
                    user: { url: '/api/me', method: 'get', propertyName: false }
                }
            }
        }
    },
    serverMiddleware: {
        '/api': '~/api'
    },

    // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
    vuetify: {
        customVariables: ['~/assets/variables.scss'],
        theme: {
            dark: false,
            themes: {
                dark: {
                    primary: '#0f7b4a',
                    // accent: colors.grey.darken3,
                    // secondary: colors.amber.darken3,
                    // info: colors.teal.lighten1,
                    // warning: colors.amber.base,
                    error: colors.deepOrange.accent4,
                    // success: colors.green.accent3
                },
                ligth: {
                    primary: '#f00'
                }
            }
        },
        defaultAssets: false,
        icons: {
            iconfont: 'mdi', // default - only for display purposes
        },
    },

    // Build Configuration: https://go.nuxtjs.dev/config-build
    build: {}
}