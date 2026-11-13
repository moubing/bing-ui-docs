# 文档站维护与验证说明

[返回项目介绍](../README.md)

本文保留原 README 中的版本同步记录、文档导出规则和验证细节。历史验收对应各次记录的范围，当前版本与逐组件状态以[版本清单](../public/ai/manifest.json)为准。

当前目标与文档修订由 `shared/docs/migration.ts` 的 `docsVersion` 维护。全站导读的核对基线与页面验收另存于 `shared/docs/release.ts`；每次发布须按 [发布核对记录](release-validation.md) 更新，不能用组件覆盖数量代替导读或部署验收。

## 0.19.0 / r1 组件验证记录

0.19.0 / r1 时，正式依赖固定为 `@moubing/bing-ui@0.19.0`。Autocomplete 新增独立行尾按钮，普通选择与按钮操作分别触发事件；Button、Tabs 共享的点击碎屑改由浏览器原生动画推进，保留同步业务事件、减少动态效果和清理规则。相关正文、API、网页预览、独立示例与 AI 导出同步到正式版本，Autocomplete、Button、Tabs 的 `unreleased` 标记已移除。

本轮使用 npm 正式包通过文档导出检查、90 项导出测试、Nuxt/文档/测试类型检查，以及全部 40 个组件共 230 个 SFC 的严格类型检查。23 项网页与 12 项导出示例浏览器测试聚焦 Autocomplete、Button、Tabs 和版本清单，检查行尾按钮与普通选择独立、键盘与禁用态、原生碎屑反馈及明暗窄屏布局；其他组件沿用已有行为验证。具体命令与边界见下方验证说明。

## 历史验证记录

正式依赖固定为 `@moubing/bing-ui@0.13.3`，文档修订 r1。0.13.3 修复 Toast 两处异步状态问题：同一 action 的原对象与 Vue 代理按相同身份处理，更新文字保留 loading；回调内同步更换 action 或关闭后重建同 ID 提示，旧 Promise 不再改变新提示的状态。正文、API、网页预览和独立示例已同步，示例增加撤销过程中更新进度文字；正式包验证后已清除 Toast 的 `unreleased` 标记。

本轮先验证候选产物，升级后用正式 npm 包完成 Toast 网页 12 项、AI 导出示例 8 项无头检查，包含 1440/390 宽度及明暗主题；已查看窄屏暗色消息和桌面预览截图。操作按钮测试显式暂停模拟时钟，消除真实时间推进导致 loading 断言超时的问题，该网页用例连续 3 次通过。文档导出 90 项测试、Nuxt/文档/测试类型检查及全部 40 个组件共 203 个 SFC 严格类型检查通过；其他组件沿用已有行为验证。临时联调路径配置已移除，AI 导出、版本清单与读取入口同步到 0.13.3。

0.13.2 修复条目放下后不再显示时浮层飞向视口左上角：浮层保持拖动尺寸收进落点区域，DragDrop 正文与 `dropDuration` 说明已同步，减少动效改为每次松手读取。0.13.1 修复 BingDragOverlay 落位交接：浮层落到位的同一帧收起浮层内容并解除源条目占位，DragDrop 正文与 `dragging` 插槽说明已同步。0.13.0 时：新增 BingDragDrop 页，说明 BingDragDrop、BingDraggable、BingDropZone、BingDragOverlay 与 useBingDragDrop 的跨区域拖动、指针落点、触屏长按、放置规则、事件与浮层，提供基础与规则两个示例；Toast 增加「操作按钮」章节、BingToastAction API 与撤销示例；升级指南补充 0.12.5 与 0.13.0。两页已用正式包完成验证并清除未发布标记：导出测试 90 项、40 个组件共 203 个 SFC 严格类型检查、Nuxt/文档/测试类型检查，网站浏览器用例 336 项、AI 导出浏览器用例 250 项全量通过（含真实鼠标拖动、触屏长按拖动、Escape 取消、撤销失败重试与 KeepAlive 离开卸载）；已查看窄屏暗色拖动截图。

0.12.4 时正式依赖固定为 `@moubing/bing-ui@0.12.4`，文档修订 r1。Form 的 `schema` 改为最小 `BingFormSchema` 接口，继续兼容 Zod；正文、API、快速开始和升级指南说明未安装 Zod 时也可严格检查组件类型，两个 Form 示例用 `satisfies` 保留 Zod 推导类型。Tooltip 和 ConfigProvider 说明共享面板按实际触发器读取局部动效策略，动效示例增加 `never` / `always` 两个局部提示。

