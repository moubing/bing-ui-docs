<script setup lang="ts">
import { BingButton, BingTable, BingTag } from '@moubing/bing-ui'
import DocsExampleCode from '~/components/DocsExampleCode.vue'
import { onActivated, onDeactivated, ref } from 'vue'
import { useExamples } from './state'
const { columns, tableData, tableRef, exposeSelectedKeys, exposeExpandedKeys, exposeLog, clearExposeSelection, selectPreviewRow, expandAurora, resetExposeColumns, scrollExposeTable, getStatusTone, exposeCode } = useExamples()
const examplesActive = ref(true)
onActivated(() => { examplesActive.value = true })
onDeactivated(() => { examplesActive.value = false })
</script>

<template>
  <ClientOnly v-if="examplesActive">
  <div class="doc-example">
    <div class="doc-example__preview table-demo-stage">
        <BingTable
          ref="tableRef"
          v-model:selected-row-keys="exposeSelectedKeys"
          v-model:expanded-row-keys="exposeExpandedKeys"
          :data="tableData"
          :columns="columns"
          row-key="id"
          selectable
          :max-height="280"
          ariaLabel="方法示例表格"
        >
          <template #cell-status="{ value }">
            <BingTag :tone="getStatusTone(value)" size="sm" variant="soft">
              {{ value }}
            </BingTag>
          </template>
        </BingTable>
      <div class="table-action-row">
        <BingButton size="sm" variant="secondary" @click="selectPreviewRow">选择 Preview</BingButton>
        <BingButton size="sm" variant="ghost" @click="clearExposeSelection">清空选择</BingButton>
        <BingButton size="sm" variant="secondary" @click="expandAurora">展开 Aurora</BingButton>
        <BingButton size="sm" variant="ghost" @click="resetExposeColumns">重置列</BingButton>
        <BingButton size="sm" variant="ghost" @click="scrollExposeTable">滚动</BingButton>
      </div>
      <p class="table-feedback">
        <span>{{ exposeLog }}</span>
      </p>
    </div>


  </div>

  </ClientOnly>
  <DocsExampleCode
      :code="exposeCode"
      language="vue"
      title="代码示例"
      max-height="460px"
    />
</template>
