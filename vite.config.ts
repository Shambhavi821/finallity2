import { defineConfig } from "vite";

// Vite config for SpamShield AI
// Serves plain HTML/CSS/JS frontend and proxies /predict to Flask backend on port 5000
export default defineConfig({
  server: {
    proxy: {
      "/predict": "http://localhost:5000",
      "/api": "http://localhost:5000",
    },
  },
  build: {
    outDir: "dist",
  },
});