本轮通过正式包验证：88 项导出测试、39 个组件共 200 个 SFC 的严格类型检查、Nuxt/文档/测试类型检查、43 项相关网页用例及 23 项相关 AI 示例用例。网页覆盖 Form、FormItem、Tooltip、ConfigProvider、首页、快速开始与升级入口；AI 示例覆盖前四项。局部 Tooltip 用例在无系统 CSS 降级时比较 JS 动效，系统 `prefers-reduced-motion` 的 CSS 规则继续独立生效。已查看局部动效和窄屏暗色 Form 截图。其他组件沿用已有行为验证，并通过全量示例类型检查；AI 导出、版本清单与读取入口已同步。

0.12.2 修复 BingSplitPane 在 KeepAlive 缓存或 display:none / v-show 隐藏期间把 0 宽当作容器变窄、重新显示时侧栏先以 0 宽渲染一帧的问题；同步 SplitPane 正文、resize-cancel 说明、升级指南与 AI 导出。与 0.12.1 相比，安装包仅 SplitPane 的脚本和作用域哈希不同。在 0.12.2 上，AI 导出用例「Select 阅读应用：外部禁用关闭面板」按文件顺序稳定失败、单独运行通过，0.12.1 同样如此。原因是 Select 打开后在随后两帧内无条件把焦点设回搜索框，用例在此期间把焦点移到复选框后按 Space，按键落入搜索框。

0.12.3 在共享的搜索聚焦逻辑中修正此问题：重试前确认焦点仍在组件自身或页面主体上，Select 与 TreeSelect 同时生效；打开后聚焦搜索框、`/` 快捷键和 Escape 返回触发器的行为不变。Select 与 TreeSelect 正文的键盘说明已同步。正式依赖固定为 `@moubing/bing-ui@0.12.3`，文档修订 r1：全部 200 个示例通过正式包严格类型检查，导出测试 88 项、网站浏览器用例 324 项、AI 导出浏览器用例 245 项全量通过。

0.12.0 改为纯 ESM 多文件产物，Zod 改为可选 peer 依赖，并新增 BingConfigProvider（全局尺寸、浮层层级基准、JS 动效策略）。0.12.0 在 Node / SSR 下会因 dayjs 插件路径无法解析而导入失败，0.12.1 已修复，文档站直接接入 0.12.1。本次新增 ConfigProvider 页，并同步各组件的 size 继承链、zIndex 基准和动效策略说明、快速开始、升级指南以及 AI 导出。范围与结果见 [0.12.x 与 ConfigProvider 验证记录](config-provider-ai-export-validation.md)。

正式依赖固定为 `@moubing/bing-ui@0.12.1`，文档修订 r1，覆盖 39 个已登记组件、164 个组件独立示例与 36 个阅读应用用例。全部 200 个示例通过正式包的严格类型检查；网站 324 项、AI 导出 247 项浏览器用例全量通过。首页另有 1 个完整卡片示例，预览和复制共用同一份源文件。

0.11.2 修复 Scrollbar 在 Chromium 页面缩放后丢失鼠标滚轮惯性的问题，本次同步 Scrollbar 与此前 Cursor 性能优化的正文、API、示例和 AI 导出。范围与限制见 [滚轮缩放验证](scrollbar-zoom-validation.md)及 [Cursor 验证](cursor-performance-validation.md)。

0.11.0 已发布并精确接入：Table 增加服务端排序和独立共享列设置，Dialog 增加固定尺寸与头部区域，新增 TableColumnControls、SplitPane、Slider。五个页面已用正式 npm 包完成验证，清除未发布标记；结果见 [S1 组件文档验证记录](s1-components-validation.md)。

0.11.2 时覆盖 38 个已登记组件、161 个组件独立示例与 36 个阅读应用用例。S1 的五页在 0.11.0 完成 41 项网页和 27 项 AI 导出交互检查；其余组件沿用已有行为验证，全部 197 个示例在当时通过新包类型检查。首页另有 1 个完整卡片示例，预览和复制共用同一份源文件。

0.10.0 为 BingTextarea 增加默认开启的 `smoothCaret`，支持输入、换行、自动折行、滚动和中文组词，与 BingInput 共用光标生命周期。正文、API、网页开关、独立示例及 AI 导出同步；针对正式 npm 包完成 Input/Textarea 网页与导出示例检查，其他组件沿用既有行为验证，并通过组件库全量浏览器检查及全部示例类型检查。详细范围见 [Textarea 验证记录](textarea-ai-export-validation.md)。

