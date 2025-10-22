// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // All requests to '/api' will be forwarded to your backend server
      "/api": {
        target: "http://localhost:5001", // Your backend server address
        changeOrigin: true, // Recommended for virtual hosted sites
        secure: false, // Can be set to false if your backend is not using HTTPS
      },
    },
  },
});
