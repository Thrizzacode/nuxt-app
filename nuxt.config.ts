// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  nitro: {
    experimental: {
      websocket: true,
    },
  },
  modules: ["@unocss/nuxt", "@nuxt/icon", "@pinia/nuxt"],
  unocss: {
    preflight: true,
  },
  css: ["@/assets/style/main.scss"],
});