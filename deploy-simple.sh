#!/bin/bash
# 一键推送到 GitHub — 复制粘贴即可
TOKEN="$1"
if [ -z "$TOKEN" ]; then
  echo "请输入你的 GitHub Token"
  exit 1
fi

cd "$(dirname "$0")"

# 获取 GitHub 用户名
USERNAME=$(curl -s -H "Authorization: Bearer $TOKEN" https://api.github.com/user | python3 -c "import sys,json; print(json.load(sys.stdin)['login'])")

# 创建仓库
echo "📦 Creating repo..."
curl -s -H "Authorization: Bearer $TOKEN" \
  -d "{\"name\":\"yoozor-website\",\"private\":false}" \
  https://api.github.com/user/repos > /dev/null

# 推代码
echo "🚀 Pushing..."
git remote remove origin 2>/dev/null
git remote add origin https://$TOKEN@github.com/$USERNAME/yoozor-website.git
git push -u origin main --force

# 启用 Pages
echo "🌐 Enabling GitHub Pages..."
curl -s -X POST -H "Authorization: Bearer $TOKEN" \
  -d '{"source":{"branch":"main","path":"/"}}' \
  https://api.github.com/repos/$USERNAME/yoozor-website/pages > /dev/null

# 获取 Pages URL
PAGES_URL=$(curl -s -H "Authorization: Bearer $TOKEN" \
  https://api.github.com/repos/$USERNAME/yoozor-website/pages | \
  python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('html_url',''))")

echo ""
echo "🎉 部署成功！"
echo "   仓库: https://github.com/$USERNAME/yoozor-website"
echo "   网站: $PAGES_URL"
echo ""
echo "📌 下一步：去阿里云配置 DNS"
echo "   登录 aliyun.com → 域名控制台 → yoozor.com → DNS 管理"
echo "   添加 CNAME 记录: @ -> $(echo $PAGES_URL | sed 's|https://||' | sed 's|/$||')"
