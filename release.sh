#!/usr/bin/env bash
###
 # @Author: Wanko
 # @Description: 发布 caring-route 到 npm。单版本源：只维护 packages/caring-route 的版本号。
###
set -e

cd "$(dirname "$0")"   # 回到仓库根，便于统一执行 git 操作
LIB_DIR="packages/caring-route"

# 前置检查：工作区必须干净
# pnpm publish 默认开启 git 检查；工作区脏会直接拒绝发布。
# 此前就是因为 pnpm version 未生成 commit 导致 package.json 处于 modified，publish 被拦截。
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "❌ 工作区不干净，请先提交或暂存所有改动后再发布："
  git status --short
  exit 1
fi

CURRENT=$(node -p "require('./$LIB_DIR/package.json').version")
echo "Current version is $CURRENT"
read -p "Enter release version: " VERSION
read -p "Releasing $VERSION - are you sure? (y/n) " -n 1 -r
echo  # move to a new line

[[ $REPLY =~ ^[Yy]$ ]] || exit 0

echo "🕙 Releasing $VERSION ..."

# 1. bump 版本号：只改 package.json，不自动 commit/tag（显式控制更可靠）
( cd "$LIB_DIR" && pnpm version "$VERSION" --no-git-tag-version )

# 2. 提前验证构建（prepublishOnly 会在 publish 时再跑一次，幂等）
( cd "$LIB_DIR" && pnpm build )

# 3. 提交版本变更并打 annotated tag（--follow-tags 只推送 annotated tag）
git add "$LIB_DIR/package.json"
git commit -m "[release] $VERSION"
git tag -a "v$VERSION" -m "[release] $VERSION"

# 4. 推送分支与 tag
git push --follow-tags origin master

# 5. 发布（此时工作区干净，可通过 git 检查；prepublishOnly 重新构建 dist）
( cd "$LIB_DIR" && pnpm publish )

echo "🎉 $VERSION version publish success"
