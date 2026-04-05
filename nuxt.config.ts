import { writeFileSync, existsSync } from 'fs'
import { resolve } from 'path'
import { loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// Load .env and write service account to file for firebase-admin
const env = loadEnv('', process.cwd(), '')
const saPath = resolve(process.cwd(), 'service-account.json')
if (env.GOOGLE_SERVICE_ACCOUNT) {
  if (!existsSync(saPath)) {
    writeFileSync(saPath, env.GOOGLE_SERVICE_ACCOUNT)
  }
  process.env.GOOGLE_APPLICATION_CREDENTIALS = saPath
}
// Remove FIREBASE_CONFIG from env — firebase-admin tries to parse it as JSON
// but we use JS-style syntax in .env. Config is hardcoded below instead.
delete process.env.FIREBASE_CONFIG

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4
  },

  modules: [
    'shadcn-nuxt',
    '@nuxtjs/color-mode',
    '@nuxtjs/google-fonts',
    '@vueuse/motion/nuxt',
    'nuxt-vuefire',
    '@nuxtjs/sitemap',
  ],

  vuefire: {
    config: {
      apiKey: 'AIzaSyCN1jQsmCuSsWmVCoj5wvecM7nsddEQg7g',
      authDomain: 'footyscope-dev.firebaseapp.com',
      projectId: 'footyscope-dev',
      storageBucket: 'footyscope-dev.firebasestorage.app',
      messagingSenderId: '269836117962',
      appId: '1:269836117962:web:8b13bea6e759102a0f1133',
      measurementId: 'G-3D2LS0RTPC',
    },
    auth: {
      enabled: true,
      sessionCookie: false,
    },
    analytics: true,
  },

  components: [
    { path: '~/components', pathPrefix: false },
  ],

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  shadcn: {
    prefix: '',
    componentDir: './app/components/ui',
  },

  colorMode: {
    classSuffix: '',
    preference: 'dark',
    fallback: 'dark',
  },

  googleFonts: {
    families: {
      'Inter': [400, 500, 600, 700],
      'Inter+Tight': [600, 700, 800, 900],
      'DM+Sans': [400, 500, 600, 700],
      'JetBrains+Mono': [400, 500, 600, 700],
    },
    display: 'swap',
  },

  runtimeConfig: {
    ownerEmails: env.OWNERS || '',
    public: {
      googleClientId: env.GOOGLE_CLIENT_ID || '',
    },
  },

  site: {
    url: 'https://footy-scope.com',
  },

  ssr: false,

  app: {
    head: {
      title: 'FootyScope — AFL Draft Scouting & Analytics',
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'description', content: 'AFL draft prospect scouting, rankings, and analytics platform.' },
        // Open Graph defaults
        { property: 'og:site_name', content: 'FootyScope' },
        { property: 'og:type', content: 'website' },
        { property: 'og:image', content: 'https://footy-scope.com/og-default.jpg' },
        { property: 'og:locale', content: 'en_AU' },
        // Twitter Card defaults
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@footyscope' },
        { name: 'twitter:image', content: 'https://footy-scope.com/og-default.jpg' },
      ],
    },
  },
})
