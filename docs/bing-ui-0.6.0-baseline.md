# Bing UI 0.6.0 升级基线

日期：2026-09-12。对应[更新计划](bing-ui-0.6.0-update-plan.md)第一阶段。本文记录升级时的证据和待办，组件后续验收状态以 `shared/docs/migration.ts` 及生成的 `public/ai/manifest.json` 为准。

## 版本及范围

- 迁移分支：`codex/docs-0.6.0-update`，起点 `b6d6492`。
- 原文档安装包：`@moubing/bing-ui 0.5.3`；升级后实际安装发布包：`0.6.0`。
- `package.json` 精确声明 `0.6.0`，锁文件由 pnpm 更新，仅替换 Bing UI 的包版本及完整性记录。
- 比较了旧包 33 份、新包 34 份 `*.types.d.ts` 的接口成员和类型别名。差异集中在 Form、Input、Scrollbar、SortableList、Textarea 以及新增 Cursor。这不是对全部运行时行为的无差异结论；默认值、生成的 Vue 插槽类型和样式另行核对。
- 目标为 34 个组件。当前保留原有 33 页与 141 个独立示例，Cursor 尚未接入。第一阶段不会把任何组件标记为完成新版验收。

## 已确认的公开类型差异

| 组件 | 0.5.3 → 0.6.0 |
| --- | --- |
| Input | `type` 新增 `number`；`modelValue` 从 `string` 扩展为 `string \| number \| null`；`update:modelValue` 从字符串扩展为 `string \| number`；新增 `min`、`max`、`step`、`readonly`、`smoothCaret` |
| Form | `BingFormValidateTrigger` 新增 `auto`；Props 新增 `focusOnError`、`nextStepHint` |
| Textarea | Props 新增 `readonly` |
| Scrollbar | 新增 `BingScrollbarViewportSlotProps`、`BingScrollbarSlots`；`viewport` 插槽提供 `viewportRef` 和 `viewportAttrs`，用于接入真实滚动元素 |
| SortableList | Props 新增 `dragOverlay?: boolean`，源码默认 `false` |
| Cursor | 新增组件、16 种光标类型、`replace/follow` 模式、作用域与外观属性、`cursor` 插槽及 `change/visibility-change` 事件 |

已对照当前实现确认的默认值变化包括：Button `throttle=false`；Input `clearable` 按搜索类型决定、`smoothCaret=true`、`autocomplete='off'`；Form `validateTrigger='auto'`、`focusOnError=true`、`nextStepHint=false`；Icon `strokeWidth=1.75`。实际呈现还受到 Form 继承、主题变量与示例显式参数影响，需在组件阶段检查。

**仍需保留的兼容说明：** 0.6.0 发布包的 `BingFormItem.vue.d.ts` 仍把默认插槽的描述字段声明为 `aria-describedby`，当前源码实际传入 `ariaDescribedby`。因此现有 `descriptionId` 的兼容读取不能因为升级就删除。此项与已修复的多实例 ID 问题分别验证。

## 逐组件核对清单

下表是待核对内容，不代表每一项旧版限制已在新版修复。

