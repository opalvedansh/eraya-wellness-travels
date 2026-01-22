import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8081,
    strictPort: true, // Always use port 8081, fail if not available
    proxy: {
      // Proxy API requests to backend server during development
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
    fs: {
      allow: ["."],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**"],
    },
  },
  build: {
    outDir: "dist/spa",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            // Maps - PRIORITIZE THIS to keep leaflet and react-leaflet together
            if (id.includes('leaflet')) {
              return 'map-vendor';
            }
            // React ecosystem
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            // UI and animation libraries
            if (id.includes('framer-motion') || id.includes('lucide-react')) {
              return 'ui-vendor-1';
            }
            // Radix UI components
            if (id.includes('@radix-ui')) {
              return 'ui-vendor-2';
            }
            // 3D libraries
            if (id.includes('three') || id.includes('@react-three')) {
              return '3d-vendor';
            }
            // Carousel
            if (id.includes('embla-carousel')) {
              return 'carousel-vendor';
            }
            // Forms and validation
            if (id.includes('react-hook-form') || id.includes('zod')) {
              return 'form-vendor';
            }
            // Other large libraries
            if (id.includes('recharts')) {
              return 'charts-vendor';
            }
            // Everything else from node_modules
            return 'vendor';
          }
          // Admin pages
          if (id.includes('/pages/admin/')) {
            return 'admin';
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
    minify: 'esbuild',
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
});
