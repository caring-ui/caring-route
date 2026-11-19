<!--
 * @Author: Wanko
 * @Date: 2023-04-27 17:39:09
 * @LastEditors: Wanko
 * @LastEditTime: 2026-01-13 10:45:28
 * @Description: 
-->
# caring-route

适用于 uniapp 的路由框架

## [文档](https://caringui.cn/module/caring-route.html)

## [npm](https://www.npmjs.com/package/caring-route)

## 工程结构
本仓库为 pnpm workspace monorepo：
- `packages/caring-route`：库源码（rollup 打包，发布到 npm）
- `playground`：uni-app 演示工程（不发布，通过 `workspace:*` 消费本地库）

> 全仓统一使用 **pnpm**，勿混用 npm（会生成 `package-lock.json` 并破坏 workspace 软链接）。

## 运行
需要 pnpm（推荐 Node 18+，当前验证环境 Node 22 + pnpm 10；uni-app 旧版依赖官方曾推荐 Node 14）。
```bash
pnpm install
pnpm dev          # 启动演示工程 dev:mp-weixin
```
调试库源码时，`playground/vite.config.js` 的 alias 默认指向 `packages/caring-route/src`，改源码即时热更；
注释掉该 alias 即走 `dist` 产物，可用于发布前验证打包结果与包元数据。

## 构建库
```bash
pnpm build        # 仅构建 packages/caring-route → dist
```

## 发布
发布前需先提交代码到 master 分支，然后执行以下命令（只维护 `packages/caring-route` 的版本号）：
```bash
pnpm pub
```