import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import jsconfigPaths from "vite-jsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    jsconfigPaths(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        short_name: "AbhayamDevelopers",
        name: "AbhayamDevelopers",
        icons: [
          {
            src: "/images/logo1(2).png",
            type: "image/png",
            sizes: "192x192",
          },
          {
            src: "/images/logo1(2).png",
            type: "image/png",
            sizes: "512x512",
          },
        ],
        start_url: ".",
        display: "standalone",
        theme_color: "#000000",
        background_color: "#000000",
      },
    }),
  ],
  build: {
    commonjsOptions: { transformMixedEsModules: true },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString();
          }
        },
      },
    },
  },
});
