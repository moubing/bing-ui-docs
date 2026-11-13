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
