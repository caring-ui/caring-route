#!/usr/bin/env bash
###
 # @Author: Wanko
 # @Description: 发布 caring-route 到 npm。单版本源：只维护 packages/caring-route 的版本号。
###
set -e

cd "$(dirname "$0")/packages/caring-route"

CURRENT=$(node -p "require('./package.json').version")
echo "Current version is $CURRENT"
read -p "Enter release version: " VERSION
read -p "Releasing $VERSION - are you sure? (y/n) " -n 1 -r
echo  # move to a new line

if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "🕙 Releasing $VERSION ..."
  # bump 版本并生成 [release] 提交 + git tag
  pnpm version "$VERSION" --message "[release] $VERSION"
  # 提前验证构建（prepublishOnly 会在 publish 时再跑一次，幂等）
  pnpm build
  # 推送提交与 tag
  git push --follow-tags origin master
  # 发布（触发 prepublishOnly 重新构建 dist，确保 tarball 含最新产物）
  pnpm publish
  echo "🎉 $VERSION version publish success"
fi
