<script setup lang="ts">
import { BingTable, BingTag } from '@moubing/bing-ui'
import DocsExampleCode from '~/components/DocsExampleCode.vue'
import { onActivated, onDeactivated, ref } from 'vue'
import { useExamples } from './state'
const { columns, tableData, treeExpandedKeys, getStatusTone, treeCode } = useExamples()
const examplesActive = ref(true)
onActivated(() => { examplesActive.value = true })
onDeactivated(() => { examplesActive.value = false })
</script>

<template>
  <ClientOnly v-if="examplesActive">
  <div class="doc-example doc-example--stacked">
    <div class="doc-example__preview table-demo-stage">
        <BingTable
          v-model:expanded-row-keys="treeExpandedKeys"
          :data="tableData"
          :columns="columns.slice(0, 4)"
          row-key="id"
          children-key="children"
          tree-column-key="project"
          :pagination="false"
          bordered
          :max-height="320"
          ariaLabel="树形项目表格"
        >
          <template #cell-status="{ value }">
            <BingTag :tone="getStatusTone(value)" size="sm" variant="soft">
              {{ value }}
            </BingTag>
          </template>
        </BingTable>
    </div>
  </div>

  </ClientOnly>
  <DocsExampleCode :code="treeCode" language="vue" title="代码示例" max-height="360px" />
</template>
