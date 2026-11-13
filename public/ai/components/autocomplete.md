# BingAutocomplete

> 目标组件包：@moubing/bing-ui 0.19.0；文档修订：r3。
> 已验证：已完成 0.19.0 的文档与示例验证。

此文件由正文、API 数据和完整示例自动生成，可直接阅读，不需要启动文档站。修改源文件后运行 pnpm docs:export autocomplete；请勿手工修改生成结果。

运行示例需要已配置 Vue 3 单文件组件的项目，依赖 Vue 3.5 与 GSAP 3.15 系列，导入 zod 的示例另需安装 Zod 4（Bing UI 的可选 peer 依赖）；Bing UI 使用上方标注的版本。示例已导入组件和样式，不依赖 Nuxt 别名、文档站组件或组件自动注册。三个 Vue 代码块是独立示例，分别保存为一个 .vue 文件使用。TypeScript 项目需配置 CSS 导入类型声明，例如 Vite 项目的 vite/client。

候选与处理函数完整内置；受控示例模拟失败，行尾操作示例只显示反馈。真实请求、权限、导航和历史由业务负责。

BingAutocomplete 提供原位输入和候选提示，适合 Header 搜索、快速跳转与自动补全。输入框使用 BingInput，滚动使用 BingScrollbar；它只管理输入及候选交互，接口、匹配规则、导航和最近浏览由业务负责。自 0.8.0 提供。

## 输入与选择

默认聚焦即可打开候选，包括空输入。模型是输入文字，select 事件返回候选对象，两者互相独立。默认仅按 label 包含关键字筛选，忽略大小写；description、detail 和 meta 不参与默认搜索。选择后默认补全文字并关闭面板。

从 0.9.0 起可设置 `:open-on-empty="false"`：空字符串或纯空白时，聚焦、方向键和 `focus()` 都不会展开面板；输入有效文字后展开，清空后自动收起。该属性默认 `true`，不改变原有空输入展示候选的行为；是否提供历史记录仍由业务决定。

上下键移动候选并跳过禁用项，Enter 选择，Escape 关闭，点击外部或焦点离开后关闭。中文组词期间 Enter、方向键和 Escape 交给输入法，并保留 BingInput 的平滑光标；确认文字后才更新查询与候选。输入框保持 combobox 语义，候选为 listbox/option。

悬停或方向键高亮时，详情可使用 detail、description、meta 或 option-detail 插槽。从 0.8.2 起，候选面板进出、悬停反馈和详情切换复用 BingSelect 的动效；详情跟随当前选项垂直定位，内容与高度连续过渡。鼠标经过两个面板间的空隙有 120ms 宽限，移入详情继续保留，离开后淡出。滚动候选时先隐藏旧详情，停止后按鼠标所在项恢复；键盘滚动保持当前高亮，不被静止鼠标覆盖。

0.9.0 保留候选逐项交错出现的动画，并为面板与参与动画的可见选项设置合成层提示，减少缩放期间文字重绘造成的轻微抖动。调用方无需为此覆盖组件内部 CSS。

空间充足时详情显示在候选旁边，靠近右边缘时向左展开，并保持在视口内；窄屏改为候选下方的独立滚动区域，与当前候选同时可见。详情只放说明，全局操作放在 footer，单项操作使用下方的行尾按钮。详情为 aria-hidden 的辅助预览，必需信息仍应放在候选可访问名称中；长 label 的完整内容仍作为候选的可访问名称。减少动态效果时跳过动画。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingAutocomplete } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const query = ref('')
const chosen = ref('尚未选择')
const options = [
  { value: 'req_7', label: 'REQ-7（付款数据分类）', meta: { 状态: '进行中', 负责人: '设计同学' } },
  { value: 'req_4', label: 'REQ-4（编辑器布局优化）', meta: { 状态: '待整理', 负责人: '前端同学' } },
  { value: 'req_2', label: 'REQ-2（文档搜索）', disabled: true },
]
</script>
<template>
  <div style="width: 360px; max-width: 100%">
    <BingAutocomplete v-model="query" :options="options" placeholder="输入编号或名称" ariaLabel="搜索需求" block @select="chosen = $event.label" />
    <p role="status">已选择：{{ chosen }}</p>
  </div>
