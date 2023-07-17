import type { UserConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";

const isDev = process.env.__DEV__ === "true";
const isProduction = !isDev;

const config: UserConfig = {
  plugins: [react()],
  build: {
    outDir: "dist/js",
    sourcemap: isDev,
    minify: isProduction,
    reportCompressedSize: isProduction,
    rollupOptions: {
      input: {
        popup: path.resolve(__dirname, "src/view/features/popup/index.tsx"),
        options: path.resolve(__dirname, "src/view/features/options/index.tsx"),
        background: path.resolve(__dirname, "src/background/index.ts"),
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: isDev ? "assets/[name].js" : "assets/[name].[hash].js",
      },
    },
  },
};

export default config;
