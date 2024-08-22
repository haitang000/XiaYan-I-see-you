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

## 修改图片名称格式/图片文件拓展名

![tutorial1](static/README_RESOURCE/Tutorial1.png)

如果想要修改图片名称格式/图片文件拓展名，请在`index.js`中按照上方图片中标出的部分进行修改，接着导入图片并将其名称改为设置的格式

> 若您的图片数量未能达到`index.js`中设置的最大值，网站将会预留空位，直至图片数量达到最大值，达到最大值后请返回至`index.js`增加最大值以显示图片名称内数字大于最大值的图片

## 将图片修改为自己喜欢的角色

如果想要将图片修改为自己喜欢的角色，可以在`/static`目录中将图片替换，并命名为`<设置的范围>.<设置的文件拓展名>`，如果想要修改网站 Icon，可以在`/static`目录中将`logo.jpg`更换为自己喜欢的图片

> 瀑布流内图片命名规则可以在`index.js`中随时修改，网站 Icon 名称可以在`index.html`中进行修改

# 📜 开源许可

- 本项目基于 [GNU General Public License 3.0](https://www.gnu.org/licenses/gpl-3.0.en.html) 许可进行开源，在使用本项目期间，您需要做到以下几点：

  - 分发软件时，必须提供源代码或提供获取源代码的方法。
  - 禁止使用专利来限制软件的自由使用。
  - 确保软件的用户能够自由地修改和重新分发软件，包括在私有网络或通过数字传输。
  - 软件的分发者不能因为技术措施而限制或禁止任何用户的使用。
  - 如果将GPL 3.0下的软件与其他非GPL软件合并，合并后的作品整体需要遵守GPL 3.0。
  - 如果用户违反了GPL 3.0的条款，许可自动终止，但可以通过遵守GPL来恢复。

# 🥳 特别鸣谢

- [艾恩小灰灰](https://space.bilibili.com/13604667) 提供瀑布流布局思路

  - [瀑布流教学视频](https://www.bilibili.com/video/BV1sK411R7bD/)
  - [瀑布流源代码](https://gitee.com/wyanhui02/html_css_demo/tree/master/code/194)