0.9.4 修复 Tabs 在工具栏中比同排文字和按钮上偏 4px 的问题。外层留白改为上下各 4px，保持总占位高度和横向滚动条空间。Tabs 正文、API、网页与独立示例及 AI 导出同步更新；验证覆盖三档尺寸、明暗主题、窄屏与键盘切换。其他组件沿用已有验证，详细范围见 [Tabs 验证记录](tabs-ai-export-validation.md)。

0.9.3 完成 BingCursor 的长文档性能修复：预生成各状态规则，普通区域更新命中元素，富文本编辑区只在编辑根节点保留光标标记，避免 ProseMirror 反复重建段落。0.9.2 在发布后的真实编辑器集成检查中暴露了该兼容问题，富文本应用应使用 0.9.3。Cursor 的正文、API 说明、示例与 AI 导出同步更新，公开用法保持不变；其他组件沿用已有验证，并通过全量导出、示例类型检查及组件库浏览器测试。

0.9.1 修复 Table 关闭列拖拽时表头误显禁用光标，以及 Tooltip 短提示右侧和底部的额外留白。表格列设置示例加入局部光标，提示示例默认使用“斜体”；正文、API、示例与 AI 导出同步更新。详细验证范围见 [Table 验证记录](table-ai-export-validation.md)和 [Tooltip 验证记录](tooltip-ai-export-validation.md)。

0.9.0 增加 BingAutocomplete 的 `openOnEmpty`：默认保留空输入候选，受控示例显式关闭，演示空白、聚焦和清除时不展开面板。候选保留 stagger 动画并改善文字抖动；BingInput 聚焦时立即显示平滑光标，普通鼠标按下不再临时切回原生光标。对应正文、API、网页/独立示例与 AI 导出同步维护；本次浏览器回归聚焦 Autocomplete 和 Input，其他组件沿用已有验证并通过全量文档导出及示例类型检查。

0.8.2 统一 BingAutocomplete 与 BingSelect 的候选动效、详情跟随及跨面板停留；窄屏详情使用独立预览区域。BingInput 在中文组词时保持平滑光标，确认后再更新模型、校验和防抖通知。文档包含本地筛选、业务候选与重试示例，并分别在网页预览和独立 AI 示例应用验证；输入框额外使用 Chromium 原生组词接口验证确认、取消和英文衔接。Scrollbar 保留自 0.7.2 起固定预留轨道空间的行为说明。

0.7.0 将 Cursor 改为浏览器原生 CSS 光标，文档已移除跟随、形变和自定义插槽示例，增加外观配置与系统回退示例。Table 与 Scrollbar 减少滚动和尺寸测量的重复工作，默认平滑滚动及原有交互保留。

文档站已同步中性灰黑、炭灰暗色、细边框和轻阴影，沿用原有页面结构。使用者接入说明见网站快速开始，旧项目迁移见[版本升级指南](../content/guides/upgrade.md)；历史章节保留适用范围与后续覆盖关系，当前目标由共享版本数据派生。

`shared/docs/migration.ts` 统一记录正式基线版本，以及每个组件的 API/正文、网页预览、独立示例、AI 导出、验证五项进度。下一版 API 使用 `unreleased` 标记，即使候选源码验证通过也不宣称当前正式包支持；实际覆盖和待验证名单以生成的版本清单为准。

0.6.0 的历史八阶段范围与结论见[更新计划](bing-ui-0.6.0-update-plan.md)和[整体收尾记录](bing-ui-0.6.0-stage-8.md)。组件逐项核对与限制保留在[第二阶段](bing-ui-0.6.0-stage-2.md)、[第三阶段](bing-ui-0.6.0-stage-3.md)、[第四阶段](bing-ui-0.6.0-stage-4.md)、[第五阶段](bing-ui-0.6.0-stage-5.md)、[第六阶段](bing-ui-0.6.0-stage-6.md)及[Cursor 阶段](bing-ui-0.6.0-stage-7.md)。[升级基线](bing-ui-0.6.0-baseline.md)保留初始差异，历史验证不替代当前版本验收。

## 本地开发

项目使用 pnpm，并以仓库中的 `pnpm-lock.yaml` 为唯一锁文件。

```powershell
pnpm install
pnpm dev
```

Nuxt 默认会在 `http://localhost:3000` 启动开发服务。

## 构建

```powershell
pnpm build
pnpm generate
pnpm preview
```

- `pnpm build` 构建 Nuxt 服务端产物。
- `pnpm generate` 生成静态站点产物。
- `pnpm preview` 在本地预览生产构建。

