<script setup lang="ts">
import { BingButton, BingSortableList } from '@moubing/bing-ui'
import DocsExampleCode from '~/components/DocsExampleCode.vue'
import { onActivated, onDeactivated, ref } from 'vue'
import { useExamples } from './state'
const { columnItems, controlledOrder, controlledEventLog, controlledOrderText, handleControlledReorder, moveRiskFirst, resetControlledOrder, controlledCode } = useExamples()
const examplesActive = ref(true)
onActivated(() => { examplesActive.value = true })
onDeactivated(() => { examplesActive.value = false })
</script>

<template>
  <ClientOnly v-if="examplesActive">
  <div class="doc-example">
    <div class="doc-example__preview sortable-demo-stage">
      <p class="preview-label">外部控制</p>
        <BingSortableList
          v-model:order="controlledOrder"
          :items="columnItems"
          :item-key="(item) => item.id"
          ariaLabel="受控列排序" :handleAriaLabel="(item) => `移动 ${item.title}`"
          @reorder="handleControlledReorder"
        >
          <template #default="{ item, handleProps, dragging }">
            <div class="sortable-card sortable-card--compact" :class="{ 'is-dragging': dragging }">
              <span v-bind="handleProps" class="sortable-handle" >
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
        <span>当前顺序：{{ controlledOrderText }}</span><span>{{ controlledEventLog }}</span>
      </p>
      <div class="sortable-action-row">
        <BingButton size="sm" variant="secondary" @click="moveRiskFirst">风险列置顶</BingButton>
        <BingButton size="sm" variant="ghost" @click="resetControlledOrder">恢复默认</BingButton>
      </div>
    </div>


  </div>

  </ClientOnly>
  <DocsExampleCode
      :code="controlledCode"
      language="vue"
      title="代码示例"
      max-height="520px"
    />
</template>
