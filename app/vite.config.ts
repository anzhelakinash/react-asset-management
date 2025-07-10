import { defineConfig, normalizePath } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { viteStaticCopy } from "vite-plugin-static-copy";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [
      react(),
      viteStaticCopy({
        targets: [
          {
            src:
              normalizePath(
                path.resolve(__dirname, "./resources/nginx/conf/includes"),
              ) + "/[!.]*",
            dest: "../nginx/conf/includes",
          },
          {
            src: normalizePath(
              path.resolve(__dirname, "./resources/Staticfile"),
            ),
            dest: "..",
          },
        ],
      }),
    ],
    optimizeDeps: {
      include: ["@emotion/react"],
    },
    resolve: {
      dedupe: ["@emotion/react"],
    },
    build: {
      outDir: "./dist/public",
      sourcemap: mode === "development",
    },
    esbuild: {
      minifyIdentifiers: mode === "production",
    },
  };
});
