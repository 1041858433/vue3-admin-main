import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import ElementPlus from 'unplugin-element-plus/vite' // 不加这个配置，ElMessage出不来

// https://vitejs.dev/config/
export default ({ mode }) => defineConfig({
  plugins: [
    vue(),
    // 按需引入，主题色的配置，需要加上 importStyle: 'sass'
    Components({
      resolvers: [ElementPlusResolver({
        importStyle: 'sass'
      })],
    }),
    ElementPlus()
  ],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './'),
      '@': path.resolve(__dirname, 'src')
    },
  },
  base: './',
  server: {
    proxy: {
      '/api': {
        target: 'http://backend-api-02.newbee.ltd/manage-api/v1', // 凡是遇到 /api 路径的请求，都映射到 target 属性
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
        logLevel: 'debug', // 在终端输出
        onProxyRes(proxyRes, req, res) { // 请求头输出x-real-url2
          const realUrl = new URL(req.url || '', 'http://backend-api-02.newbee.ltd/manage-api/v1')?.href || ''
          proxyRes.headers['x-real-url2'] = realUrl
          console.log(req.url)
        }
      }
    }
  },
  css: {
    preprocessorOptions: {
      // 覆盖掉element-plus包中的主题变量文件
      scss: {
        additionalData: `@use "@/styles/element/index.scss" as *;`,
      },
    },
  },
})
