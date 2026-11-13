# BingSortableList

> 目标组件包：@moubing/bing-ui 0.19.0；文档修订：r3。
> 已验证：已完成 0.19.0 的文档与示例验证。

此文件由正文、API 数据和完整示例自动生成，可直接阅读，不需要启动文档站。修改源文件后运行 pnpm docs:export sortable-list；请勿手工修改生成结果。

运行示例需要已配置 Vue 3 单文件组件的项目，依赖 Vue 3.5 与 GSAP 3.15 系列，导入 zod 的示例另需安装 Zod 4（Bing UI 的可选 peer 依赖）；Bing UI 使用上方标注的版本。示例已导入组件和样式，不依赖 Nuxt 别名、文档站组件或组件自动注册。五个 Vue 代码块是独立示例，分别保存为一个 .vue 文件使用。TypeScript 项目需配置 CSS 导入类型声明，例如 Vite 项目的 vite/client。

options 是演示配置，数据、排序状态、事件和必要样式完整内置。items 不会被重排，保存时读取 order。禁用项仅禁止发起排序，不固定位置；手柄保留可访问语义。

BingSortableList 是可排序列表组件，用于让用户通过拖拽或键盘调整列表、列、步骤和配置项的顺序。它只负责顺序交互，不限制每一项的视觉结构；你可以把 `handleProps` 绑定到专门手柄，也可以绑定到整张卡片。

## 基础排序

传入 `items` 和 `itemKey` 后，通过 `v-model:order` 接收最新顺序。`reorderMode` 可以决定是在释放拖拽后提交，还是在拖拽过程中实时提交。

手柄接收焦点后直接按对应方向键、Home 或 End 排序，不需要先按 Space 进入拖拽。必须把完整 handleProps 绑定到一个真实元素，保留 ref 与键盘处理；不能对这个可聚焦手柄设置 aria-hidden。示例为每项提供明确名称。

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import { BingButton, BingSortableList, BingTag } from '@moubing/bing-ui'
import type { BingSortableListKey, BingSortableListPayload } from '@moubing/bing-ui'
import type { BingSortableListProps } from '@moubing/bing-ui'

type ExampleOptions = Pick<BingSortableListProps<SortableDemoItem>, 'axis' | 'reorderMode' | 'keyboard' | 'flip' | 'disabled' | 'dragThreshold' | 'duration' | 'settleDuration'>
const options: ExampleOptions = {
  "axis": "vertical",
  "reorderMode": "drop",
  "keyboard": true,
  "flip": true,
  "disabled": false,
  "dragThreshold": 4,
  "duration": 0.26,
  "settleDuration": 0.16
}

type SortableDemoItem = {
  id: string
  title: string
  meta: string
  tone: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  locked?: boolean
}

const workflowItems: SortableDemoItem[] = [
  {
    id: 'idea',
    title: '需求收集',
    meta: '输入阶段',
    tone: 'primary',
  },
  {
    id: 'design',
    title: '交互设计',
    meta: '方案确认',
    tone: 'secondary',
  },
  {
    id: 'develop',
    title: '开发实现',
    meta: '组件接入',
    tone: 'success',
  },
  {
    id: 'review',
    title: '验收发布',
    meta: '质量检查',
    tone: 'warning',
  },
]

const basicOrder = ref<BingSortableListKey[]>(workflowItems.map((item) => item.id))

const basicEventLog = ref('等待排序')

const basicOrderText = computed(() => formatOrder(basicOrder.value, workflowItems))

function handleBasicReorder(payload: BingSortableListPayload<SortableDemoItem>) {
  basicEventLog.value = `reorder：${payload.item.title} 从 ${payload.from + 1} 到 ${payload.to + 1}`
}

function resetBasicOrder() {
  basicOrder.value = workflowItems.map((item) => item.id)
  basicEventLog.value = '已重置顺序'
}

function reverseBasicOrder() {
  basicOrder.value = [...basicOrder.value].reverse()
  basicEventLog.value = '已反转顺序'
}

function formatOrder(order: BingSortableListKey[], items: SortableDemoItem[]) {
  const labelMap = new Map(items.map((item) => [item.id, item.title]))
  return order.map((key) => labelMap.get(String(key)) || key).join(' / ')
}
</script>

