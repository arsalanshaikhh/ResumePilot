import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    target: 'esnext',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          clerk: ['@clerk/clerk-react'],
          ui: [
            '@radix-ui/react-dialog', 
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-progress',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
          ],
          pdf: ['pdfjs-dist'],
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    // Allow larger chunks for document parsing libraries
    chunkSizeWarningLimit: 600,
    reportCompressedSize: true,
  },
  
  // Server configuration for development
  server: {
    port: 5173,
    host: true,
    open: false,
  },
  
  // Preview configuration for production testing
  preview: {
    port: 4173,
    host: true,
  },
  
  // Optimization for dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@clerk/clerk-react',
    ],
  },
})
