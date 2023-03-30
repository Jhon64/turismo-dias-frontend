import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
// https://vitejs.dev/config/
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {},
    },
  },
  plugins: [
    vue({ template: { transformAssetUrls } }),
    vueJsx(),
    quasar({
      sassVariables: "src/quasar-variables.scss",
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@assets": fileURLToPath(new URL("./src/assets", import.meta.url)),
      "@views": fileURLToPath(new URL("./src/views", import.meta.url)),
      "@maestros_view": fileURLToPath(
        new URL("./src/views/maestros", import.meta.url)
      ),
      "@components": fileURLToPath(
        new URL("./src/components", import.meta.url)
      ),
      "@services": fileURLToPath(new URL("./src/services", import.meta.url)),
      "@types": fileURLToPath(new URL("./src/common/@types", import.meta.url)),
      "@helpers": fileURLToPath(new URL("./src/helpers", import.meta.url)),
    },
  },
});