| 阶段 | 组件 | 核对重点 |
| --- | --- | --- |
| 2 | Button | 新尺寸、节流默认关闭、点击/悬停反馈、loading 文字、表单禁用与尺寸继承 |
| 2 | Input | 数值模型与步进、文本模型类型处理、清除默认值、只读、smoothCaret、原生属性 |
| 2 | Select | 新行高与虚拟列表、主题磨砂、多实例 ID、选项与侧栏动画、弹层组合 |
| 2 | Card | 单层磨砂、默认透明度、变体、翻面/事件、反面可访问性限制 |
| 3 | Icon | 1.75 默认线宽、显式描边示例、语义标签与装饰性 |
| 3 | Textarea | readonly、计数底栏、自动高度切换、清除、原生属性 |
| 3 | Checkbox | 三档尺寸、状态、标签关联、表单禁用继承、Dialog 内聚焦 |
| 3 | CheckboxGroup | 布局与说明对齐、ID/name、分组隔离、状态继承 |
| 3 | Radio | 尺寸、唯一 ID、原生单选分组、方向键与焦点 |
| 3 | RadioGroup | 多组独立性、默认 ID/name、说明对齐、键盘跳过禁用 |
| 3 | Tag | 20/24/28px 尺寸、颜色、长标签、关闭按钮及反馈 |
| 3 | Form | auto 校验、错误修正、focusOnError、nextStepHint、异步/重置竞争、布局 |
| 3 | FormItem | 唯一 ID、标签/消息关联、stack 跨列、错误动效、插槽类型差异 |
| 4 | TreeSelect | 树节点行高、虚拟化、级联边界、ID、浮层及窄屏侧栏 |
| 4 | DatePicker | 紧凑日历、中文默认文案、草稿/外部模型、动态配置、禁用及嵌套 |
| 4 | ColorPicker | 编辑区、透明度事件、复制中文文案、磨砂及面板收放 |
| 4 | DropDown | 主/子菜单、上下文、键盘边界、Escape、内置文案及层级 |
| 4 | Tooltip | 共享面板、主题磨砂、长文本边界、键盘与可访问关联 |
| 4 | Dialog | 焦点、Escape、多层滚动锁、标题关联、旧全局样式补丁、内容留白 |
| 4 | Toast | 单视口行为、消息替换、紧凑样式、关闭后滚动范围及补位 |
| 5 | Scrollbar | viewport 插槽、滚轮识别、键盘、横向行为与实例方法 |
| 5 | Tabs | 32/36/40px、三种样式、键盘激活、指示块与横向滚动 |
| 5 | Resizable | 实色面板、手柄、父容器约束、比例与窄屏布局 |
| 5 | SortableList | dragOverlay、手柄、指针/键盘排序、受控顺序与取消 |
| 5 | Table | 行高/虚拟化、底部列设置、加载遮罩、自动全文提示、列拖拽与表单控件 |
| 6 | Image | 加载/错误占位、图片预览启停、事件与切换图片边界 |
| 6 | ImagePreview | 工具栏、索引模型、焦点/滚动锁、窄屏操作与下载 |
| 6 | FilePreview | 中文状态及工具栏、文本/表格限制、类型识别与 Office 边界 |
| 6 | CodeBlock | 中文复制文案、主题、紧凑排版、滚动/缩放及复制失败处理 |
| 6 | AnimatedText | 继承排版、中文换行、动态配置重建、disabled 与减少动态效果 |
| 6 | AppSwitcherTransition | 实色卡片、插槽、滚轮边界、动态列表及缓存清理 |
| 6 | CarouselTransition | 长标签滚动、轨道与模型、禁用项边界、插槽可访问性 |
| 6 | DeckTransition | 磨砂、自适应堆叠、下一张控制、滚轮、非循环边界 |
| 7 | Cursor | 新增完整链路；局部/全局、状态、轮廓过渡、插槽、跟随、禁用与清理 |

## 第一阶段的迁移机制

`shared/docs/migration.ts` 是网页与 AI 的共同状态来源。每个组件分别记录 `content`、`preview`、`examples`、`ai`、`validation`，缺少任何一项都不能标为 `verified`。目标版本匹配检查继续保留，组件是否验证不再由全局版本号推断。

清单的 `coverage` 只列已验收组件；`pendingCoverage` 列已经导出但待验证的页面；`plannedCoverage` 列尚未创建的组件。每份已导出文档保留 SHA-256，待验证文件有明确的迁移提示，入口分区列出，未创建的 Cursor 不生成失效链接。单组件导出仍拒绝悄悄给其他过期文件更新清单。

网页由共用 Markdown 渲染组件显示迁移提示，正文路由、标题和锚点保持原有结构。原有的历史验证记录保持 0.5.3 结论，组件阶段逐项重验后再修改正文。

复制代码的默认按钮名统一适配为“复制代码”。其他清除、关闭、菜单等组件专属中文文案随各组件处理。

`pnpm typecheck:ai-examples [组件名]` 可只检查目标组件的导出与阅读应用；省略仍检查全部。类型错误显示原始示例文件名，方便将失败归到对应组件，不会因为处于迁移中而跳过失败。

## 第一阶段检查结果

| 检查 | 结果 |
| --- | --- |
| 实际包与锁文件 | 发布包为 0.6.0，精确版本；安装版本校验保留 |
| `pnpm test:docs-export` | 76 项通过，包括全部生成文件/表格/示例、混合迁移覆盖、版本不匹配、缺项与单组件导出 |
| `pnpm docs:check` | 全部生成文件与来源一致 |
| `pnpm typecheck:docs` | 通过 |
| `pnpm typecheck:tests` | 通过 |
| `pnpm typecheck` | Nuxt 全站类型检查通过 |
| `pnpm typecheck:ai-examples button` | 6 个 SFC 通过；这不代表 Button 内容和交互已完成新版验收 |
| 公共无头浏览器检查 | Button 的明暗主题、1440/390px、原有章节/API 和实际代码复制，以及 Button/Input 网页迁移状态与清单一致，共 7 项通过 |
| 完整独立示例严格类型检查 | 16 处失败，见下表，保留为后续组件迁移待办 |