## 主题

站点和 Bing UI 组件共用根元素上的 `data-bing-theme` 属性：

```html
<html data-bing-theme="light">
<html data-bing-theme="dark">
<html data-bing-theme="system">
```

未设置属性时使用亮色主题。Header 中的主题切换会把偏好保存到 `localStorage`，Nuxt head 内的早期脚本会在应用挂载前恢复它，避免暗色页面刷新时闪白。

应用接入主题时也应把属性设置在 `html`，这样 Teleport 到 `body` 的 Dialog、Select、Tooltip 等浮层可以继承同一套语义变量。业务品牌色请成组覆盖 `--bing-accent-rgb`、`--bing-accent`、`--bing-accent-strong-rgb`、`--bing-accent-strong` 等语义变量与 RGB channel，避免修改组件内部选择器。

## 目录

- `app/pages/docs`：快速开始、升级指南与组件文档页面。
- `content/guides`：面向组件使用者的升级说明。
- `app/components`：文档站内部组件。
- `app/assets/css/main.css`：站点壳、文档示例和主题样式。
- `app/layouts`：默认布局与文档布局。
- `docs/`：历史迁移计划与验收记录，不参与网页渲染或 AI 文档生成；当前维护规则以[项目 README](../README.md)与本说明为准。
- `tests/fixtures/ai-docs`：AI 文档示例的独立测试应用，文件用途见[测试说明](../tests/fixtures/ai-docs/README.md)。

## 组件 Markdown 与 AI 文档

40 个已登记组件页通过 Markdown 与 AI 导出共用正文、API 和完整示例。正式验证与未发布页面的范围见[AI 入口](../public/llms.txt)与[版本清单](../public/ai/manifest.json)；0.5.3 的结构迁移过程见[历史迁移记录](component-migration-progress.md)。

迁移后的页面通过 `@comark/nuxt` 渲染 Markdown，保留 URL、布局、主题、交互示例和代码展示组件。统一维护位置：

- `content/components/<组件名>.md`：正文、章节顺序和锚点。
- `shared/docs/<组件名>.ts`：API 表格数据。
- `examples/<组件名>/*.vue`：完整独立示例，网页代码区与 AI 导出共用。
- `app/components/examples/<组件名>`：文档站的交互预览和参数面板。
- `scripts/lib/doc-registry.ts`：已接入导出的组件、API 表、示例文件和导出说明登记表。
- `shared/docs/migration.ts`：目标版本与逐组件验收状态。
- `app/components/content`：Markdown 渲染和 API 表适配。

章节继续使用原有 `section` ID。渲染器关闭自动标题 ID；Markdown 中的 `article.doc-page` 保持正文结构。解析结果通过 Nuxt `useAsyncData` 复用于服务端渲染和客户端水合。

每个组件路由的 Vue 文件只负责接入 Markdown 和交互预览。历史版本快照尚未实现；最初基于 0.5.3 的 Form/FormItem 试点过程见[试点验证记录](form-comark-pilot-validation.md)。

## 文档导出

在仓库根目录运行以下命令即可，无需启动网站或运行完整构建。本次验证使用 Node.js 24.18.1，脚本通过 Node.js 内置的 TypeScript 支持运行。

```powershell
pnpm docs:export form
pnpm docs:check form
pnpm docs:export form-item
pnpm docs:check form-item
pnpm docs:export tabs
pnpm docs:check tabs
pnpm docs:export tree-select
pnpm docs:export
pnpm docs:check
```

`docs:export` 生成或更新文档，`docs:check` 只检查生成结果是否与来源一致。省略组件名时处理所有已登记组件；单组件命令只更新目标文档及共享入口、清单，并要求其他组件的产物未过期，避免清单中的 SHA 与实际文件不符。首次生成或同时修改多个组件时运行不带组件名的命令。未知组件、重复参数、同时传入多个组件名均会报错。请将生成文件随源码一并纳入 Git，读取者 clone 后即可查看。

生成文件通过 `.gitattributes` 固定为 LF，保证 Windows checkout 后的内容检查和 SHA-256 一致。

- [生成的 Form 文档](../public/ai/components/form.md)：完整说明、2 个可独立使用的 Vue 示例、13 项属性、2 个事件和 5 个公开方法。
- [生成的 FormItem 文档](../public/ai/components/form-item.md)：完整说明、3 个可独立使用的 Vue 示例、7 项属性和 6 项插槽参数。
- [生成的 Tabs 文档](../public/ai/components/tabs.md)：4 个独立示例、键盘激活、插槽、事件和完整 API。
- [读取入口](../public/llms.txt)：定位所有已迁移组件，并说明适用版本与覆盖范围。
- [当前版本清单](../public/ai/manifest.json)：目标包版本、逐组件验证状态、文档修订和生成文档的 SHA-256，没有历史快照。

