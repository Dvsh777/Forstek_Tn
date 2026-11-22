import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  // Medusa's official Translation Module. defineConfig lists it as a default
  // module but decides `disable` while this file is still being evaluated, when
  // only the MEDUSA_FF_TRANSLATION env var is visible, not `featureFlags`. So
  // the module is registered explicitly below, and the flag is set here for the
  // translation API routes and links.
  featureFlags: {
    translation: true,
  },
  modules: [
    {
      resolve: '@medusajs/medusa/translation',
    },
  ],
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET,
      cookieSecret: process.env.COOKIE_SECRET,
    }
  }
})
