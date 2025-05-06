// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // se você já precisava liberar o host do Lovable.dev, mantenha:
    allowedHosts: [
      "8bec1236-4721-4f49-9be7-a59f2387f00c.lovableproject.com"
    ],
    // ou, em dev, liberar tudo:
    // allowedHosts: "all",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // ****** adicione esta linha para forçar o bundle ESM do react-day-picker ******
      "react-day-picker$": "react-day-picker/dist/index.esm.js",
    },
  },
  optimizeDeps: {
    // ****** garante que o Vite pré-compile este pacote antes de rodar ******
    include: ["react-day-picker"],
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
}));
