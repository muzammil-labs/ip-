import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
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
