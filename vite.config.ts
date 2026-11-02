import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { docsPlugin } from "./scripts/docs-content.mjs";

export default defineConfig(({ isSsrBuild }) => ({
  // docsPlugin: the Markdown pages in src/docs/ as `virtual:docs` (see src/docs/README.md).
  plugins: [react(), docsPlugin()],
  build: {
    target: "es2020",
    // three.js gets its own chunk so the page text shows before the city
    // loads. (Not in the build-time prerender, where three stays external.)
    rollupOptions: isSsrBuild ? {} : { output: { manualChunks: { three: ["three"] } } },
    chunkSizeWarningLimit: 900,
  },
}));
