# Form / FormItem 的 Comark 试点验证

后续维护调整：现在所有组件统一采用交互/结构断言与临时截图检查，已移除固定截图基线及像素比较。下文保留当时试点的验证事实，历史截图可从 Git 查看，当前规则见 [README](../README.md#验证)。

日期：2026-09-05。

本文记录最初的渲染迁移对照。后续同日实施了 Form AI 导出实验，补充 Form 正文、API 释义和完整代码，并更新 Form 的截图基线；FormItem 基线保留。当前进展见 [Form 导出验证](./form-ai-export-validation.md)，下文的原版截图对照结果指最初试点完成时的状态。

之后又实施了 [FormItem 导出实验](./form-item-ai-export-validation.md)，补齐其三个完整示例、正文说明和 API 释义，并更新对应截图基线。本页继续保留最初迁移时的对照结果。

本次完成用户指定的 Form/FormItem 视觉与交互试点。两页已由 Comark 渲染正文与 API 表，交互示例仍运行 Vue 逻辑。当前验证支持继续采用 Comark；AI 导出与版本入口仍需后续实施。

## 实现范围

- `@comark/nuxt` 固定为 `0.6.2`；实际使用的 `@moubing/bing-ui` 为 `0.5.3`，Nuxt 为 `4.4.8`。
- 两个路由页面保留原 URL 和 `docs` 布局，正文移至 `content/components`，API 表数据移至 `shared/docs`。
- 五个 Vue 示例保留原有预览、参数、动态展示代码和验证反馈。Form 的两个示例、FormItem 的两个交互示例分别持有独立状态，页面往返继续由既有 KeepAlive 保留。
- 原有 `app/layouts/docs.vue`、`app/router.options.ts`、`app/assets/css/main.css` 无需修改。

## 渲染适配

试点发现 Comark 默认会生成标题 ID，导致现有目录同时收录章节和章节内的标题。采用其原生选项 `headingIds: false`，只保留文档显式声明的 ID，修复了目录重复。

Comark 的外层容器放在 `article.doc-page` 之外；文章、章节、代码块和 API 表保留原有 DOM 关系，原来的直接子元素 CSS 选择器继续生效。设置 `autoUnwrap: false` 保留示例说明段落，继续复用 `BingCodeBlock` 的高亮、复制与样式。

正文通过 `useAsyncData` 解析，服务端输出和客户端水合复用同一份解析结果。

## 浏览器对照

使用 Playwright 1.60.0 与系统 Chrome 的无头模式。环境未安装 Playwright 自带 Chromium，本次按项目约定使用系统浏览器；配置中没有写入机器专属浏览器路径。

先在原 Vue 页面上验证交互并保存截图，再对迁移页面运行同一组检查。原页面截图覆盖正文、第二个示例与 API 区，包含 1440×1000 和 390×1000 两种视口及 light/dark 两种主题，共 24 张。手机正文截图通过既有 `#overview` 锚点定位，避免只截到侧栏。

截图仅通过测试样式隐藏 Nuxt 开发工具计时浮标，不隐藏正文、代码块或组件。像素比较设置 `maxDiffPixels: 0`，颜色和抗锯齿差异采用 Playwright 默认判定。原页面基线位于 `tests/browser/form-docs.spec.ts-snapshots`，迁移后的对照通过，未以迁移后的页面覆盖原基线。

14 项浏览器检查通过：

| 范围 | 验证内容 |
| --- | --- |
| 8 项视觉检查 | 两页 × 明暗主题 × 桌面/手机；每项对照正文、第二个示例和 API 区三张截图，检查横向溢出及既有目录 ID |
| Form 参数 | 布局、标签位置、尺寸、列数、间距、禁用状态与动态代码联动；关闭全部校验触发器后的手动模式提交行为 |
| Form 提交 | 空值、错误值、合法值与数组至少一项校验；失败反馈和成功反馈 |
| Form 方法 | 异步邮箱校验、单字段校验保留其他错误、读取错误、清空错误和重置初始值 |
| FormItem | 必填星号仅控制显示、帮助/错误切换、消息区域开关、禁用、标签位置及字段跨度示例 |
| 页面往返 | 表单值与布局参数保留、目录锚点可见、滚动位置恢复 |
| 主题与兼容页 | system 随系统外观变化、代码复制，以及未迁移 Tabs/Table 的加载和溢出检查 |

检查过程中未观察到页面异常或水合警告。两个试点页面的直接 HTTP 请求均返回 200，服务端 HTML 中包含文章标题和 API 表，未额外生成 h2 ID。

## 类型检查与限制

`pnpm typecheck:tests` 通过，覆盖 Playwright 配置和测试源码。

`pnpm typecheck` 全站检查未通过，共发现 15 处错误，均位于本次未修改的文件；新增渲染组件、示例组件、API 数据及两页路由没有类型诊断。未扩大本次试点去修复其他页面：

- `app/layouts/docs.vue`：2 处可能为 undefined 的索引访问。
- `app/pages/docs/components/image-preview.vue`：2 处可能为 undefined 的索引访问。
- Card、Resizable、Select、TreeSelect 页面：共 6 处引用的类型未从当前组件包导出。
- DropDown、FilePreview、Icon、Input、Tooltip 页面：共 5 处 `lucide-vue-next` 模块或类型无法解析。

本次未运行完整构建或静态生成，验证结果针对开发服务的 SSR、水合与浏览器交互，不等同于生产构建或部署验收。

## 复现命令

```powershell
pnpm typecheck:tests
$env:DOCS_BROWSER_CHANNEL = 'chrome'
pnpm test:docs
Remove-Item Env:DOCS_BROWSER_CHANNEL
```

`pnpm test:docs` 默认自行启动并关闭 3107 端口的临时服务。端口冲突时设置 `DOCS_TEST_PORT`；显式指定 `DOCS_BASE_URL` 时，由启动者管理该服务。基线目前来自 Windows，跨操作系统或浏览器版本的像素差异需人工检查。

## 后续范围

后续需要补齐可直接使用的完整代码示例，并实现 AI Markdown 导出、`llms.txt`、版本清单和历史快照。现有展示代码的省略仍保留，不能直接把带有示例/API 占位引用的 Markdown 当作最终 AI 文档。

当前仅迁移 2 个组件页面，其余 31 个页面保持原状。本次没有提交、推送或部署。
