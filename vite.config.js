import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        home: fileURLToPath(new URL("./index.html", import.meta.url)),
        work: fileURLToPath(new URL("./work.html", import.meta.url)),
        about: fileURLToPath(new URL("./about.html", import.meta.url)),
        contact: fileURLToPath(new URL("./contact.html", import.meta.url)),
      },
    },
  },
});