<template>
  <div class="sortable-example">
    <BingSortableList
      v-model:order="basicOrder"
      :items="workflowItems"
      :item-key="(item) => item.id"
      :axis="options.axis"
      :reorder-mode="options.reorderMode"
      :keyboard="options.keyboard"
      :flip="options.flip"
      :disabled="options.disabled"
      :drag-threshold="options.dragThreshold"
      :duration="options.duration"
      :settle-duration="options.settleDuration"
      ariaLabel="文档流程排序"
      :handleAriaLabel="(item) => `移动 ${item.title}`"
      @reorder="handleBasicReorder"
    >
      <template #default="{ item, handleProps, dragging, disabled }">
        <div class="sortable-card" :class="{ 'is-dragging': dragging, 'is-disabled': disabled }">
          <span v-bind="handleProps" class="sortable-handle">
            <span></span>
            <span></span>
            <span></span>
          </span>
          <span class="sortable-card__content">
            <strong>{{ item.title }}</strong>
            <small>{{ item.meta }}</small>
          </span>
          <BingTag size="sm" variant="soft" :tone="item.tone">{{ item.id }}</BingTag>
        </div>
      </template>
    </BingSortableList>
    <p class="sortable-feedback">
      <span>当前顺序： {{ basicOrderText }}</span>
      <span>{{ basicEventLog }}</span>
    </p>
    <div class="sortable-action-row">
      <BingButton size="sm" variant="secondary" @click="resetBasicOrder">重置</BingButton>
      <BingButton size="sm" variant="ghost" @click="reverseBasicOrder">反转</BingButton>
    </div>
  </div>
</template>

<style scoped>
.sortable-example { padding: 16px; display: grid; gap: 16px; max-width: 760px; }
.sortable-demo-stage {
  align-items: stretch;
  gap: 1rem;
}

.sortable-card {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 0.78rem;
  align-items: center;
  border: 1px solid var(--bing-border);
  border-radius: 8px;
  background: var(--bing-surface-solid);
  box-shadow: var(--bing-shadow-sm);
  padding: 0.72rem 0.8rem;
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    opacity 0.18s ease;
}

.sortable-card.is-dragging {
  border-color: rgb(var(--bing-accent-rgb) / 0.38);
  box-shadow: var(--bing-popover-shadow);
}

.sortable-card.is-disabled {
  opacity: 0.58;
}

.sortable-card--soft {
  background:
    var(--bing-surface-solid);
}

.sortable-card--compact {
  grid-template-columns: auto minmax(0, 1fr) auto;
  padding: 0.62rem 0.75rem;
}

.sortable-card__content {
  display: grid;
  min-width: 0;
  gap: 0.2rem;
}

