# Yoozor 独立站 — 部署指南

## 网站文件位置

所有网站文件位于 `website/` 目录：

```
website/
├── index.html        # 首页（Hero、产品、认证、Why Us、联系）
├── products.html     # 产品详情页
├── css/style.css     # 全局样式 (2026 现代设计)
└── js/main.js        # 交互脚本（滚动动画、计数器、移动菜单）
```

## 部署方式（任选一种）

### 方式一：Vercel（推荐，免费）

1. 去 [vercel.com](https://vercel.com) 注册账号（用 GitHub 登录）
2. 点击 **Add New → Project**
3. 导入这个项目文件夹
4. Framework Preset 选 **Other**
5. Root Directory 填 `website`
6. 点击 **Deploy**
7. 部署后在 Vercel 设置里绑定你的域名

### 方式二：Cloudflare Pages（推荐，免费）

1. 去 [pages.cloudflare.com](https://pages.cloudflare.com)
2. 点击 **Create a Project**
3. 连接你的 Git 仓库，或直接上传 `website/` 文件夹
4. Build settings 都不用填，直接部署
5. 在 Cloudflare 控制台绑定你的域名

### 方式三：传统服务器（Nginx/Apache）

将 `website/` 目录下所有文件上传到服务器，配置 Web 服务器指向该目录即可。

### 方式四：GitHub Pages

1. 创建 GitHub 仓库
2. 把 `website/` 内容推送到仓库
3. 在 Settings → Pages 中选择部署来源

## 域名绑定

你的域名：**yoozor.com**

在域名注册商（GoDaddy、阿里云、Namecheap 等）的管理后台：

- **指向 Vercel**: 添加 CNAME 记录 → `cname.vercel-dns.com`
- **指向 Cloudflare**: 将 Nameserver 改为 Cloudflare 的
- **指向服务器**: 添加 A 记录指向服务器 IP

## 自定义（需要修改的地方）

- **Logo**: `index.html` 中的 `.nav-logo .mark` 可以换成你的 Logo 图片
- **产品图片**: `product-card-image` 区域的 emoji 可替换为实际产品照片
- **联系方式**: 确认邮箱、电话、地址信息准确
- **社交媒体**: 在 footer 中添加 LinkedIn、Facebook 等链接
- **Google Analytics**: 可在 `<head>` 中添加 GA 跟踪代码

## 本地预览

```bash
cd website
# 如果有 Python:
python3 -m http.server 8080
# 或使用 Node:
npx serve .
```

然后浏览器打开 `http://localhost:8080`
