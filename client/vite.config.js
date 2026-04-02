import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const apiPort = process.env.KODMEX_API_PORT || "5001";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@shared": path.resolve(__dirname, "../shared")
    }
  },
  server: {
    port: 4173,
    proxy: {
      "/api": `http://127.0.0.1:${apiPort}`
    },
    fs: {
      allow: [path.resolve(__dirname, "..")]
    }
  }
});
