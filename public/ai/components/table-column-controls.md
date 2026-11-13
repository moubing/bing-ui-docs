# BingTableColumnControls

> 目标组件包：@moubing/bing-ui 0.19.0；文档修订：r3。
> 已验证：已完成 0.19.0 的文档与示例验证。

此文件由正文、API 数据和完整示例自动生成，可直接阅读，不需要启动文档站。修改源文件后运行 pnpm docs:export table-column-controls；请勿手工修改生成结果。

运行示例需要已配置 Vue 3 单文件组件的项目，依赖 Vue 3.5 与 GSAP 3.15 系列，导入 zod 的示例另需安装 Zod 4（Bing UI 的可选 peer 依赖）；Bing UI 使用上方标注的版本。示例已导入组件和样式，不依赖 Nuxt 别名、文档站组件或组件自动注册。一个 Vue 代码块是独立示例，分别保存为一个 .vue 文件使用。TypeScript 项目需配置 CSS 导入类型声明，例如 Vite 项目的 vite/client。

示例使用单份列模型，初始第一个分组未挂载。列宽从表头调整，面板重置也会恢复列宽；组件不保存偏好。

独立的列设置入口，与 BingTable 内部面板共用列顺序、显隐、固定与重置规则。适合多个分组共用一份列偏好；组件不依赖表格实例，也不保存到浏览器或服务器。

## 分组共享列设置

为面板和每个表格绑定同一份 columnWidths、columnOrder、hiddenColumnKeys、columnFixed，并关闭表格的 showColumnControls。列宽仍从表头拖动调整，面板的重置会同时恢复列宽；面板没有额外的列宽输入框。

首个分组初始折叠，仍可调整第二个分组；全部折叠后也可操作。固定列按左、普通、右三个区域排列，未知顺序键会被忽略，新增列补到所属区域。显隐操作至少保留一列；外部模型仍可主动隐藏全部列。受控模型需要接收对应 update 事件。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingTable, BingTableColumnControls } from '@moubing/bing-ui'
import type { BingTableFixed } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const columns = [{ key: 'title', title: '标题', width: 280, ellipsis: false },
  { key: 'owner', title: '负责人', width: 160 }, { key: 'priority', title: '优先级', width: 120 }]
const firstOpen = ref(false)
const secondOpen = ref(true)
const order = ref<string[]>([])
const hidden = ref<string[]>([])
const fixed = ref<Record<string, BingTableFixed | null>>({})
const widths = ref<Record<string, number>>({})
const groups = [
  [{ id: 1, title: '工作台布局', owner: '林晓', priority: '高' }],
  [{ id: 2, title: '独立保存文档标题和属性', owner: '周宁', priority: '中' }],
]
</script>

<template>
  <div style="display: grid; gap: 16px; min-width: 0;">
    <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 8px;">
      <BingTableColumnControls :columns="columns" ariaLabel="所有分组的列设置"
        v-model:column-order="order" v-model:hidden-column-keys="hidden"
        v-model:column-widths="widths" v-model:column-fixed="fixed" />
      <BingButton size="sm" variant="ghost" :throttle="false" @click="firstOpen = !firstOpen">{{ firstOpen ? '收起' : '展开' }}待处理</BingButton>
      <BingButton size="sm" variant="ghost" :throttle="false" @click="secondOpen = !secondOpen">{{ secondOpen ? '收起' : '展开' }}进行中</BingButton>
    </div>
    <BingTable v-if="firstOpen" :columns="columns" :data="groups[0]" :show-column-controls="false"
      v-model:column-order="order" v-model:hidden-column-keys="hidden"
      v-model:column-widths="widths" v-model:column-fixed="fixed" ariaLabel="待处理文档" />
    <BingTable v-if="secondOpen" :columns="columns" :data="groups[1]" :show-column-controls="false"
      v-model:column-order="order" v-model:hidden-column-keys="hidden"
      v-model:column-widths="widths" v-model:column-fixed="fixed" ariaLabel="进行中文档" />
    <p>折叠全部分组后仍可设置列；重新展开时使用同一份列模型。</p>
  </div>
