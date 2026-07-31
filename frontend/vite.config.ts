import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // The .env file lives at the repo root (../.env), not inside frontend/,
  // to match how the backend loads it (see README.md).
  envDir: "../",
});