</template>
```

## 业务筛选与异步加载

设置 filter=false 后，组件使用调用方传来的全部候选及顺序。loading 和 error 期间不能选择旧结果；请求取消、较旧响应过滤、权限校验和重试由业务实现。以下示例在本地模拟筛选和失败，不发送请求。

导航型搜索可同时关闭 completeOnSelect 和 closeOnSelect；异步跳转成功后调用 close()，失败时保留输入和候选。以下受控示例还设置 `openOnEmpty=false`，输入前只展示输入框。focus() 可用于业务快捷键，但业务应避开已打开的模态框和中文组词过程；它同样遵守空输入开关。

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import { BingAutocomplete, BingButton, type BingAutocompleteExpose, type BingAutocompleteOption } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const query = ref('')
const search = ref<BingAutocompleteExpose | null>(null)
const failed = ref(false)
const chosen = ref('尚未选择')
const all = [{ value: 'a', label: 'REQ-7（付款分类）' }, { value: 'b', label: 'REQ-4（页面布局）' }]
const options = computed(() => all.filter(item => item.label.replace('-', '').toLowerCase().includes(query.value.replace('-', '').trim().toLowerCase())))
function select(option: BingAutocompleteOption) { chosen.value = option.label; search.value?.close() }
</script>
<template>
  <div style="display: grid; gap: 12px; width: 380px; max-width: 100%">
    <BingAutocomplete ref="search" v-model="query" :options="options" :filter="false" :open-on-empty="false" :complete-on-select="false" :close-on-select="false" :error="failed ? '模拟加载失败' : ''" ariaLabel="受控搜索" placeholder="试试 req7，空输入不展开" block @select="select">
      <template #header>业务筛选：支持省略编号中的连字符</template>
      <template #error><BingButton variant="secondary" size="sm" @click="failed = false">重试</BingButton></template>
      <template #footer>找到 {{ options.length }} 个候选</template>
    </BingAutocomplete>
    <BingButton variant="secondary" @click="search?.focus()">聚焦搜索</BingButton>
    <BingButton variant="secondary" :disabled="!query.trim()" @click="failed = true; search?.focus()">模拟加载失败</BingButton>
    <p role="status">已选择：{{ chosen }}；关键字保留为：{{ query }}</p>
  </div>
</template>
```

## 独立行尾操作（0.19.0 起）

设置 `optionActionLabel` 后，每条候选右侧显示独立按钮，可通过 `option-action` 插槽替换为图标。组件负责按钮、禁用态与可访问名称；插槽只放非交互内容，不嵌套按钮或链接。点击结果本身或在输入框按 Enter 仍触发 `select`；按钮通过 `option-action` 事件同步交给业务处理，不补全文字、不触发选择、不关闭候选。新标签页应在该事件内立即调用 `window.open`，避免等待异步请求后丢失浏览器用户激活。

启用按钮时浮层使用两列 `grid / row / gridcell` 语义，将候选内容与操作分开；不启用时仍为 `listbox / option`。输入框按 F2，或上下键选中后按右键，可聚焦当前按钮；按钮内上下键切换并跳过禁用项，Enter / Space 激活，左键、F2 或 Shift+Tab 返回输入，Escape 收起并返回输入，Tab 离开搜索。普通文字编辑中的左右键仍由输入框处理。以下示例仅显示操作结果，真实导航由业务实现。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingAutocomplete, BingIcon } from '@moubing/bing-ui'
import { ExternalLink } from 'lucide-vue-next'
import '@moubing/bing-ui/style.css'
const query = ref('REQ')
const result = ref('尚未操作')
const options = [
  { value: 'a', label: 'REQ-7（搜索结果可在当前页或新标签页打开）' },
  { value: 'b', label: 'REQ-4（页面布局）' },
  { value: 'c', label: 'REQ-9（不可访问）', disabled: true },
]
</script>
<template>
  <div style="display: grid; gap: 12px; width: 380px; max-width: 100%">
    <BingAutocomplete v-model="query" :options="options" :complete-on-select="false" :close-on-select="false"
      option-action-label="在新标签页打开" ariaLabel="带行尾操作的搜索" block
      @select="result = '当前页：' + $event.label" @option-action="result = '新标签页：' + $event.label">
      <template #option-action><BingIcon :icon="ExternalLink" :size="16" decorative /></template>
    </BingAutocomplete>
    <p role="status">{{ result }}</p>
  </div>
