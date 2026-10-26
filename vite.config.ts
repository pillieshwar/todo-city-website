import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  build: {
    target: "es2020",
    // three.js gets its own chunk so the page text shows before the city
    // loads. (Not in the build-time prerender, where three stays external.)
    rollupOptions: isSsrBuild ? {} : { output: { manualChunks: { three: ["three"] } } },
    chunkSizeWarningLimit: 900,
  },
}));
