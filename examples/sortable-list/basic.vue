<script setup lang="ts">
import { computed, ref } from 'vue'
import { BingButton, BingSortableList, BingTag } from '@moubing/bing-ui'
import type { BingSortableListKey, BingSortableListPayload } from '@moubing/bing-ui'
import type { BingSortableListProps } from '@moubing/bing-ui'

type ExampleOptions = Pick<BingSortableListProps<SortableDemoItem>, 'axis' | 'reorderMode' | 'keyboard' | 'flip' | 'disabled' | 'dragThreshold' | 'duration' | 'settleDuration'>
// @docs-options:start
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
// @docs-options:end

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
