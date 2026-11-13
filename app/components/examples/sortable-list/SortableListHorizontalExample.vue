<script setup lang="ts">
import { BingCheckbox, BingSortableList } from '@moubing/bing-ui'
import DocsExampleCode from '~/components/DocsExampleCode.vue'
import { onActivated, onDeactivated, ref } from 'vue'
import { useExamples } from './state'
const { columnItems, horizontalOrder, horizontalDemo, horizontalEventLog, horizontalOrderText, handleHorizontalReorder, horizontalCode } = useExamples()
const examplesActive = ref(true)
onActivated(() => { examplesActive.value = true })
onDeactivated(() => { examplesActive.value = false })
</script>

<template>
  <ClientOnly v-if="examplesActive">
  <div class="doc-example">
    <div class="doc-example__preview sortable-demo-stage">
      <p class="preview-label">列顺序</p>
        <BingSortableList
          v-model:order="horizontalOrder"
          class="sortable-pill-list"
          :items="columnItems"
          :item-key="(item) => item.id"
          axis="horizontal"
          :keyboard="horizontalDemo.keyboard"
          :flip="horizontalDemo.flip"
          ariaLabel="表格列排序" :handleAriaLabel="(item) => `移动 ${item.title}`"
          @reorder="handleHorizontalReorder"
        >
          <template #default="{ item, handleProps, dragging }">
            <span
              v-bind="handleProps"
              class="sortable-pill"
              :class="{ 'is-dragging': dragging }"
            >
              {{ item.title }}
            </span>
          </template>
        </BingSortableList>
      <p class="sortable-feedback">
        <span>当前顺序：{{ horizontalOrderText }}</span><span>{{ horizontalEventLog }}</span>
      </p>
    </div>

    <div class="doc-example__controls">
      <BingCheckbox v-model="horizontalDemo.keyboard" label="允许左右方向键排序" />
      <BingCheckbox v-model="horizontalDemo.flip" label="外部顺序变化使用动画" />
    </div>
  </div>

  </ClientOnly>
  <DocsExampleCode
    :code="horizontalCode"
    language="vue"
    title="代码示例"
    max-height="440px"
  />
</template>
