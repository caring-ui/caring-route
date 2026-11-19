/*
 * @Author: Wanko
 * @Date: 2023-05-08 19:32:34
 * @LastEditors: Wanko
 * @LastEditTime: 2024-05-11 17:05:34
 * @Description:
 */
import terser from '@rollup/plugin-terser'
import { nodeResolve } from '@rollup/plugin-node-resolve'

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/index.js'
    }
  ],
  plugins: [nodeResolve(), terser()]
}
