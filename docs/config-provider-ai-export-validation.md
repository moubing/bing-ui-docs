# 0.12.x 与 ConfigProvider 文档验证记录

本次同步 `@moubing/bing-ui` 0.12.0 的全部公开变更，正式依赖精确固定为 **0.12.1**，文档修订 r1。新增 BingConfigProvider 页面，状态为 `verified`。

## 0.12.0 的 SSR 问题与 0.12.1

同步时发现 0.12.0 无法在 Node / SSR 环境加载：外置后的 `dayjs/plugin/customParseFormat` 缺少 `.js` 扩展名，dayjs 又没有 exports 映射，Node 严格 ESM 解析失败，Nuxt 开发服务导入组件库即报 `ERR_MODULE_NOT_FOUND`。只在浏览器中打包的项目不受影响，所以组件库自身测试未发现。

- 组件库提交 `b1588ff` 修复了导入路径，并在 `src/build-config.test.ts` 新增检查：源码里所有外置依赖的导入路径都必须被 Node 严格 ESM 解析到真实文件。修复前该检查能精确报出这一处，其余 dnd-kit、gsap、shiki 子路径都能解析。
- 0.12.1（发布提交 `92e44e3`）通过 547 项单元测试、251 项浏览器测试和构建。产物在纯 Node 中可加载，SSR 渲染 Provider + DatePicker 的输出正确。
- registry 确认 0.12.1 为 latest；在全新目录从官方 registry 安装后，Node 可直接导入。
- 升级指南提示跳过 0.12.0，直接使用 0.12.1。

## 文档范围

- 新增 ConfigProvider 页：全局尺寸、浮层层级、动效策略三个示例，以及属性、插槽、尺寸解析顺序、浮层层级表、组合式函数和公开类型六张表。
- 19 个组件 API 的 `size` 默认值写明继承链：FormItem → Form → ConfigProvider → md。Form、Tag、Tabs、Table、DropDown 在 0.12.0 起不再预填 md。
- Dialog、Toast、FilePreview、ImagePreview、Tooltip 的 `zIndex`，以及 ColorPicker 正文，改为“基准 + 偏移”的写法，默认值不变。
- 转场、Tabs、Scrollbar 的 `respectReducedMotion` 和 AnimatedText 正文补充了 Provider 策略。Input / Textarea 的平滑光标由 CSS 媒体查询决定，写明不受 Provider 影响。
- 快速开始新增“全局配置”一节，说明 Zod 是可选 peer 依赖、组件库只提供 ESM。升级指南改为 0.12.0 版，原有的 0.7.0 / 0.6.0 内容保留为迁移补充。CodeBlock 写明 Shiki 按需加载，Icon 删除“与组件包一致”的说法。
- AI 导出导语：运行环境改为 Vue 3.5 与 GSAP 3.15，导入 zod 的示例另需 Zod 4。

## 验证结果（2026-10-27）

- 导出一致性检查、88 项导出测试，以及 Nuxt、文档数据、测试代码三项类型检查通过。
- 39 个组件的全部 200 个 SFC 严格类型检查通过：164 个独立示例，36 个阅读应用。
- 网站浏览器测试全量 324 项通过，其中 ConfigProvider 8 项：
  - 明暗主题 × 1440 / 390 两种宽度。
  - 复制内容与 AI 示例一致。
  - 尺寸继承、显式优先、嵌套覆盖。
  - 层级基准切换。
  - always / user / never 对系统偏好的覆盖，以及动画即时重建。
- 全量运行中，`docs-performance` 里 Table 代码块数量的断言仍是 6。0.11.2 新增 remote 示例后数量变为 7，当时漏改，本次已更正。
- AI 导出运行用例全量 247 项通过，其中 ConfigProvider 3 项。实测 Dialog 在基准 3000 时为 3000、Tooltip 为 4200，与层级表一致。
- 已查看 1440 浅色、390 深色和 320 浅色截图。修正了尺寸示例在窄屏下的横向溢出（grid 子项缺少 `min-width: 0`），并缩短了动效示例的单选说明。没有更新像素快照基线。

验证使用正式 npm 包，不依赖源码路径别名。浏览器测试为无头模式。本机缺少 Playwright 自带的 Chromium，因此使用系统 Chrome（`DOCS_BROWSER_CHANNEL=chrome`），并由外部启动的开发服务（`DOCS_BASE_URL`）承载网站测试。
