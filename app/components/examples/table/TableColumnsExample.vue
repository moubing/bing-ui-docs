<script setup lang="ts">
import { BingCheckbox, BingCursor, BingTable, BingTag } from '@moubing/bing-ui'
import DocsExampleCode from '~/components/DocsExampleCode.vue'
import { onActivated, onDeactivated, ref } from 'vue'
import { useExamples } from './state'
const { columns, wideColumns, wideRows, wideDemo, getRiskTone, wideCode } = useExamples()
const examplesActive = ref(true)
onActivated(() => { examplesActive.value = true })
onDeactivated(() => { examplesActive.value = false })
</script>

<template>
  <ClientOnly v-if="examplesActive">
  <div class="doc-example doc-example--stacked">
    <div class="doc-example__preview table-demo-stage">
      <BingCursor>
        <BingTable
          :data="wideRows"
          :columns="wideColumns"
          row-key="id"
          :max-height="360"
          :bordered="wideDemo.bordered"
          :resizable-columns="wideDemo.resizableColumns"
          :reorderable-columns="wideDemo.reorderableColumns"
          :show-column-controls="wideDemo.showColumnControls"
          ariaLabel="宽项目指标表格"
        >
          <template #cell-risk="{ value }">
            <BingTag :tone="getRiskTone(value)" size="sm" variant="soft">
              {{ value }}
            </BingTag>
          </template>
        </BingTable>
      </BingCursor>
    </div>

    <div class="doc-example__controls table-control-grid">
      <BingCheckbox v-model="wideDemo.bordered" label="显示边框" />
      <BingCheckbox v-model="wideDemo.resizableColumns" label="允许调整列宽" />
      <BingCheckbox v-model="wideDemo.reorderableColumns" label="允许拖动列顺序" />
      <BingCheckbox v-model="wideDemo.showColumnControls" label="显示列设置" />
    </div>
  </div>

  </ClientOnly>
  <DocsExampleCode
    :code="wideCode"
    language="vue"
    title="代码示例"
    max-height="420px"
  />
</template>
