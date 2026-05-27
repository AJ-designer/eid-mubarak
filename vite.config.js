import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Change the 'base' to your GitHub repo name for GitHub Pages deployment:
// e.g.  base: "/eid-mubarak/"
export default defineConfig({
  plugins: [react()],
  base: "/eid-mubarak/",
});
