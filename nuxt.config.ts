export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss"],
  vite : {
    define: {
      googlemapsapikey : JSON.stringify(process.env.GOOGLEMAPS_API_KEY),
      googlegeminiproapikey : JSON.stringify(process.env.GOOGLEGEMINIPRO_API_KEY)
    }
  }
})