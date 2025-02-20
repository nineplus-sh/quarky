import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import basicSsl from '@vitejs/plugin-basic-ssl';
import {sentryVitePlugin} from "@sentry/vite-plugin";
import "dotenv/config";

console.log("HEWWO EVERNYAN My Sentry Auth Token IS:", process.env.SENTRY_AUTH_TOKEN);

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
          url: "https://sentry.yggdrasil.cat/",
          org: "litdevs",
          project: "quarky",
          authToken: process.env.SENTRY_AUTH_TOKEN,

          bundleSizeOptimizations: {
              excludeDebugStatements: true,
              excludeReplayIframe: true,
              excludeReplayShadowDom: true
          },
          reactComponentAnnotation: { enabled: true },
          sourcemaps: {
              filesToDeleteAfterUpload: "**/*.js.map"
          },
          release: {
              setCommits: {
                  auto: true
              }
          }
      })
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/util/testup.js',
  }
})
