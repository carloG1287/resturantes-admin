import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  build: { target: "esnext" },
  server: { port: 3002, host: "0.0.0.0" }
});
