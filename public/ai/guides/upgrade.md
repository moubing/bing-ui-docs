版本升级

# 版本升级指南

当前目标：`@moubing/bing-ui@0.19.0`，文档修订 **r3**。适用起点：**0.13.x**；最后核对：**2026-11-13**（npm 官方 registry、发布包类型及组件库 CHANGELOG）。这里的版本是本次核对目标，不表示未来仍是 npm 最新版。

从已安装版本开始，逐项检查下方兼容变更，再选择新增能力。0.19.0 的新增能力无需迁移；从 0.13.x 跨到当前版本仍须检查 0.16–0.18 的变化。从 0.12.x 或更早版本升级时，继续阅读保留的 0.12、0.7 与 0.6 历史章节。历史版本编号、默认值和验收记录只在标明的范围内有效。

完整发布事实见组件库 [CHANGELOG](https://github.com/moubing/bing-ui/blob/main/CHANGELOG.md)。本页聚焦调用方迁移，完整 API 以对应组件页为准；[AI 版升级指南](/ai/guides/upgrade.md)与网页共用正文。

## 更新到当前目标

沿用项目原有包管理器和锁文件。以下以 pnpm 为例，安装核对过的精确版本：

```sh
pnpm add @moubing/bing-ui@0.19.0 gsap@^3.15.0
```

- peer 依赖为 `vue@^3.5.0`、`gsap@^3.15.0`，以及可选的 `zod@^4.0.0`。
- Zod 不再作为组件库的运行时依赖随包安装。使用 BingForm 的 `schema` 校验，或应用直接导入 `zod` 时，在自身依赖中声明 `zod@^4`；不使用 schema 的项目无需安装。
- `BingFormSchema` 从 0.12.4 起仅声明 `safeParseAsync` 校验接口，不再作为 `z.ZodType` 的别名。Zod schema 继续兼容；需要调用 Zod 专有方法时保留 schema 自身的推导类型，可用 `satisfies BingFormSchema` 检查接口。仅使用其他组件时，未安装 Zod 也能通过严格类型检查。
- 继续全局导入 `@moubing/bing-ui/style.css`，并从包入口按需导入组件。Vue 与 Nuxt 的接入代码见[快速开始](/docs#usage)。
- 升级后先做受影响页面的类型检查与交互验证；产物格式或应用构建配置发生变化时，再补生产构建验证。

## 0.13.x → 当前版本索引

- **0.13.1–0.13.3**：[拖放与 Toast 补丁](/docs/upgrade#package)，原调用方式无需迁移。
- **0.14.0**：[公开代码高亮 API](/docs/upgrade#code-highlight)，可选接入，原 CodeBlock 无需迁移。
- **0.15.0**：[DropDown 虚拟锚点与边界](/docs/upgrade#dropdown-anchor)，可选接入。
- **0.16.0**：[Dialog 关闭保护与焦点](/docs/upgrade#dialog-016)、[Tooltip / DropDown 交互](/docs/upgrade#overlays-016)，按依赖旧行为的情况迁移。
- **0.17.0**：[Select / TreeSelect 字符定位与语义](/docs/upgrade#pickers-017)，检查插槽及浏览器测试。
- **0.18.0**：[Input 数字空值](/docs/upgrade#input-018)、[Textarea 默认值](/docs/upgrade#textarea-018)、[Table 键盘和索引](/docs/upgrade#table-018)、[Slider 样式和交互](/docs/upgrade#slider-018)，优先检查。
- **0.18.1 / 0.18.2 / 0.18.3 / 0.18.4 / 0.19.0**：[修复与新增能力](/docs/upgrade#patches-019)，原调用方式无需迁移。

## 需要调用方检查的变化

## 0.18：Input 数字空值

[Input](/docs/components/input#number) 的数字模型只发布 `number | null`，清空从 `''` 改为 `null`；公共 `BingInputValue` 为 `string | number | null`。文本模式仍使用字符串。旧的 0.6–0.17.x “清空为空字符串、不会发出 null”说明不适用于 0.18.0 及以后。

旧写法（仅用于识别待迁移代码）：

```text
const amount = ref<string | number>('')
const empty = amount.value === ''
```

当前写法（通过事件收窄类型，避免类型断言掩盖空值）：

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingInput, type BingInputValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const amount = ref<number | null>(null)
function updateAmount(value: BingInputValue) {
  if (value === null || typeof value === 'number') amount.value = value
}
</script>

<template>
  <BingInput type="number" :model-value="amount" :min="0" :step="0.5"
    clearable ariaLabel="金额" @update:model-value="updateAmount" />
  <p>{{ amount === null ? '尚未填写' : amount }}</p>
</template>
```

迁移检查：把数字空值校验和接口序列化改为显式处理 `null`，不要用 `String(value)` 把空值变成文字 `"null"`。无效的输入中间态只更新显示；默认在失焦或 Enter 时按 min / max / step 规整，不要假设每次敲键都已经得到最终值。`input` / `debounced-input` 仍传字符串，原生 `change` 仍传 `Event`；不要把它们与模型事件混用。密码显隐、前后缀、计数、加载态和 `enter` 为新增能力，按需启用。

## 0.18：Textarea 清除与提交

[Textarea](/docs/components/textarea) 的 `clearable` 默认由 `true` 改为 `false`。旧的 `<BingTextarea v-model="text" />` 仍能编辑，但不会自动出现清除按钮；需要原清除入口时显式开启：

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingTextarea } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const text = ref('待编辑的说明')
</script>

<template>
  <BingTextarea v-model="text" clearable ariaLabel="说明" />
</template>
```

清除后焦点留在控件内，5 秒内可 Ctrl / ⌘+Z 恢复；新输入、离开或超时后失效。`submitOn` 默认 `none`，新 `submit(value, event)` 无需主动接入；启用 Enter / Mod+Enter 提交时应验证中文组词确认不会误提交。`autosizeTransition` 默认开启，自动增高有 120ms 过渡；依赖立即测量高度的代码改为在 `resize(height)` 后读取，或显式关闭过渡。

## 0.18：Table 键盘、索引与行高

[Table](/docs/components/table) 默认开启 `keyboardNavigation`，使用 `grid / treegrid` 的单一 Tab 入口；方向键在单元格移动，F2 / Enter 进入内部控件，Esc 返回单元格。旧测试逐个 Tab 访问行内按钮的路径需要调整。业务暂时需要原生 Tab 顺序时显式关闭；`scrollbarGutter` 默认从固定预留改为 `auto`，需要保持轨道占位时设置 `stable`。

旧写法中的 `:row-key="(_row, index) => index"` 不能继续依赖显示序号：回调 `index` 现在是原始数据的同级序号，排序、分页、展开不会改变它；各层级 key 仍必须全表唯一。优先使用稳定业务字段。当前写法（按需保留旧焦点和占位行为）：

```vue
<script setup lang="ts">
import { BingTable, type BingTableColumn } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const rows = [{ id: 'task-1', title: '检查升级页面' }]
const columns: BingTableColumn[] = [{ key: 'title', title: '任务' }]
</script>

<template>
  <BingTable :data="rows" :columns="columns" row-key="id"
    :keyboard-navigation="false" scrollbar-gutter="stable" />
</template>
```

- `virtualRowHeight` 现在仅预估尚未测量的行，实测高度按 key 缓存，不再把所有行强制拉高。旧代码依赖该属性固定行高时，应通过单元格内容约束高度；验证长文本、图片加载和展开后滚动定位。
- `rowDisabled(row, index)` 的 index 是原始全树的前序序号，与 `rowKey` 的同级序号不同；按行字段判断可用性更稳妥。
- 无分页时，列设置默认移到工具栏或表头右上角；需要旧页脚位置时显式设 `columnControlsPlacement="footer"`。检查活动行、选择行、固定列和错误 / 空态；新增范围、级联、跨页选择及骨架功能按需使用。
- 全局新增 `--bing-focus-ring`。Button 默认 `flex-shrink: 0`；业务确需压缩按钮时设置 `flex-shrink: 1; min-width: 0`，检查长文案和窄屏布局。

## 0.18：Slider 的样式与操作

[Slider](/docs/components/slider) 采用自绘轨道、填充和滑块，仍保留原生 range 的标签、焦点、读屏及表单提交。普通单值 `v-model`、连续更新与结束时单次 `change` 的调用方式无需修改。

旧的 `input::-webkit-slider-thumb`、`::-moz-range-thumb` 或 `.bing-slider > input` 覆盖不再能代表可见滑块。移除这类内部结构依赖，改用 [Slider 样式变量](/docs/components/slider#controlled)。例如原来通过原生 thumb 伪元素改强调色，现在可在组件外层设置 `--bing-slider-color`；`.bing-slider`、禁用和状态类名仍保留。

检查键盘与触屏测试：Shift + 方向键为 10 倍步长，PageUp / PageDown 为范围的 10%（不小于 step）；Esc 撤销拖动且不提交 change；横向触屏点按轨道在松手时生效，纵向滑动保留页面滚动。受控拒绝会在操作结束后恢复父级值。

范围值使用数值元组；`range`、`minDistance`、`thumbAriaLabels`、刻度、气泡、`orientation="vertical"`、`resetValue` 及 `focus(index?)` 都是可选能力。接入时再核对类型与双滑块标签，无需为了升级把单值改成范围值。

## 0.16：Dialog 关闭保护与焦点

[Dialog](/docs/components/dialog) 的 `confirmLoading` 现在默认同时启用 busy 保护，遮罩、Esc、取消、关闭按钮和 footer 的关闭方法均会受阻。旧 `<BingDialog :confirm-loading="saving" />` 如果依赖“保存中仍可关闭”，现在必须显式设置 `:busy="false"`；不需要关闭的页面沿用原调用即可。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingDialog } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const open = ref(false)
const saving = ref(false)
</script>

<template>
  <button type="button" @click="open = true">编辑资料</button>
  <BingDialog v-model="open" title="编辑资料" :confirm-loading="saving" :busy="false">
    <input aria-label="姓名" />
  </BingDialog>
</template>
```

默认焦点从头部工具按钮改为内容区表单控件，没有可用控件时聚焦面板。测试应检查业务输入框或使用 `initialFocus` 指定目标。`BingDialogCloseReason` 新增 `swipe`，穷尽 switch 需补分支；窄屏贴底面板可从顶部下滑关闭。`beforeClose` 和 `close-prevented` 可用于关闭确认与反馈；直接修改 v-model 仍能关闭，并绕过用户关闭守卫。自定义 footer 需用插槽 `busy` 管理自己的按钮状态。`glass` 保留为无视觉效果的废弃属性。

## 0.16：Tooltip 与 DropDown 交互

- [Tooltip](/docs/components/tooltip)：点击 hover 触发器会关闭提示，离开前不会因 hover / focus 再开；只有 `:focus-visible` 焦点打开提示。程序调用 `.focus()` 的测试不能一概断言浮层出现，应使用真实键盘 Tab 或显式受控打开。共享面板换主新增 `close('replaced')`，穷尽关闭原因的处理器需补分支。
- ARIA 描述关联到实际触发元素；自定义触发内容可使用 `triggerProps`。`suppressWhenExpanded` 默认 true，菜单展开后提示关闭；需要两者共存时显式关闭此选项。`skipDelay=300ms`、`shortcut` 和 `tone="inverse"` 是可选配置，常规事件与公开方法保持兼容。
- [DropDown](/docs/components/drop-down)：菜单项采用 roving tabindex；Tab / Shift+Tab 关闭菜单并从触发器继续原生顺序，Esc 逐层返回。右键菜单保持编辑器焦点，键盘打开或显式 `autoFocus` 仍可聚焦菜单；不要再用旧的入场后自动抢焦点作为测试前提。
- 所有菜单使用内部滚动区；指针与键盘共用每层高亮。`active` 仍兼容高亮与 `aria-current`，表示选中选项时可改用 `type="radio"` 与 `checked`；对应测试使用 `menuitemradio` / `aria-checked`。Group、Divider、`hoverOpenDelay` / `hoverCloseDelay`、`typeahead` 和 `highlightMotion` 为新增能力，现有事件与公开方法无需改写。

Checkbox / CheckboxGroup、AnimatedText / Button 的视觉和动效增强保留原选择与点击接口；拖动连选、Shift 范围选择及新文字播放能力按需开启。应复查减少动态效果与 SSR 水合，不据此增加业务兼容层。

## 0.17：Select / TreeSelect 语义与定位

[Select](/docs/components/select) 与 [TreeSelect](/docs/components/tree-select) 默认开启 `typeahead` 和 `highlightMatches`，可通过标签前缀、英文缩写及中文拼音首字母定位；字符定位只改变活动项，不会直接选择。若业务已经接管这些按键，可显式设 `:typeahead="false"`；关闭匹配标记使用 `:highlight-matches="false"`。

原 v-model 与选项数据用法无需迁移。自定义 `option` / `node` 插槽不会被自动改写，新增 `matchRanges` 为 UTF-16 起止偏移（end 不包含）；需要高亮时才消费它。默认标签会被 `<mark>` 拆成文本片段，旧的整段文本节点选择器及背景颜色断言需要调整。

浏览器测试按角色和状态定位：Select 选项用 `option` / `aria-selected`，全选入口移到面板头部并使用三态 `checkbox`（搜索时名称为“全选结果”）。TreeSelect 行用 `treeitem`；单选读 `aria-selected`，多选读 `aria-checked`，父级部分选中为 `mixed`，不要把行内装饰勾选图案当作独立 checkbox。

```ts
// 在已展开的 Select 多选面板中，按真实语义检查，而非匹配某种背景或内部图标。
const option = page.getByRole('option', { name: '成都', exact: true })
await option.click()
await expect(option).toHaveAttribute('aria-selected', 'true')
```

TreeSelect 搜索开始时保存展开快照，修改查询展开匹配路径，清空恢复快照；收起活动分支先回到父级。若测试曾假定清空后全展开或所有节点都在 DOM 中，改为验证可见树与业务选中值，虚拟列表仍只渲染窗口内节点。

## 0.14：公开代码高亮 API（可选）

从包根导入 `getCodeLanguages`、`normalizeCodeLanguage`、`resolveCodeTheme`、`highlightCode` 及对应 token 类型，可在编辑器中复用 [CodeBlock 高亮](/docs/components/code-block#tokens)。原 BingCodeBlock 无需迁移；不要改用 dist 内部路径。

纯文本不加载 Shiki，未知语言或加载失败会让 `highlightCode` 的 Promise 拒绝；直接调用时自行处理失败。`resolveCodeTheme('auto')` 只解析当时的主题，不自动订阅主题变化。代码块组件自身的纯文本回退与错误事件继续有效。

## 0.15：DropDown 虚拟锚点（可选）

[DropDown](/docs/components/drop-down#caret) 新增 `anchor` 虚拟矩形锚点和 `boundary` 局部视口，可用光标矩形打开菜单，并按可用空间翻转、限制宽高。普通触发器和右键菜单无需迁移；接入编辑器时用公开属性提供矩形与边界，保留编辑器焦点，勿操作内部定位 DOM。

## 0.18.1–0.19：修复与新增能力

以下各项原调用方式**无需迁移**。有为旧缺陷添加的临时规避时，先验证业务场景再移除。

- **0.18.1**：Table 全文提示节点不再挡住普通文字点击激活或 `selectOnRowClick`；输入框、按钮仍隔离行操作。
- **0.18.2**：Table 交互控件检测限制在当前行，放入可聚焦滚动容器后仍可点击普通内容激活或选择。
- **0.18.3**：DropDown 显式保留原生 DOMRect 宽高，修复 `end` 对齐偏移到视口边缘。复查四方向和窗口尺寸变化，无需手补偏移。
- **0.18.4**：Slider 方向样式限定到自身，修复在 Dialog / 纵向 Scrollbar 中横向滑块被错误套用竖向样式。
- **0.19.0**：[Autocomplete](/docs/components/autocomplete) 通过 `optionActionLabel` 启用独立行尾按钮，以 `option-action` 事件处理操作；普通候选选择保持原行为。只有需要独立操作时才接入，不能把操作按钮的点击当作选中候选。
- **0.19.0**：Button、Tabs 等共用的点击碎屑改用浏览器原生 transform / opacity 动画，减少业务重渲染阻塞反馈；轨迹、时长、减少动态效果与清理规则保持一致，业务点击事件无需延迟。

## 更早版本的历史迁移

以下保留原章节锚点。0.12 节面向 0.11.x 及以前；0.7 节面向 0.6.x 及以前；0.6 节面向 0.5.3 及以前。后续版本已覆盖的约定会在段内单独标注。

## 0.12 历史：产物格式与依赖

0.12.0 的 Node / SSR dayjs 插件路径缺少扩展名，请跳过该版本，0.12.1 已修复。0.12.2–0.12.5 分别修复 SplitPane 隐藏后重显、Select / TreeSelect 抢回焦点、可选 Zod 公共类型与局部 Tooltip 动效，以及 Resizable 比例锁定突跳。当前安装目标见页首，不建议停留在这些历史补丁。

0.13.0 新增 [DragDrop](/docs/components/drag-drop) 和 [Toast 操作按钮](/docs/components/toast#action)；0.13.1 / 0.13.2 修复拖放归位交接及源条目消失时的浮层动画，0.13.3 修复 Toast 同 action 更新 loading 与旧 Promise 干扰新操作。原调用方式无需迁移。

这是 0.x 阶段的兼容性变更，主要影响构建方式而不是组件用法：

- **移除 UMD 构建**：包入口改为 `dist/index.js`，只提供 ESM。通过 `<script>` 标签加载 UMD 文件、或在 CommonJS 中 `require('@moubing/bing-ui')` 的项目需要改用支持 ESM 的打包器（Vite、Nuxt 等）。
- **多文件输出**：产物按模块拆分，打包器可以摇树移除未使用的组件。Shiki、Day.js、dnd-kit 和 `gsap/*` 子路径不再打进产物，而是作为依赖由打包器解析；不要从 `dist` 内部路径导入，只使用包入口和 `style.css`。
- **CodeBlock 按需加载 Shiki**：[BingCodeBlock](/docs/components/code-block) 在首次高亮时才加载 Shiki 核心、语法和主题，加载完成前先显示纯文本。依赖高亮结果的测试应等待高亮完成后再断言。
- **内部图标固化**：组件内置图标改为本地 SVG 组件，组件库不再依赖 `lucide-vue-next`，图标外观不变。组件内图标的类名由 `lucide lucide-*` 改为 `bing-svg-icon bing-svg-icon--*`，覆盖这些类名的业务 CSS 或测试选择器需要同步修改。业务自己的图标继续使用自行安装的图标库，见 [BingIcon](/docs/components/icon)。

## 0.12 历史：全局配置与默认尺寸

新增 [BingConfigProvider](/docs/components/config-provider)，为子树统一设置默认尺寸 `size`、浮层层级基准 `zIndex` 和 JS 动效策略 `reducedMotion`。不放置 Provider 时，组件尺寸、各浮层的默认层级和动效行为与 0.11.x 一致。

- BingForm、BingTag、BingTabs、BingTable、BingDropDown 的 `size` 不再在 props 上预填 `md`，未传时按 Provider 解析，最终仍回落到 `md`。读取组件实例 props 或用 `$props.size` 判断尺寸的代码，现在会拿到 `undefined`。
- 浮层层级默认基准为 2000，Dialog、Toast、预览、选择器面板和 Tooltip 在基准上加固定偏移。页面已有高层级的固定元素时，用 Provider 的 `zIndex` 整体抬高，比逐个组件设置更可靠；显式传入的 `zIndex` 仍然优先。
- 各组件分散的 `prefers-reduced-motion` 检测统一为共享实现，并遵循 Provider 的 `reducedMotion`。需要应用内“关闭动画”开关时设置为 `always`；CSS 媒体查询实现的降级仍跟随系统设置。
- 新增 `useBingConfig()` 和 `useReducedMotion()`，供业务组件读取同一套配置。

以下几节保留从 0.6.0 跨版本升级时需要核对的 0.7.0 变更；已经完成 0.7.0 迁移的项目可直接进行末尾的逐页验收。

## 0.7.0 迁移补充：Cursor 迁移到原生光标

[BingCursor](/docs/components/cursor) 在 0.7.0 改为 CSS cursor 图片，由浏览器更新鼠标位置，减少主线程繁忙时跟随层停顿的影响。保留 16 种状态、自动识别、全局与局部作用域、配色、尺寸、热点以及原生回退。

这是 0.x 阶段的兼容性变更，需要删除以下旧用法：

- 属性：mode、followDuration、transitionDuration、zIndex。
- 自定义 cursor 插槽及其 type、pressed、size、label、target 插槽参数。
- data-bing-cursor-label 元素属性。
- BingCursorMode、BingCursorSlotProps 类型导入。

仅使用默认 BingCursor 的项目可以沿用原写法。外观配置使用 type、color、outlineColor、size 和 hotspot；data-bing-cursor 继续支持显式状态与 native 排除区域。跟随圆环、连续形变和 HTML 提示已移除，不能通过旧参数重新开启。

保留按钮、输入等真实语义及可访问名称。局部范围按 DOM 判断，不会自动包含 Teleport 浮层；KeepAlive 页面停用时应按示例停用或卸载实例。组件按需接入，文档站保持全局 Cursor 关闭。

## 0.7.0 迁移补充：Table 与 Scrollbar 性能优化

[BingTable](/docs/components/table) 和 [BingScrollbar](/docs/components/scrollbar) 的公开 API 与默认平滑滚动保持不变，无需改成原生滚动来获得本次优化。

- 滑块位移与滚动内容渲染分离，减少滚动触发的重复工作。
- Table 共享尺寸监听，批量测量变化的单元格，并复用列样式。
- 列宽拖动按帧更新，松手时保留最后一次位置。
- 保留列拖拽落位、分页过渡、截断文字提示、虚拟滚动与键盘操作。

升级后验证业务的横纵滚动、列宽调整、列排序、动态数据和含交互控件的单元格。大量数据仍应结合 virtual、稳定的 rowKey、合适的 maxHeight 与一致的行高使用。

以下几节保留从 0.5.3 跨版本升级时需要核对的 0.6.0 变更；已经完成 0.6.0 迁移的项目可直接进行末尾的逐页验收。

## 0.6.0 迁移补充：样式、尺寸与主题

默认视觉改为中性灰黑、实色控件、细边框和轻阴影；暗色采用炭灰表面。业务品牌色仍可通过语义变量定制。

- Input、Select 等常规控件的 `sm / md / lg` 高度为 `32 / 36 / 40px`；Button 另有 `xs=28px` 与 `xl=44px`。Table 基础行高为 `36 / 40 / 44px`，Tabs 外层高度为 `32 / 36 / 40px`，其他控件以各页尺寸说明为准。
- Icon 默认 `strokeWidth` 为 `1.75`。旧代码显式传入 `2` 会继续覆盖默认值，需要更细描边时删除该覆盖或主动调整。
- 支持磨砂的组件从主题继承模糊 `16px`、饱和度 `1.05`，以及浅色 `0.86` / 深色 `0.92` 的底色不透明度。固定的 `glassOpacity` 不会自动跟随主题；`glass=false` 的具体表现见对应组件页。
- 检查旧的固定高度、粗字重、阴影、半透明背景，以及直接覆盖 `.bing-*` 内部类名的 CSS。优先使用公开属性和语义变量，避免旧覆盖遮住新版默认外观。
- 将 `data-bing-theme` 放在 `html` 上，让 Teleport 浮层继承主题；检查浅色、深色和 `system`。品牌色应同时维护 accent、strong、solid、contrast、focus 及对应 RGB channel，详见[主题配置](/docs#themes)。

## 0.6.0 迁移补充：Button 与 Input

**Button** 的 `throttle` 默认为 `false`。旧业务如果依赖按钮内部节流，需要显式传入 `:throttle="true"`；异步提交仍应由业务管理 loading、请求状态和重复提交。按钮默认 `htmlType="button"`，提交表单需明确设置 `html-type="submit"`。参见 [Button](/docs/components/button#states)。

**Input（仅 0.6.0–0.17.x）**：当时模型与 `update:modelValue` 为 `string | number`，数字清空发出空字符串、不发出 null，示例使用 `ref<string | number>('')`。**此约定已被 0.18.0 覆盖，不适用于当前版本。** 数字输入现在使用 `number | null`；迁移时按[当前数字模型](/docs/upgrade#input-018)处理，不要继续复制旧空值判断或用 `String($event)` 抹平类型差异。

- `clearable` 默认仅在 `type="search"` 时开启。普通文本框仍需清除按钮时显式传入 `clearable`；只读或禁用状态不展示清除按钮。
- `autocomplete` 默认是 `off`。需要浏览器自动填充时显式指定合适的原生值，例如 `email` 或 `username`。
- 新增 `min / max / step`、`readonly` 和默认开启的 `smoothCaret`。减少动态效果、输入法组字和选区等场景会回到原生光标。
- `input`、`debounced-input` 的参数仍是字符串；不要将它们和模型更新事件混为一谈。详细事件及数字清空行为见 [Input](/docs/components/input#number)。

## 0.6.0 迁移补充：Form 与 FormItem

`validateTrigger` 默认改为 `auto`：失焦和提交时校验，已有错误的字段在修改时复查。若旧页面需要仅提交时校验，应显式设置 `validate-trigger="submit"`；仅由业务主动调用方法时使用 `manual`。

- 新增默认开启的 `focusOnError`：提交失败后聚焦首个可用错误字段。异步校验期间用户已继续编辑或改变焦点时不会抢焦点。`validate()` 本身不主动聚焦；`scrollToError` 与聚焦是两个独立开关。
- 新增默认关闭的实验性 `nextStepHint`，只提示实际下一个 Tab 落点，不改变键盘顺序。
- `submit` 事件在校验失败时也会发出；保存前必须检查 `valid`。当触发方式不包含 `auto` 或 `submit` 时，不执行提交校验，不能把事件中的 `valid=true` 当作 schema 已通过。
- 保持 FormItem 字段路径、控件 ID、label 与说明关联正确，核对布局和错误文字出现时的高度变化。完整示例见 [Form](/docs/components/form) 与 [FormItem](/docs/components/form-item)。

## 0.6.0 迁移补充：浮层、预览与转场

本节记录 0.6.0 时的浮层组合验收与边界，不代表当前版本全部重新验收。旧版限制不要机械保留，也不要整段删除：把业务中实际使用的浮层组合、Escape、Tab 和关闭后的滚动逐一走通；Dialog / Tooltip 后续行为另见本页 0.16 章节。

- AnimatedText 已支持同一实例更新文字，可移除仅为绕过旧更新问题而设置的强制重挂载 `key`；保留原始可访问文本，不让装饰字符成为重复朗读内容。参见 [AnimatedText](/docs/components/animated-text)。
- Table 加载时会保留表格高度与数据，并管理加载期间的表格区域和分页交互。业务工具栏及列设置不等同于被统一禁用；按业务需求单独管理。参见 [Table](/docs/components/table)。
- 清除、关闭、复制等内置可访问名称已中文化。测试应按当前角色与名称定位；自行提供的 `ariaLabel` 仍由业务负责。
- FilePreview 在**打开非图片后直接切换成图片并关闭**的跨分支场景中，旧滚动锁仍可能保留到卸载；先关闭旧预览，再切换内容重新打开。自动图片识别需要图片 MIME 或明确 `type`，不能只依赖图片文件扩展名。参见 [FilePreview](/docs/components/file-preview)。
- CarouselTransition 对禁用相邻项的滚轮 settle 仍可能产生位移；需要禁止此类动作时参考文档中的业务层滚轮拦截。三个转场组件的离屏内容默认使用 `aria-hidden`，含可聚焦控件时仍需按示例设置 `inert`。动态增删内容的布局更新与事件时机见 [CarouselTransition](/docs/components/carousel-transition)、[DeckTransition](/docs/components/deck-transition) 和 [AppSwitcherTransition](/docs/components/app-switcher-transition)。

## 逐页验收

1. 从实际安装包运行受影响示例的类型检查，核对数字空值、Textarea 清除按钮、Dialog 忙碌保护、Select / TreeSelect 语义、Table key 与 Slider 样式。只有产物或构建配置变化时才补生产构建验证。
2. 在浅深主题与窄屏检查默认尺寸、长文案、空态、加载和禁用；显式样式应符合业务意图。
3. 验证提交、防重复请求、键盘操作、错误聚焦、嵌套浮层及关闭后的滚动恢复。
4. 检查系统减少动态效果（以及 Provider 的 `reducedMotion`）、路由离开与返回、动态数据和卸载清理。
5. 更新业务截图、可访问名称定位和复制示例，按组件逐批完成升级。

本页当前适用 `@moubing/bing-ui@0.19.0`，修订 r3。完整 API 和交互示例以各组件页为准；AI 可通过 [llms.txt](/llms.txt) 与[版本清单](/ai/manifest.json)读取当前验证范围。清单的组件验证数量只表示组件记录，不代表升级页、快速开始或线上部署已通过验收；全站页面核对单独记录在清单的 `siteReview` 中，未核对项标为 pending。

维护发布文档时，先重新查询 npm，再对照 CHANGELOG、已安装包和源组件；即使没有用户侧迁移，也要写明“无需迁移”并链接变更记录。更新导出后检查目录、旧锚点、链接与窄屏阅读；部署后重新读取线上页面、llms.txt 和 manifest，才能确认已部署版本。
