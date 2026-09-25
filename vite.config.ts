import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "./",
  plugins: [
    react(),
    tailwindcss(),
    // UI-5.2. injectManifest (not generateSW): src/sw.ts owns the service worker
    // source so it can importScripts the real mockServiceWorker.js into the same
    // worker instead of registering a second one at the same scope (see src/sw.ts
    // and main.tsx for why). injectRegister is off because main.tsx's own
    // worker.start() call is what registers sw.js in a build (via MSW's client).
    VitePWA({
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.ts",
      injectRegister: false,
      injectManifest: {
        // The mock worker and its runtime chunk are handled by MSW's own update
        // path, not Workbox precaching; everything else (app shell, fonts, icons,
        // data) is precached. public/plates/ is empty until C6's plate images
        // exist (network policy blocks Wikimedia); add "plates/**/*.{webp,png}"
        // back here once they do.
        globPatterns: ["**/*.{js,css,html,woff2,ico}", "icons/*.{png,svg}"],
        globIgnores: ["mockServiceWorker.js"],
      },
      devOptions: { enabled: false },
      manifest: {
        name: "IP-SAKTI Sahayak",
        short_name: "IP-SAKTI",
        description: "Every answer has a clause behind it. IP and biodiversity guidance for Ayurveda innovators.",
        start_url: ".",
        display: "standalone",
        background_color: "#F6F8F5",
        theme_color: "#F6F8F5",
        icons: [
          { src: "icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "icons/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        // UI-5.1: named vendor chunks so react/motion/radix/msw cache independently
        // of app code and of each other, instead of one large vendor blob.
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          if (id.includes("/react/") || id.includes("/react-dom/") || id.includes("/scheduler/")) return "react";
          if (id.includes("/motion/") || id.includes("/framer-motion/")) return "motion";
          if (id.includes("/@radix-ui/")) return "radix";
          if (id.includes("/msw/") || id.includes("/@mswjs/") || id.includes("/@bundled-es-modules/") || id.includes("/@open-draft/") || id.includes("/outvariant/") || id.includes("/strict-event-emitter/")) return "msw";
          return undefined;
        },
      },
    },
  },
});