</template>
```

## Props

| 属性                        | 类型                                       | 默认值              | 说明                                                                      |
| ------------------------- | ---------------------------------------- | ---------------- | ----------------------------------------------------------------------- |
| `columns`                 | `BingTableColumn[]`                      | `[]`             | 列定义，决定标题、宽度、固定列、排序、单元格字段和列级样式。                                          |
| `smoothScroll`            | `SmoothScrollValue`                      | `true`           | 为主视口的纵向、横向滚动和列设置列表启用平滑滚动；设为 false 可关闭。直接拖动滚动轨道或开始相关交互时会停止当前动画。          |
| `columnWidths`            | `Record<string, number>`                 | `undefined`      | 受控列宽；缺少某个键时回退内部默认宽度或列定义。                                                |
| `defaultColumnWidths`     | `Record<string, number>`                 | `{}`             | 初始宽度覆盖，也是 resetColumns 的基线。                                             |
| `columnOrder`             | `string[]`                               | `undefined`      | 受控列顺序，去重、去无效键、补遗漏键，再按左固定/普通/右固定分组显示。                                    |
| `defaultColumnOrder`      | `string[]`                               | `[]`             | 初始顺序；空数组按 columns 顺序，也是重置基线。                                            |
| `hiddenColumnKeys`        | `string[]`                               | `undefined`      | 受控隐藏键，传空数组会覆盖列定义 hidden 的初始隐藏效果。                                        |
| `defaultHiddenColumnKeys` | `string[]`                               | `[]`             | 与 columns 中 hidden=true 的列合并为初始及重置基线。                                   |
| `columnFixed`             | `Record<string, BingTableFixed \| null>` | `undefined`      | 受控固定覆盖；显式 null 取消列 fixed，遗漏键回退默认或列定义。                                   |
| `defaultColumnFixed`      | `Record<string, BingTableFixed \| null>` | `{}`             | 初始固定覆盖及重置基线。                                                            |
| `reorderableColumns`      | `boolean`                                | `true`           | 是否允许拖动表头或列面板调整列顺序；不控制列内容排序、表头说明或列宽调整。自 0.9.1 起关闭时保留普通表头语义，不会将整个表头标记为禁用。 |
| `open`                    | `boolean`                                | `undefined`      | 受控展开状态；绑定 v-model:open。                                                 |
| `defaultOpen`             | `boolean`                                | `false`          | 非受控初始展开状态。                                                              |
| `disabled`                | `boolean`                                | `false`          | 禁用触发器、排序、显隐、固定与重置，变为 true 时请求关闭面板。                                      |
| `placement`               | `BingDropDownPlacement`                  | `'bottom-start'` | 面板方向；表格内部入口使用 top-start。                                                |
| `ariaLabel`               | `string`                                 | `'列设置'`          | 入口、面板与分组的可访问名称。                                                         |

## Events

| 事件                         | 载荷                                                      | 说明                                     |
| -------------------------- | ------------------------------------------------------- | -------------------------------------- |
| `update:columnWidths`      | `[widths: Record<string, number>]`                      | 列宽每次更新，以及 resetColumns 时发送。            |
| `update:columnOrder`       | `[order: string[]]`                                     | 列重排、固定分组变化或重置时发送。                      |
| `column-reorder`           | `[payload: BingTableColumnReorderPayload]`              | 拖拽或列面板键盘重排，from/to 包含隐藏列位置；结果按固定分组归一化。 |
| `update:hiddenColumnKeys`  | `[keys: string[]]`                                      | 显示隐藏或重置时发送。                            |
| `column-visibility-change` | `[payload: BingTableColumnVisibilityPayload]`           | 可见性变化；面板不允许隐藏最后一列，外部受控赋值仍可隐藏全部。        |
| `update:columnFixed`       | `[columnFixed: Record<string, BingTableFixed \| null>]` | 固定覆盖更新或重置时发送。                          |
| `column-fixed-change`      | `[payload: BingTableColumnFixedPayload]`                | 先更新固定状态，必要时更新列顺序，然后发送此事件。              |
| `update:open`              | `boolean`                                               | 请求打开或关闭面板。                             |
| `drag-start`               | `BingSortableListDragPayload`                           | 开始指针拖动列顺序。                             |
| `drag-end`                 | `BingSortableListDragPayload`                           | 结束指针拖动；排序结果以 column-reorder 为准。        |

## 实例方法

| 方法               | 类型           | 说明                                           |
| ---------------- | ------------ | -------------------------------------------- |
| `resetColumns()` | `() => void` | 恢复四组 default 列模型，发送四个 update 事件，不发送三种单项变更事件。 |

## 类型与边界

| 类型                                                                                               | 说明                                                            |
| ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------- |
| `BingTableColumnControlsProps / BingTableColumnControlsEmits / BingTableColumnControlsExpose`    | 属性、事件与实例方法类型，从 @moubing/bing-ui 导入。                           |
| `BingTableColumn / BingTableFixed`                                                               | 与 BingTable 相同的列结构和固定方向。                                      |
| `BingTableColumnReorderPayload / BingTableColumnVisibilityPayload / BingTableColumnFixedPayload` | 对应顺序、显隐、固定事件的载荷，与 BingTable 一致。                               |
| `BingSortableListDragPayload`                                                                    | 包含 key、item、index、order、event；只有指针拖动发送 drag-start / drag-end。 |
| `BingDropDownPlacement`                                                                          | 沿用 BingDropDown 的公开位置类型。                                      |

列结构与事件载荷详见 [BingTable](/docs/components/table)。默认无自定义插槽。面板的排序手柄支持方向键，固定按钮和复选框支持键盘。下拉浮层的位置、Escape 与焦点恢复沿用 BingDropDown。每个共用配置域应只保留一个有明确名称的入口。
