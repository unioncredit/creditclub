import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    "process.env": process.env,
  },
  plugins: [
    react(),
    svgr({
      include: "**/*.svg",
    }),
    VitePWA({
      strategies: "injectManifest",
      registerType: "autoUpdate",
      manifest: {
        name: "Beta Credit Club",
        short_name: "CreditClub",
        description: "The first credit club filled with the most trustworthy people, helping to test trustless trust.",
        theme_color: "#f983a3",
        icons: [
          {
            src: "/icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
