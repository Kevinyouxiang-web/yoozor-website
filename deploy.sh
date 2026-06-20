#!/bin/bash
# =============================================
# Yoozor.com 一键部署脚本
# 用法: bash deploy.sh <你的GitHub Token>
# =============================================

set -e

TOKEN="$1"
REPO_NAME="yoozor-website"
EMAIL="evin.ho@yoozor.com"
NAME="Evin Ho"

if [ -z "$TOKEN" ]; then
  echo "❌ 请提供 GitHub Token"
  echo "用法: bash deploy.sh <token>"
  exit 1
fi

DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

echo "📦 创建 GitHub 仓库..."
curl -s -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  -d "{\"name\":\"$REPO_NAME\",\"description\":\"Yoozor Trading — Portable AC & Dehumidifier Manufacturer\",\"private\":false}" \
  https://api.github.com/user/repos > /dev/null

echo "📁 初始化 Git..."
if [ ! -d ".git" ]; then
  git init
  git branch -M main
fi

git config user.email "$EMAIL"
git config user.name "$NAME"

# 设置远程仓库
REPO_URL="https://$TOKEN@github.com/$(curl -s -H \"Authorization: Bearer $TOKEN\" https://api.github.com/user | python3 -c \"import sys,json; print(json.load(sys.stdin)['login'])\")/$REPO_NAME.git"

git remote remove origin 2>/dev/null || true
git remote add origin "$REPO_URL"

echo "🚀 推送到 GitHub..."
git add -A
git commit --allow-empty -m "Initial commit: Yoozor Trading Company Website"
git push -u origin main --force

echo "🌐 启用 GitHub Pages..."
FULL_NAME=$(curl -s -H "Authorization: Bearer $TOKEN" https://api.github.com/repos/$(curl -s -H "Authorization: Bearer $TOKEN" https://api.github.com/user | python3 -c "import sys,json; print(json.load(sys.stdin)['login'])" )/$REPO_NAME | python3 -c "import sys,json; print(json.load(sys.stdin)['full_name'])")

curl -s -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  -d '{"source":{"branch":"main","path":"/"}}' \
  "https://api.github.com/repos/$FULL_NAME/pages" > /dev/null

echo ""
echo "🎉 ========== 部署完成！=========="
echo "   仓库: https://github.com/$FULL_NAME"
echo "   网站在几分钟后可通过以下地址访问:"
echo "   https://$(curl -s -H \"Authorization: Bearer $TOKEN\" https://api.github.com/repos/$FULL_NAME/pages | python3 -c \"import sys,json; print(json.load(sys.stdin).get('html_url','...'))\" 2>/dev/null || echo \"(等待 Pages 部署)\")"
echo ""
echo "📌 接下来去阿里云配置域名:"
echo "   1. 登录 aliyun.com → 域名控制台"
echo "   2. 找到 yoozor.com → DNS 管理"
echo "   3. 添加以下记录:"
echo "      记录类型: CNAME"
echo "      主机记录: @"
echo "      记录值: $(curl -s -H \"Authorization: Bearer $TOKEN\" https://api.github.com/repos/$FULL_NAME/pages 2>/dev/null | python3 -c \"import sys,json; d=json.load(sys.stdin); print(d.get('cname','<pages域名>'))\" 2>/dev/null || echo '<GitHub Pages 域名>')"
echo "   4. 再添加一条 www 的 CNAME 记录指向 yoozor.com"
