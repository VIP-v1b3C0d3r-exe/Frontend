import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,  // локально
    allowedHosts: [
      "ec2-51-20-182-189.eu-north-1.compute.amazonaws.com",
    ],
    proxy: {
      "/api": {
        target: "http://51.21.218.154:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  preview: {
    host: true,
    port: 80,  // на сервере
    allowedHosts: [
      "ec2-51-20-182-189.eu-north-1.compute.amazonaws.com",
    ],
  },
});