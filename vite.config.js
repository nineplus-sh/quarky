import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import basicSsl from '@vitejs/plugin-basic-ssl'
import {sentryVitePlugin} from "@sentry/vite-plugin";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 2009
  },
  build: {
      sourcemap: true
  },
  plugins: [
      react({
          babel: {
              plugins: [
                  ["babel-plugin-react-compiler"]
              ]
          }
      }),
      basicSsl(),
      sentryVitePlugin({
          bundleSizeOptimizations: {
              excludeDebugStatements: true,
              excludeReplayIframe: true,
              excludeReplayShadowDom: true
          },
          reactComponentAnnotation: { enabled: true },
          sourcemaps: {
              filesToDeleteAfterUpload: "**/*.js.map"
          }
      })
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/util/testup.js',
  }
})
