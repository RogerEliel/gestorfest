import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // libera o host do Lovable.dev para o dev server
    allowedHosts: [
      "8bec1236-4721-4f49-9be7-a59f2387f00c.lovableproject.com"
    ]
    // se preferir liberar todos durante o dev:
    // allowedHosts: "all"
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