内置 Chromium 不存在，使用临时 `DOCS_BROWSER_CHANNEL=chrome` 运行系统 Chrome 无头模式。已查看代表性截图；公共内容没有横向溢出。窄屏导航占据首屏的现状记录为第二阶段公共视觉/布局核对项，版本提示的截图需滚动到正文后检查。第一阶段未运行完整构建，也未进行像素快照比较。

### 已定位的严格类型失败

全部由 Input 的 `update:modelValue` 扩展为 `string | number` 引起，原有文本示例需要显式处理模型类型。检查没有压制或忽略这些错误。

| 文件 | 错误数 | 处理阶段 |
| --- | --- | --- |
| `examples/input/basic.vue` | 1 | 2：Input |
| `examples/input/states.vue` | 2 | 2：Input |
| `examples/input/icons.vue` | 3 | 2：Input |
| `examples/input/debounce.vue` | 1 | 2：Input |
| `examples/input/methods.vue` | 1 | 2：Input |
| `tests/fixtures/ai-docs/input-understanding.vue` | 2 | 2：Input |
| `examples/form/layout.vue` | 1 | 3：Form |
| `examples/form/methods.vue` | 2 | 3：Form |
| `examples/form-item/message.vue` | 1 | 3：FormItem |
| `examples/form-item/span.vue` | 2 | 3：FormItem |

第四阶段进一步完成七个选择器与浮层组件，累计 20 个已验证组件；新增 Dialog 组合示例，全站 178 个 SFC 严格类型检查通过，见[第四阶段记录](bing-ui-0.6.0-stage-4.md)。

第五阶段完成五个数据与布局组件，累计 25 个已验证组件；新增三个独立示例，全站 182 个 SFC 严格类型检查通过，见[第五阶段记录](bing-ui-0.6.0-stage-5.md)。

上述状态为第一阶段结束时的基线。第二阶段解决 Input 的 10 处类型错误，第三阶段解决 Form/FormItem 剩余 6 处；全站 177 个 SFC 的严格类型检查已通过。详见[第二阶段记录](bing-ui-0.6.0-stage-2.md)和[第三阶段记录](bing-ui-0.6.0-stage-3.md)。

### 临时文件清理待办

浏览器测试的临时服务已关闭，3107 端口无监听。本轮截图和类型快照的递归删除被自动审批拒绝；改为仅删除明确的七个文件并移除空目录后仍被拒绝，返回原因仅为 `blocked by policy`。没有改用其他工具绕过拒绝。

因此以下本轮临时文件仍保留，未纳入 Git 提交，后续具备清理条件时处理：

- `C:/workspace/bing-ui-docs\test-results\site`：四张迁移提示截图和 `.last-run.json`。
- `C:/Users/<user>/AppData\Local\Temp\bing-ui-docs-060-Qg9Nix`：`old-types.json` 与 `published-type-diff.json`。

此项仅影响临时文件清理，不改变上述检查结果；在完成整个更新计划前仍需处理。

第六阶段完成八个展示与转场组件，已有 33 个组件全部验证；新增附件嵌套预览示例，全站 183 个 SFC 严格类型检查通过。文档修订 r6，Cursor 保持待新增，见[第六阶段记录](bing-ui-0.6.0-stage-6.md)。

第七阶段新增 Cursor 完整页面及五个独立示例，累计 34 个已验证组件、154 个独立示例和 189 个示例及阅读应用 SFC；文档修订 r7，详见[第七阶段记录](bing-ui-0.6.0-stage-7.md)。

第八阶段完成首页、快速开始、升级指南、README 和 r8 版本清单统一，34 个组件均为已验证。全量站点 265 项、独立导出及阅读应用 231 项浏览器测试通过；78 项导出测试、189 个 SFC 严格检查及 Nuxt/文档/测试类型检查通过。详见[整体收尾记录](bing-ui-0.6.0-stage-8.md)。

本轮文档实现与验证已收尾，临时服务已结束。清理仍被自动审批拒绝，保留各阶段记录中的准确路径，没有将这一限制记作已完成。
