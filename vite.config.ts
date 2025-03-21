/// <reference types="vitest/config" />
import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

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
          popup: path.resolve(
            __dirname,
            "src/presentation/views/popup/index.tsx",
          ),
          sidePanel: path.resolve(
            __dirname,
            "src/presentation/views/sidePanel/index.tsx",
          ),
          options: path.resolve(
            __dirname,
            "src/presentation/views/options/index.tsx",
          ),
          background: path.resolve(__dirname, "src/background/index.ts"),
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
