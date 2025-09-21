// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },
  modules: ["@nuxtjs/tailwindcss"],
  css: ["~/assets/css/main.css"],
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    }
  ],
  typescript: {
    strict: true,
    typeCheck: true,
    tsConfig: {
      compilerOptions: {
        module: "esnext",
        moduleResolution: "bundler",
        target: "es2022",
        lib: ["dom", "dom.iterable", "es2022"]
      },
    },
  },
  
  // RENDERIZAÇÃO PRINCIPALMENTE NO SERVIDOR
  ssr: true,
  
  // Configuração para SSG (geração estática) - opcional
  nitro: {
    prerender: {
      routes: ['/']
    }
  }
});
