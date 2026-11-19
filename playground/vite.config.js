import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import uni from '@dcloudio/vite-plugin-uni'

// 工作区库源码入口：开发期让 'caring-route' 指向源码，改源码即时热更
const libSrc = fileURLToPath(
  new URL('../packages/caring-route/src/index.js', import.meta.url)
)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [uni()],
  resolve: {
    alias: {
      // 开启：走库源码（热更调试）
      // 注释掉下一行：'caring-route' 将解析到 node_modules 软链接 → dist 产物，
      // 可用于发布前验证打包结果与包元数据（main/exports/files/依赖解析）
      'caring-route': libSrc
    }
  }
})