.sortable-card strong,
.sortable-card__content strong {
  overflow: hidden;
  color: var(--bing-text, #334155);
  font-weight: 400;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sortable-card small,
.sortable-card__content small {
  overflow: hidden;
  color: var(--bing-text-muted, #64748b);
  font-size: 0.82rem;
  font-weight: 400;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sortable-handle {
  display: grid;
  width: 28px;
  height: 32px;
  place-items: center;
  border: 1px solid var(--bing-border);
  border-radius: 7px;
  background: var(--bing-surface-soft);
  color: var(--bing-text-muted, #64748b);
}

.sortable-handle span {
  display: block;
  width: 12px;
  height: 2px;
  border-radius: 999px;
  background: currentColor;
}

.sortable-handle span + span {
  margin-top: 3px;
}

.sortable-action-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.sortable-feedback {
  display: grid;
  gap: 0.45rem;
  margin: 0;
  color: var(--bing-text-muted, #64748b);
  font-size: 0.9rem;
  line-height: 1.55;
}

.sortable-feedback span {
  border: 1px solid var(--bing-border);
  border-radius: 6px;
  background: var(--bing-surface-soft);
  padding: 0.35rem 0.55rem;
}

.sortable-pill-list {
  --bing-sortable-gap: 10px;
}

.sortable-pill {
  display: inline-grid;
  min-width: 96px;
  min-height: 38px;
  place-items: center;
  border: 1px solid var(--bing-border);
  border-radius: 999px;
  background: var(--bing-surface-solid);
  box-shadow: var(--bing-shadow-sm);
  color: var(--bing-text, #334155);
  font-size: 0.9rem;
  font-weight: 400;
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease;
}

.sortable-pill.is-dragging {
  border-color: rgb(var(--bing-accent-rgb) / 0.42);
  box-shadow: 0 16px 34px rgba(15, 23, 42, 0.13);
}


</style>
```

## 禁用项和拖拽手柄

单项禁用可以用 `itemDisabled` 从数据中读取，也可以用 `disabledKeys` 按 key 指定。如果希望整张卡片都能拖拽，把 `handleProps` 绑定到卡片根元素即可。

这里的锁定表示不能主动拖动或按键排序，并不保证固定在第一个位置。其他项移动到它前面、或外部重写 order，都可以改变它的位置。若业务要求固定索引，应在业务层校验最终顺序。整卡作为手柄时，不要在内部嵌套按钮或输入控件。

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import { BingSortableList, BingTag } from '@moubing/bing-ui'
import type { BingSortableListKey, BingSortableListPayload } from '@moubing/bing-ui'

type ExampleOptions = { lockByField: boolean; wholeCardHandle: boolean }
const options: ExampleOptions = {
  "lockByField": true,
  "wholeCardHandle": false
}

type SortableDemoItem = {
  id: string
  title: string
  meta: string
  tone: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  locked?: boolean
}

const laneItems: SortableDemoItem[] = [
  {
    id: 'summary',
    title: '摘要',
    meta: '禁止发起排序',
    tone: 'primary',
    locked: true,
  },
  {
    id: 'demo',
    title: '示例',
    meta: '可拖动',
    tone: 'success',
  },
  {
    id: 'api',
    title: 'API',
    meta: '可拖动',
    tone: 'secondary',
  },
  {
    id: 'notes',
    title: '备注',
    meta: '可拖动',
    tone: 'warning',
  },
]

const lockedOrder = ref<BingSortableListKey[]>(laneItems.map((item) => item.id))

const disabledItemResolver = computed(() =>
  options.lockByField ? (item: SortableDemoItem) => Boolean(item.locked) : undefined,
)

const disabledKeys = computed(() => (options.lockByField ? [] : ['summary']))

const lockedEventLog = ref('摘要禁止发起排序，其余项可调整')

const lockedOrderText = computed(() => formatOrder(lockedOrder.value, laneItems))

function handleLockedReorder(payload: BingSortableListPayload<SortableDemoItem>) {
  lockedEventLog.value = `reorder：${payload.item.title} 已移动`
}

function formatOrder(order: BingSortableListKey[], items: SortableDemoItem[]) {
  const labelMap = new Map(items.map((item) => [item.id, item.title]))
  return order.map((key) => labelMap.get(String(key)) || key).join(' / ')
}
</script>

<template>
  <div class="sortable-example">
    <BingSortableList
      v-model:order="lockedOrder"
      :items="laneItems"
      :item-key="(item) => item.id"
      :item-disabled="disabledItemResolver"
      :disabled-keys="disabledKeys"
      ariaLabel="文档区块排序"
      :handleAriaLabel="(item) => `移动 ${item.title}`"
      @reorder="handleLockedReorder"
    >
      <template #default="{ item, handleProps, dragging, disabled }">
        <div
          v-bind="options.wholeCardHandle ? handleProps : {}"
          class="sortable-card sortable-card--soft"
          :class="{ 'is-dragging': dragging, 'is-disabled': disabled }"
        >
          <span v-if="!options.wholeCardHandle" v-bind="handleProps" class="sortable-handle">
            <span></span>
            <span></span>
            <span></span>
          </span>
          <span class="sortable-card__content">
            <strong>{{ item.title }}</strong>
            <small>{{ item.meta }}</small>
          </span>
          <BingTag size="sm" variant="soft" :tone="disabled ? 'danger' : item.tone">
            {{ disabled ? 'locked' : item.id }}
          </BingTag>
        </div>
      </template>
    </BingSortableList>
    <p class="sortable-feedback">
      <span>当前顺序： {{ lockedOrderText }}</span>
      <span>{{ lockedEventLog }}</span>
    </p>
  </div>
</template>

<style scoped>
.sortable-example { padding: 16px; display: grid; gap: 16px; max-width: 760px; }
.sortable-demo-stage {
  align-items: stretch;
  gap: 1rem;
}

.sortable-card {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 0.78rem;
  align-items: center;
  border: 1px solid var(--bing-border);
  border-radius: 8px;
  background: var(--bing-surface-solid);
  box-shadow: var(--bing-shadow-sm);
  padding: 0.72rem 0.8rem;
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    opacity 0.18s ease;
}

.sortable-card.is-dragging {
  border-color: rgb(var(--bing-accent-rgb) / 0.38);
  box-shadow: var(--bing-popover-shadow);
}

.sortable-card.is-disabled {
  opacity: 0.58;
}

.sortable-card--soft {
  background:
    var(--bing-surface-solid);
}

.sortable-card--compact {
  grid-template-columns: auto minmax(0, 1fr) auto;
  padding: 0.62rem 0.75rem;
}

.sortable-card__content {
  display: grid;
  min-width: 0;
  gap: 0.2rem;
}

.sortable-card strong,
.sortable-card__content strong {
  overflow: hidden;
  color: var(--bing-text, #334155);
  font-weight: 400;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sortable-card small,
.sortable-card__content small {
  overflow: hidden;
  color: var(--bing-text-muted, #64748b);
  font-size: 0.82rem;
  font-weight: 400;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sortable-handle {
  display: grid;
  width: 28px;
  height: 32px;
  place-items: center;
  border: 1px solid var(--bing-border);
  border-radius: 7px;
  background: var(--bing-surface-soft);
  color: var(--bing-text-muted, #64748b);
}

.sortable-handle span {
  display: block;
  width: 12px;
  height: 2px;
  border-radius: 999px;
  background: currentColor;
}

.sortable-handle span + span {
  margin-top: 3px;
}

.sortable-action-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.sortable-feedback {
  display: grid;
  gap: 0.45rem;
  margin: 0;
  color: var(--bing-text-muted, #64748b);
  font-size: 0.9rem;
  line-height: 1.55;
}

.sortable-feedback span {
  border: 1px solid var(--bing-border);
  border-radius: 6px;
  background: var(--bing-surface-soft);
  padding: 0.35rem 0.55rem;
}

.sortable-pill-list {
  --bing-sortable-gap: 10px;
}

.sortable-pill {
  display: inline-grid;
  min-width: 96px;
  min-height: 38px;
  place-items: center;
  border: 1px solid var(--bing-border);
  border-radius: 999px;
  background: var(--bing-surface-solid);
  box-shadow: var(--bing-shadow-sm);
  color: var(--bing-text, #334155);
  font-size: 0.9rem;
  font-weight: 400;
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease;
}

.sortable-pill.is-dragging {
  border-color: rgb(var(--bing-accent-rgb) / 0.42);
  box-shadow: 0 16px 34px rgba(15, 23, 42, 0.13);
}


</style>
```

## 横向排序

设置 `axis="horizontal"` 后，列表会按横向排列，并使用左右方向键排序。这个模式适合表格列、筛选标签、看板泳道这类横向配置。

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import { BingSortableList } from '@moubing/bing-ui'
import type { BingSortableListKey, BingSortableListPayload } from '@moubing/bing-ui'
import type { BingSortableListProps } from '@moubing/bing-ui'

type ExampleOptions = Pick<BingSortableListProps<SortableDemoItem>, 'keyboard' | 'flip'>
const options: ExampleOptions = {
  "keyboard": true,
  "flip": true
}

type SortableDemoItem = {
  id: string
  title: string
  meta: string
  tone: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  locked?: boolean
}

const columnItems: SortableDemoItem[] = [
  { id: 'project', title: '项目', meta: '主列', tone: 'primary' },
  { id: 'owner', title: '负责人', meta: '协作', tone: 'secondary' },
  { id: 'status', title: '状态', meta: '流程', tone: 'success' },
  { id: 'progress', title: '进度', meta: '数值', tone: 'warning' },
  { id: 'risk', title: '风险', meta: '信号', tone: 'danger' },
]

const horizontalOrder = ref<BingSortableListKey[]>(columnItems.map((item) => item.id))

const horizontalEventLog = ref('尝试横向拖动列名')

const horizontalOrderText = computed(() => formatOrder(horizontalOrder.value, columnItems))

function handleHorizontalReorder(payload: BingSortableListPayload<SortableDemoItem>) {
  horizontalEventLog.value = `reorder：${payload.item.title} 到第 ${payload.to + 1} 列`
}

function formatOrder(order: BingSortableListKey[], items: SortableDemoItem[]) {
  const labelMap = new Map(items.map((item) => [item.id, item.title]))
  return order.map((key) => labelMap.get(String(key)) || key).join(' / ')
}
</script>

<template>
  <div class="sortable-example">
    <BingSortableList
      v-model:order="horizontalOrder"
      class="sortable-pill-list"
      :items="columnItems"
      :item-key="(item) => item.id"
      axis="horizontal"
      :keyboard="options.keyboard"
      :flip="options.flip"
      ariaLabel="表格列排序"
      :handleAriaLabel="(item) => `移动 ${item.title}`"
      @reorder="handleHorizontalReorder"
    >
      <template #default="{ item, handleProps, dragging }">
        <span v-bind="handleProps" class="sortable-pill" :class="{ 'is-dragging': dragging }">{{ item.title }}</span>
      </template>
    </BingSortableList>
    <p class="sortable-feedback">
      <span>当前顺序： {{ horizontalOrderText }}</span>
      <span>{{ horizontalEventLog }}</span>
    </p>
  </div>
</template>

<style scoped>
.sortable-example { padding: 16px; display: grid; gap: 16px; max-width: 760px; }
.sortable-demo-stage {
  align-items: stretch;
  gap: 1rem;
}

.sortable-card {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 0.78rem;
  align-items: center;
  border: 1px solid var(--bing-border);
  border-radius: 8px;
  background: var(--bing-surface-solid);
  box-shadow: var(--bing-shadow-sm);
  padding: 0.72rem 0.8rem;
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    opacity 0.18s ease;
}

.sortable-card.is-dragging {
  border-color: rgb(var(--bing-accent-rgb) / 0.38);
  box-shadow: var(--bing-popover-shadow);
}

.sortable-card.is-disabled {
  opacity: 0.58;
}

.sortable-card--soft {
  background:
    var(--bing-surface-solid);
}

.sortable-card--compact {
  grid-template-columns: auto minmax(0, 1fr) auto;
  padding: 0.62rem 0.75rem;
}

.sortable-card__content {
  display: grid;
  min-width: 0;
  gap: 0.2rem;
}

.sortable-card strong,
.sortable-card__content strong {
  overflow: hidden;
  color: var(--bing-text, #334155);
  font-weight: 400;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sortable-card small,
.sortable-card__content small {
  overflow: hidden;
  color: var(--bing-text-muted, #64748b);
  font-size: 0.82rem;
  font-weight: 400;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sortable-handle {
  display: grid;
  width: 28px;
  height: 32px;
  place-items: center;
  border: 1px solid var(--bing-border);
  border-radius: 7px;
  background: var(--bing-surface-soft);
  color: var(--bing-text-muted, #64748b);
}

.sortable-handle span {
  display: block;
  width: 12px;
  height: 2px;
  border-radius: 999px;
  background: currentColor;
}

.sortable-handle span + span {
  margin-top: 3px;
}

.sortable-action-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.sortable-feedback {
  display: grid;
  gap: 0.45rem;
  margin: 0;
  color: var(--bing-text-muted, #64748b);
  font-size: 0.9rem;
  line-height: 1.55;
}

.sortable-feedback span {
  border: 1px solid var(--bing-border);
  border-radius: 6px;
  background: var(--bing-surface-soft);
  padding: 0.35rem 0.55rem;
}

.sortable-pill-list {
  --bing-sortable-gap: 10px;
}

.sortable-pill {
  display: inline-grid;
  min-width: 96px;
  min-height: 38px;
  place-items: center;
  border: 1px solid var(--bing-border);
  border-radius: 999px;
  background: var(--bing-surface-solid);
  box-shadow: var(--bing-shadow-sm);
  color: var(--bing-text, #334155);
  font-size: 0.9rem;
  font-weight: 400;
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease;
}

.sortable-pill.is-dragging {
  border-color: rgb(var(--bing-accent-rgb) / 0.42);
  box-shadow: 0 16px 34px rgba(15, 23, 42, 0.13);
}


</style>
```

## 受控顺序

`order` 是组件和业务状态之间的边界。外部可以直接改写它，组件会对顺序做归一化：无效 key 会被移除，缺失 key 会按 `items` 原始顺序补回。

归一化还会去重；这些修正只用于有效渲染顺序，不主动发送 update:order。外部 order 不被组件修改。默认 id 字段缺失会回退索引，动态增删时不可靠；建议稳定、同一类型且字符串表示也不冲突的键。

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import { BingButton, BingSortableList } from '@moubing/bing-ui'
import type { BingSortableListKey, BingSortableListPayload } from '@moubing/bing-ui'

type SortableDemoItem = {
  id: string
  title: string
  meta: string
  tone: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  locked?: boolean
}

const columnItems: SortableDemoItem[] = [
  { id: 'project', title: '项目', meta: '主列', tone: 'primary' },
  { id: 'owner', title: '负责人', meta: '协作', tone: 'secondary' },
  { id: 'status', title: '状态', meta: '流程', tone: 'success' },
  { id: 'progress', title: '进度', meta: '数值', tone: 'warning' },
  { id: 'risk', title: '风险', meta: '信号', tone: 'danger' },
]

const controlledOrder = ref<BingSortableListKey[]>(['owner', 'project', 'status', 'progress', 'risk'])

const controlledEventLog = ref('外部按钮会直接改写 order')

const controlledOrderText = computed(() => formatOrder(controlledOrder.value, columnItems))

function handleControlledReorder(payload: BingSortableListPayload<SortableDemoItem>) {
  controlledEventLog.value = `reorder：${payload.item.title} 到第 ${payload.to + 1} 位`
}

function moveRiskFirst() {
  controlledOrder.value = ['risk', 'owner', 'project', 'status', 'progress']
  controlledEventLog.value = '风险列已置顶'
}

function resetControlledOrder() {
  controlledOrder.value = ['owner', 'project', 'status', 'progress', 'risk']
  controlledEventLog.value = '已恢复默认列顺序'
}

function formatOrder(order: BingSortableListKey[], items: SortableDemoItem[]) {
  const labelMap = new Map(items.map((item) => [item.id, item.title]))
  return order.map((key) => labelMap.get(String(key)) || key).join(' / ')
}
</script>

<template>
  <div class="sortable-example">
    <BingSortableList
      v-model:order="controlledOrder"
      :items="columnItems"
      :item-key="(item) => item.id"
      ariaLabel="受控列排序"
      :handleAriaLabel="(item) => `移动 ${item.title}`"
      @reorder="handleControlledReorder"
    >
      <template #default="{ item, handleProps, dragging }">
        <div class="sortable-card sortable-card--compact" :class="{ 'is-dragging': dragging }">
          <span v-bind="handleProps" class="sortable-handle">
            <span></span>
            <span></span>
            <span></span>
          </span>
          <strong>{{ item.title }}</strong>
          <small>{{ item.meta }}</small>
        </div>
      </template>
    </BingSortableList>
    <p class="sortable-feedback">
      <span>当前顺序： {{ controlledOrderText }}</span>
      <span>{{ controlledEventLog }}</span>
    </p>
    <div class="sortable-action-row">
      <BingButton size="sm" variant="secondary" @click="moveRiskFirst">风险列置顶</BingButton>
      <BingButton size="sm" variant="ghost" @click="resetControlledOrder">恢复默认</BingButton>
    </div>
  </div>
</template>

<style scoped>
.sortable-example { padding: 16px; display: grid; gap: 16px; max-width: 760px; }
.sortable-demo-stage {
  align-items: stretch;
  gap: 1rem;
}

.sortable-card {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 0.78rem;
  align-items: center;
  border: 1px solid var(--bing-border);
  border-radius: 8px;
  background: var(--bing-surface-solid);
  box-shadow: var(--bing-shadow-sm);
  padding: 0.72rem 0.8rem;
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    opacity 0.18s ease;
}

.sortable-card.is-dragging {
  border-color: rgb(var(--bing-accent-rgb) / 0.38);
  box-shadow: var(--bing-popover-shadow);
}

.sortable-card.is-disabled {
  opacity: 0.58;
}

.sortable-card--soft {
  background:
    var(--bing-surface-solid);
}

.sortable-card--compact {
  grid-template-columns: auto minmax(0, 1fr) auto;
  padding: 0.62rem 0.75rem;
}

.sortable-card__content {
  display: grid;
  min-width: 0;
  gap: 0.2rem;
}

.sortable-card strong,
.sortable-card__content strong {
  overflow: hidden;
  color: var(--bing-text, #334155);
  font-weight: 400;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sortable-card small,
.sortable-card__content small {
  overflow: hidden;
  color: var(--bing-text-muted, #64748b);
  font-size: 0.82rem;
  font-weight: 400;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sortable-handle {
  display: grid;
  width: 28px;
  height: 32px;
  place-items: center;
  border: 1px solid var(--bing-border);
  border-radius: 7px;
  background: var(--bing-surface-soft);
  color: var(--bing-text-muted, #64748b);
}

.sortable-handle span {
  display: block;
  width: 12px;
  height: 2px;
  border-radius: 999px;
  background: currentColor;
}

.sortable-handle span + span {
  margin-top: 3px;
}

.sortable-action-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.sortable-feedback {
  display: grid;
  gap: 0.45rem;
  margin: 0;
  color: var(--bing-text-muted, #64748b);
  font-size: 0.9rem;
  line-height: 1.55;
}

.sortable-feedback span {
  border: 1px solid var(--bing-border);
  border-radius: 6px;
  background: var(--bing-surface-soft);
  padding: 0.35rem 0.55rem;
}

.sortable-pill-list {
  --bing-sortable-gap: 10px;
}

.sortable-pill {
  display: inline-grid;
  min-width: 96px;
  min-height: 38px;
  place-items: center;
  border: 1px solid var(--bing-border);
  border-radius: 999px;
  background: var(--bing-surface-solid);
  box-shadow: var(--bing-shadow-sm);
  color: var(--bing-text, #334155);
  font-size: 0.9rem;
  font-weight: 400;
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease;
}

.sortable-pill.is-dragging {
  border-color: rgb(var(--bing-accent-rgb) / 0.42);
  box-shadow: 0 16px 34px rgba(15, 23, 42, 0.13);
}


</style>
```

## 拖拽浮层

`dragOverlay` 默认关闭。开启后，组件以独立浮层呈现正在拖动的内容，并复用默认插槽；原列表继续保留项目布局。下方可以切换两种反馈方式，释放指针后再提交顺序。

浮层带有 `aria-hidden` 和 `inert`，不参与交互或键盘焦点；浮层插槽中的 active/dragging 为 true，handleProps 的 tabindex 为 -1、aria-disabled 为 true，ref 与按键处理为空操作。仍应完整绑定 handleProps，不要自行把浮层手柄恢复为可交互状态。

默认插槽会同时用于原项目和浮层，避免硬编码 DOM ID，也不要在插槽子组件挂载时提交业务操作。浮层只负责视觉反馈，保存与更新始终通过原列表的 order 和事件完成。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingCheckbox, BingSortableList, type BingSortableListKey } from '@moubing/bing-ui'

const dragOverlay = ref(true)
const items = [
  { id: 'draft', title: '整理草稿', description: '保留完整的项目名称与说明' },
  { id: 'review', title: '内容复核', description: '拖动手柄调整优先级' },
  { id: 'publish', title: '发布文档', description: '释放后提交新的顺序' },
]
const order = ref<BingSortableListKey[]>(items.map(item => item.id))
</script>

<template>
  <div class="overlay-example">
    <BingCheckbox v-model="dragOverlay" label="使用拖拽浮层" />
    <BingSortableList v-model:order="order" :items="items" :dragOverlay="dragOverlay"
      :handleAriaLabel="item => `移动 ${item.title}`">
      <template #default="{ item, handleProps, dragging }">
        <div class="overlay-card" :class="{ 'is-dragging': dragging }">
          <button v-bind="handleProps" type="button" class="overlay-handle">↕</button>
          <div class="overlay-content"><strong>{{ item.title }}</strong><span>{{ item.description }}</span></div>
        </div>
      </template>
    </BingSortableList>
    <p role="status">当前顺序：{{ order.join(' / ') }}</p>
  </div>
</template>

<style scoped>
.overlay-example { display: grid; gap: 16px; width: 100%; max-width: 520px; }
.overlay-card { display: flex; align-items: center; gap: 12px; padding: 12px; border: 1px solid var(--bing-border); border-radius: 6px; background: var(--bing-surface-solid); }
.overlay-card.is-dragging { border-color: var(--bing-accent); }
.overlay-handle { flex: 0 0 32px; height: 36px; border: 1px solid var(--bing-border); border-radius: 4px; color: var(--bing-text); background: var(--bing-surface-soft); cursor: grab; touch-action: none; }
.overlay-handle:focus-visible { outline: 2px solid var(--bing-focus); outline-offset: 2px; }
.overlay-content { display: grid; gap: 4px; min-width: 0; }
.overlay-content strong { font-weight: 400; color: var(--bing-text); }
.overlay-content span, p { color: var(--bing-text-muted); font-size: 13px; line-height: 1.5; overflow-wrap: anywhere; }
p { margin: 0; }
</style>
```

## Props

| 属性                | 类型                                  | 默认值          | 说明                                                                                              |
| ----------------- | ----------------------------------- | ------------ | ----------------------------------------------------------------------------------------------- |
| `items`           | `T[]`                               | `[]`         | 需要排序的数据源。组件不会修改 items，只通过 order 表示当前顺序。                                                         |
| `order`           | `BingSortableListKey[]`             | `undefined`  | 受控键顺序，使用 v-model:order 及时同步。归一化只影响显示，不会主动修正外部 order。未传时维护本地顺序。                                  |
| `itemKey`         | `BingSortableListItemKey<T>`        | `'id'`       | keyof T 或 (item, sourceIndex) =\> string \| number。默认读取 id，无效字段回退源索引；动态数据请提供稳定唯一 key，示例使用函数解析器。 |
| `itemDisabled`    | `BingSortableListItemDisabled<T>`   | `undefined`  | 读取字段或调用 (item, sourceIndex)；与 disabledKeys 合并。仅禁止该项发起排序，不固定它的索引。                                |
| `disabledKeys`    | `Array<string \| number>`           | `[]`         | 用严格 key 比较禁用操作源；其他项或外部 order 仍可使禁用项移位。                                                          |
| `axis`            | `'vertical' \| 'horizontal'`        | `'vertical'` | 控制布局和对应方向键；不会把指针轨迹锁定为单一轴。                                                                       |
| `disabled`        | `boolean`                           | `false`      | 禁用整个列表。                                                                                         |
| `keyboard`        | `boolean`                           | `true`       | 是否允许通过方向键、Home、End 调整顺序。                                                                        |
| `flip`            | `boolean`                           | `true`       | 控制排序过渡与外部 order 的 FLIP；不等同于关闭落位动画，后者由 settleDuration 控制。                                        |
| `reorderMode`     | `'drop' \| 'live'`                  | `'drop'`     | drop 在释放拖拽时提交；live 在拖动过程中同步提交。                                                                  |
| `duration`        | `number`                            | `0.26`       | 排序项移动动画时长，单位秒。                                                                                  |
| `settleDuration`  | `number`                            | `0.16`       | 拖拽释放后的落位动画时长，单位秒。                                                                               |
| `dragThreshold`   | `number`                            | `4`          | 指针移动超过该距离后才激活拖拽，单位 px。                                                                          |
| `dragOverlay`     | `boolean`                           | `false`      | 独立拖拽浮层，复用默认插槽；浮层不可交互。                                                                           |
| `ariaLabel`       | `string`                            | `'可排序列表'`    | 列表本身的可访问名称。                                                                                     |
| `handleAriaLabel` | `string \| (item, index) => string` | `'调整顺序'`     | 手柄名称；函数的 index 是当前渲染位置，与 itemKey/itemDisabled 的源索引不同。建议包含项目名称。                                  |

## 插槽与事件

### 默认插槽参数

| 参数            | 类型                            | 说明                  |
| ------------- | ----------------------------- | ------------------- |
| `item`        | `T`                           | 当前渲染的数据项。           |
| `key`         | `string \| number`            | 当前项的唯一 key。         |
| `index`       | `number`                      | 当前项在有效顺序中的位置。       |
| `active`      | `boolean`                     | 当前项是否是正在拖拽的源项。      |
| `dragging`    | `boolean`                     | 当前项是否处于拖拽、落位或拖拽源状态。 |
| `disabled`    | `boolean`                     | 当前项是否被禁用。           |
| `handleProps` | `BingSortableListHandleProps` | 必须绑定到拖拽手柄或整个可拖拽卡片上。 |

### handleProps

| 字段              | 类型                  | 说明                      |
| --------------- | ------------------- | ----------------------- |
| `ref`           | `(element) => void` | 把真实手柄元素交给 dnd-kit。      |
| `role`          | `'button'`          | 让非按钮元素具备按钮语义。           |
| `tabindex`      | `number`            | 可用时为 0，禁用时为 -1。         |
| `aria-label`    | `string`            | 手柄可访问名称。                |
| `aria-disabled` | `'true' \| 'false'` | 手柄禁用状态。                 |
| `onKeydown`     | `(event) => void`   | 处理方向键、Home 和 End 的键盘排序。 |

### 事件

| 事件             | 参数                               | 说明                                                                       |
| -------------- | -------------------------------- | ------------------------------------------------------------------------ |
| `update:order` | `BingSortableListKey[]`          | 有效顺序变化时先发送；外部改值、归一化或边界无移动时不发送。                                           |
| `reorder`      | `BingSortableListPayload<T>`     | 随后发送 \{ key, item, from, to, order, event? \}；索引从 0 开始。键盘每次直接提交，不发送拖拽事件。 |
| `drag-start`   | `BingSortableListDragPayload<T>` | 超过指针激活距离才发送，包含原始 PointerEvent。                                           |
| `drag`         | `BingSortableListDragPayload<T>` | 移动时发送当前投影顺序；drop 模式尚未改变受控 order，live 模式随后按变化提交。                          |
| `drag-end`     | `BingSortableListDragPayload<T>` | 成功结束时发送；drop 模式先更新顺序再发送，取消拖拽不发送。live 已提交的顺序不会自动撤销。                       |

## 类型与交互边界

| 公开类型                              | 定义或用途                                                                                                                                    |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `BingSortableListKey`             | string \| number                                                                                                                         |
| `BingSortableListAxis`            | 'vertical' \| 'horizontal'                                                                                                               |
| `BingSortableListReorderMode`     | 'drop' \| 'live'                                                                                                                         |
| `BingSortableListItemKey<T>`      | keyof T \| ((item: T, index: number) =\> BingSortableListKey)                                                                            |
| `BingSortableListItemDisabled<T>` | keyof T \| ((item: T, index: number) =\> boolean)                                                                                        |
| `BingSortableListProps<T>`        | 上表 16 项属性。                                                                                                                               |
| `BingSortableListPayload<T>`      | \{ key: BingSortableListKey; item: T; from: number; to: number; order: BingSortableListKey\[\]; event?: PointerEvent \| KeyboardEvent \} |
| `BingSortableListDragPayload<T>`  | \{ key: BingSortableListKey; item: T; index: number; order: BingSortableListKey\[\]; event: PointerEvent \}                              |
| `BingSortableListEmits<T>`        | 上表 5 个事件。                                                                                                                                |
| `BingSortableListSlotProps<T>`    | 默认插槽的 item、key、index、active、dragging、disabled、handleProps。                                                                               |
| `BingSortableListHandleProps`     | HTMLAttributes 加 ref 回调、role='button'、tabindex、aria-label、aria-disabled 和 onKeydown。                                                     |

组件和以上泛型类型均从 @moubing/bing-ui 导入；没有实例方法、分组跨列表传输、业务保存或撤销接口。itemKey/itemDisabled 的回调索引来自 items，插槽、手柄标签和事件索引来自当前顺序。

drop 在拖动时只投影位置，释放后才提交；live 可以在一次拖动中多次提交，from 保持本次拖拽起点。取消操作不会发送 drag-end；live 模式已经提交的值不会回滚，业务可在 drag-start 保存快照以实现自己的取消逻辑。

items 数据本身不会重排；业务保存应读取 order 或按它映射原始数据。仅传 order 而不响应更新会让显示继续以外部值为准。

减少动态效果会跳过外部 order 的 FLIP 与落位动画；排序项移动过渡仍由 flip/duration 控制。若需要完全关闭排序与落位过渡，同时设置 flip=false、duration=0、settleDuration=0。本页离开缓存页面时卸载所有预览，清理拖拽管理器和动画。
