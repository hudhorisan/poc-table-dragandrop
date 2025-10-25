import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/lib/index.js'),
      name: 'DraggableTable',
      fileName: (format) => `draggable-table.${format}.js`
    },
    rollupOptions: {
      // externalize react to avoid bundling it into the lib
      external: ['react', 'react-dom', 'antd'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          antd: 'antd'
        },
        exports: 'named'
      }
    }
  }
})