维护来源如下：

| 修改内容 | 编辑位置 |
| --- | --- |
| 正文、规则与章节 | `content/components/<组件名>.md` |
| API 表格数据 | `shared/docs/<组件名>.ts` |
| 完整示例、默认演示参数 | `examples/<组件名>/*.vue` |
| 网页预览和参数控制 | `app/components/examples/<组件名>/*.vue` 与 `state.ts` |
| 参数变化后的代码生成 | `shared/docs/example-code.ts`（共用替换规则及 Form 参数类型） |
| 组件和示例登记 | `scripts/lib/doc-registry.ts` |
| 展开规则 | `scripts/lib/ai-docs.ts` |
| 版本与验收状态 | `shared/docs/migration.ts` |

网页代码区和 AI 导出使用同一份完整示例。有参数面板的代码区根据当前参数生成，AI 文档使用默认演示参数。交互预览继续保留原 playground 逻辑，用浏览器回归核对行为。导出文件不应手工维护。

导出会去掉网页容器，展开示例/API 引用，并保留示例插槽里的说明。遇到不支持的节点、缺失的引用、遗漏的 API/示例或组件版本不匹配时，会报错而不是静默忽略。安装版本必须匹配目标版本；生成成功只表示来源一致，逐组件的五项验收状态需要实际验证后更新。

```powershell
pnpm test:docs-export
pnpm typecheck:docs
pnpm typecheck:ai-examples
pnpm typecheck:ai-examples button
$env:DOCS_BROWSER_CHANNEL = 'chrome'
pnpm test:ai-examples
Remove-Item Env:DOCS_BROWSER_CHANNEL
```

`test:docs-export` 检查确定性、表格完整性、引用、版本及迁移状态错误等；`typecheck:ai-examples` 直接提取生成文档中的代码做严格检查，支持可选组件名，错误会映射回独立示例或阅读应用文件；`test:ai-examples` 在独立 Vue/Vite 页面运行这些代码及理解迁移用例，自行启动并关闭 3108 端口服务，端口可通过 `AI_DOCS_TEST_PORT` 调整。

“AI 是否理解”的历史核对问题、实际测试和限制见[各组件验证记录](component-migration-progress.md)。这是同一助手的阅读与应用检查，尚未进行独立模型盲测。当前版本继续核对类型、ID、焦点及交互边界；FilePreview 跨分支滚动锁、转场离屏焦点及 Carousel 禁用项滚轮等剩余边界已在对应文档和升级指南中说明。

## 验证

```powershell
pnpm typecheck
pnpm typecheck:tests
pnpm exec playwright install chromium
pnpm test:docs
```

浏览器测试始终使用无头模式，默认自行在 `127.0.0.1:3107` 启动临时开发服务，结束后由 Playwright 关闭。端口已被占用时设置 `DOCS_TEST_PORT`，不会复用或停止已有服务。也可显式设置 `DOCS_BASE_URL`，测试只连接该地址，由启动者管理服务生命周期。

内置 Chromium 不可用时，可以临时使用系统 Chrome 或 Edge 的无头模式：

```powershell
$env:DOCS_BROWSER_CHANNEL = 'chrome' # Edge 使用 msedge
pnpm test:docs
Remove-Item Env:DOCS_BROWSER_CHANNEL
```

所有组件统一使用交互和结构断言：检查明暗主题、宽窄视口、原有章节与 API 表、页面溢出、实际复制代码及对应交互；导出示例在独立 Vue/Vite 环境运行。Form/FormItem 的校验、目录、system 主题与页面往返检查继续保留。

截图统一作为临时检查材料，输出到 `test-results/site`，不保存或更新 `*-snapshots` 基线，不进行像素比较。测试通过表示自动断言通过，不代表外观完全一致；涉及样式和布局改动时仍需查看相关截图。截图仅隐藏开发工具浮标。多个涉及系统剪贴板的测试套件应顺序运行，避免互相覆盖复制结果。

测试失败时可检查 `test-results/site` 或 `test-results/ai-docs` 中的截图、错误上下文和 trace。这些是临时输出，处理完后清理。最初试点的像素对比过程保留在验证文档与 Git 历史中。
