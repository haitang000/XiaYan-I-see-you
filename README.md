![intro](/static/README_RESOURCE/intro.png)

# 💡 功能介绍

![intro2](static/README_RESOURCE/intro2.png)

这是一款简洁优雅、支持高度自定义且开箱即用的照片墙模板，支持：

- ✨ 瀑布流布局
- 🌙 明暗模式自动切换
- 📱 移动端基础适配
- ✅ 自适应布局
- 🐀 自定义鼠标
- 🎂 角色生日祝福

**etc.**

# 📕 使用教程

## 通过 Docker 部署

如果想要通过 Docker 部署, 您需要将本项目下载下来, 之后在项目目录下运行`docker-compose up -d --build`即可

## 通过 Vercel 部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/haitang000/XiaYan-I-see-you)

您也可以手动部署：

1. 将本项目 Fork 到自己的 GitHub 账号
2. 登录 [Vercel](https://vercel.com)，点击 **Add New Project**，导入您 Fork 的仓库
3. Vercel 会自动识别以下配置（来自 `vercel.json` 和 `package.json`）：
   - **Build Command**：`npm run build`
   - **Output Directory**：`static`
4. 点击 **Deploy** 即可，每次推送代码后 Vercel 会自动重新部署

> **注意**：Vercel 部署时，`npm run build` 会自动扫描 `static/image/` 目录并生成 `photos.json`，无需手动操作。

## 图片防盗链

本站对 `/image/` 路径下的图片和图标启用了基于 `Referer` 的防盗链：

- 拦截无 `Referer` 的请求，因此直接打开图片 URL 会返回 `403 Forbidden`。
- 允许同域请求，以及 `xiayan.icu`、`*.xiayan.icu`、`xiayan.haitang000.top`、`*.xiayan.haitang000.top`、`localhost`、`127.0.0.1`。
- 其他外站页面直接引用图片时会返回 `403 Forbidden`。
- Docker/Nginx 部署使用 Nginx 原生规则；Vercel 部署使用 Routing Middleware，因此会产生少量边缘中间件调用。
- 如果浏览器或代理隐藏 `Referer`，图片可能无法加载；这是严格防盗链策略的预期取舍。

## 将图片修改为自己喜欢的角色

如果想要将图片修改为自己喜欢的角色，可以在`/static`目录中将图片替换，无需重命名, 正常运行命令后会自动排列照片。如果想要修改网站 Icon，可以在`/static`目录中将`logo.jpg`更换为自己喜欢的图片

# 📜 开源许可

- 本项目基于 [GNU General Public License 3.0](https://www.gnu.org/licenses/gpl-3.0.en.html) 许可进行开源，在使用本项目期间，您需要做到以下几点：

  - 分发软件时，必须提供源代码或提供获取源代码的方法。
  - 禁止使用专利来限制软件的自由使用。
  - 确保软件的用户能够自由地修改和重新分发软件，包括在私有网络或通过数字传输。
  - 软件的分发者不能因为技术措施而限制或禁止任何用户的使用。
  - 如果将GPL 3.0下的软件与其他非GPL软件合并，合并后的作品整体需要遵守GPL 3.0。
  - 如果用户违反了GPL 3.0的条款，许可自动终止，但可以通过遵守GPL来恢复。
