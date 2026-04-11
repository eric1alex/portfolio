import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        work: resolve(__dirname, 'work/index.html'),
        workDetail: resolve(__dirname, 'work/detail.html'),
        sideProjects: resolve(__dirname, 'side-projects/index.html'),
        sideProjectsDetail: resolve(__dirname, 'side-projects/detail.html'),
        creative: resolve(__dirname, 'creative/index.html'),
        photography: resolve(__dirname, 'creative/photography.html'),
        videography: resolve(__dirname, 'creative/videography.html'),
        design: resolve(__dirname, 'creative/design.html'),
        adminLogin: resolve(__dirname, 'admin/index.html'),
        adminDashboard: resolve(__dirname, 'admin/dashboard.html'),
      },
    },
    outDir: 'dist',
  },
  server: {
    open: true,
  },
})