</template>
```

## Props

| 属性                            | 类型                                               | 默认值                                           | 说明                                                             |
| ----------------------------- | ------------------------------------------------ | --------------------------------------------- | -------------------------------------------------------------- |
| `modelValue`                  | `string`                                         | `''`                                          | 输入文字；使用 v-model 接收更新，不等于选中的 value。                             |
| `options`                     | `BingAutocompleteOption[]`                       | `[]`                                          | 候选数组，value 在当前数组中必须唯一。                                         |
| `filter`                      | `boolean`                                        | `true`                                        | 默认仅按 label 包含输入文字筛选，忽略大小写；false 使用业务传入的全部候选及排序。                |
| `openOnEmpty`                 | `boolean`                                        | `true`                                        | 自 0.9.0 提供；false 时，空字符串或纯空白不展开候选，清空后收起。聚焦、方向键及 focus() 均遵守此配置。 |
| `loading`                     | `boolean`                                        | `false`                                       | 显示加载状态，期间隐藏候选并禁止选择旧结果。                                         |
| `error`                       | `string`                                         | `''`                                          | 非空时显示错误并禁止选择；可在 error 插槽放重试按钮。                                 |
| `disabled`                    | `boolean`                                        | `false（可继承 Form）`                             | 禁用输入和选择并关闭面板。                                                  |
| `clearable`                   | `boolean`                                        | `true`                                        | 输入非空时显示清除按钮。                                                   |
| `placeholder`                 | `string`                                         | `undefined`                                   | 输入框占位文字。                                                       |
| `emptyText`                   | `string`                                         | `'没有匹配的候选'`                                   | 空候选提示，可通过 empty 插槽替换。                                          |
| `ariaLabel / ariaDescribedby` | `string`                                         | `undefined`                                   | 实际输入框的可访问名称和说明关系。                                              |
| `id`                          | `string`                                         | `自动生成或继承 FormItem`                            | 输入框 ID。                                                        |
| `size`                        | `'sm' \| 'md' \| 'lg'`                           | `继承 FormItem / Form / ConfigProvider，否则 'md'` | 输入框尺寸。                                                         |
| `status`                      | `'default' \| 'error' \| 'success' \| 'warning'` | `'default'（可继承 Form）`                         | 字段视觉状态。                                                        |
| `icon`                        | `Component`                                      | `undefined`                                   | 输入框前置图标；也可使用 icon 插槽。                                          |
| `block`                       | `boolean`                                        | `false`                                       | 占满父容器；默认宽 280px，并限制在父容器宽度内。                                    |
| `panelWidth`                  | `number`                                         | `320`                                         | 候选宽度（像素），至少与输入框等宽，最终受可视视口限制。                                   |
| `panelMaxHeight`              | `number`                                         | `360`                                         | 候选内容最大高度（像素），实际按上下空间收缩。                                        |
| `completeOnSelect`            | `boolean`                                        | `true`                                        | 选择后将 label 写入模型；导航搜索可关闭以保留关键字。                                 |
| `closeOnSelect`               | `boolean`                                        | `true`                                        | 选择后关闭面板；异步导航可关闭此项，成功后用 close() 收起。                             |
| `optionActionLabel`           | `string`                                         | `undefined`                                   | 自 0.19.0 提供：非空时为每条候选显示独立行尾按钮；按钮名称包含此标签和完整候选 label。候选禁用时按钮也禁用。  |

## Events

| 事件                  | 参数                                                    | 说明                                                      |
| ------------------- | ----------------------------------------------------- | ------------------------------------------------------- |
| `update:modelValue` | `string`                                              | 输入、清除、自动补全时发出；输入变化不自动选择。                                |
| `select`            | `BingAutocompleteOption`                              | 鼠标点击或 Enter 选择；由业务处理后续动作。                               |
| `option-action`     | `(option: BingAutocompleteOption, event: MouseEvent)` | 独立按钮激活时同步发出，支持用户事件内 window.open；不触发 select、不补全文字、不自动关闭。 |
| `open / close`      | `-`                                                   | 候选面板打开或关闭时发出。                                           |
| `clear`             | `-`                                                   | 用户点击清除按钮。                                               |

## Slots

| 插槽                | 参数                                   | 说明                                                                         |
| ----------------- | ------------------------------------ | -------------------------------------------------------------------------- |
| `icon`            | `-`                                  | 输入图标。                                                                      |
| `option`          | `{ option; active: boolean }`        | 候选内容，不放嵌套交互控件；完整 label 始终作为可访问名称。                                          |
| `option-action`   | `{ option; active: boolean }`        | 行尾按钮的非交互内容，例如图标；需设置 optionActionLabel，不在插槽中嵌套按钮或链接。默认显示 optionActionLabel。 |
| `option-detail`   | `{ option: BingAutocompleteOption }` | 高亮项的只读详情；宽屏在旁边，空间不足时在候选下方。                                                 |
| `header / footer` | `-`                                  | 面板说明、统计、更多结果等操作。                                                           |
| `empty / loading` | `-`                                  | 空结果或加载提示。                                                                  |
| `error`           | `{ error: string }`                  | 加载失败提示及重试。                                                                 |

## Expose

| 成员        | 类型                         | 说明                                               |
| --------- | -------------------------- | ------------------------------------------------ |
| `focus()` | `() => void`               | 聚焦输入并在允许时打开候选；openOnEmpty=false 且输入为空时仅聚焦。挂载后调用。 |
| `close()` | `() => void`               | 关闭面板，保留模型，不改变外部编辑器选区。                            |
| `input`   | `HTMLInputElement \| null` | 原生输入框。                                           |

## 公开类型

| 类型                                               | 定义                                                                                                                                                                                                       |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `BingAutocompleteOption`                         | `{ label: string; value: string \| number; disabled?: boolean; description?: string; detail?: string; meta?: Record<string, string \| number \| boolean \| null \| undefined>; [key: string]: unknown }` |
| `BingAutocompleteProps / Emits / Slots / Expose` | `公开组件属性、事件、插槽与实例类型。`                                                                                                                                                                                     |
