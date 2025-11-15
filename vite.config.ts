/// <reference types="vitest/config" />
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const isDev = mode === "development";
  const isProduction = !isDev;

  return {
    plugins: [react()],
    build: {
      outDir: "dist/js",
      sourcemap: isDev,
      minify: isProduction,
      reportCompressedSize: isProduction,
      rollupOptions: {
        input: {
          popup: resolve(__dirname, "src/entrypoints/popup.tsx"),
          sidePanel: resolve(__dirname, "src/entrypoints/sidePanel.tsx"),
          options: resolve(__dirname, "src/entrypoints/options.tsx"),
          background: resolve(__dirname, "src/entrypoints/background.ts"),
        },
        output: {
          entryFileNames: "[name].js",
          chunkFileNames: isDev
            ? "assets/[name].js"
            : "assets/[name].[hash].js",
        },
      },
    },
    test: {
      globals: true,
    },
  };
});
