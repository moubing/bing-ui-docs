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
