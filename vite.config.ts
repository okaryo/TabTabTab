import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

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
        // FIXME: Remove when Vite supports it: Temporary workaround to suppress source map warnings during build.
        // ref: https://github.com/vitejs/vite/issues/15012
        onwarn: (warning, defaultHandler) => {
          if (isDev && warning.code === "SOURCEMAP_ERROR") {
            return;
          }

          defaultHandler(warning);
        },
      },
    },
    test: {
      globals: true,
    },
  };
});
