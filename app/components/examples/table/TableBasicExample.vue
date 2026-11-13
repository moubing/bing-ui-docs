<script setup lang="ts">
import { BingRadio, BingCheckbox, BingRadioGroup, BingTable, BingTag } from '@moubing/bing-ui'
import DocsExampleCode from '~/components/DocsExampleCode.vue'
import { onActivated, onDeactivated, ref } from 'vue'
import { useExamples } from './state'
const { columns, tableData, basicSelectedKeys, basicExpandedKeys, basicPage, basicPageSize, basicColumnWidths, basicColumnOrder, basicHiddenColumns, basicColumnFixed, basicSortKey, basicSortOrder, basicLog, basicDemo, sizeOptions, basicSelectionText, basicSortText, updateSize, handleSelectionChange, handleSortChange, handlePageChange, getStatusTone, getRiskTone, basicCode } = useExamples()
const examplesActive = ref(true)
onActivated(() => { examplesActive.value = true })
onDeactivated(() => { examplesActive.value = false })
</script>

<template>
  <ClientOnly v-if="examplesActive">
  <div class="doc-example doc-example--stacked">
    <div class="doc-example__preview table-demo-stage">
      <p class="preview-label">实时预览</p>
        <BingTable
          v-model:selected-row-keys="basicSelectedKeys"
          v-model:expanded-row-keys="basicExpandedKeys"
          v-model:page="basicPage"
          v-model:page-size="basicPageSize"
          v-model:column-widths="basicColumnWidths"
          v-model:column-order="basicColumnOrder"
          v-model:hidden-column-keys="basicHiddenColumns"
          v-model:column-fixed="basicColumnFixed"
          v-model:sort-key="basicSortKey"
          v-model:sort-order="basicSortOrder"
          :data="tableData"
          :columns="columns"
          row-key="id"
          row-disabled="disabled"
          :size="basicDemo.size"
          :bordered="basicDemo.bordered"
          :striped="basicDemo.striped"
          :selectable="basicDemo.selectable"
          :select-on-row-click="basicDemo.selectOnRowClick"
          :pagination="basicDemo.pagination"
          :loading="basicDemo.loading"
          :preserve-page-height="basicDemo.preservePageHeight"
          :show-column-controls="basicDemo.showColumnControls"
          :page-size-options="[3, 5, 10]"
          :max-height="420"
          empty-text="暂无项目"
          loading-text="正在加载项目"
          ariaLabel="项目表格"
          @selection-change="handleSelectionChange"
          @sort-change="handleSortChange"
          @page-change="handlePageChange"
        >
          <template #toolbar="{ selectedRowKeys }">
            <div class="table-toolbar">
              <strong>项目列表</strong>
              <span>已选择 {{ selectedRowKeys.length }} 行</span>
            </div>
          </template>

          <template #cell-status="{ value }">
            <BingTag :tone="getStatusTone(value)" size="sm" variant="soft">
              {{ value }}
            </BingTag>
          </template>

          <template #cell-progress="{ value }">
            <span class="table-progress">
              <span :style="{ width: `${value}%` }"></span>
              <strong>{{ value }}%</strong>
            </span>
          </template>

          <template #cell-budget="{ value }">
            {{ value }} 万
          </template>

          <template #cell-risk="{ value }">
            <BingTag :tone="getRiskTone(value)" size="sm" variant="soft">
              {{ value }}
            </BingTag>
          </template>
        </BingTable>
      <p class="table-feedback">
        <span>选择：{{ basicSelectionText }}</span><span>排序：{{ basicSortText }}</span><span>{{ basicLog }}</span>
      </p>
    </div>

    <div class="doc-example__controls table-control-grid">
      <div class="control-group">
        <p class="control-label">尺寸</p>
        <BingRadioGroup id="table-control-1" name="table-control-1"
          :model-value="basicDemo.size"
          direction="row"
          size="sm"
          ariaLabel="表格尺寸"
          @update:model-value="updateSize">
          <BingRadio v-for="option in sizeOptions" :id="`table-control-1-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>
      <BingCheckbox v-model="basicDemo.bordered" label="显示边框" />
      <BingCheckbox v-model="basicDemo.striped" label="显示斑马纹" />
      <BingCheckbox v-model="basicDemo.selectable" label="显示选择列" />
      <BingCheckbox v-model="basicDemo.selectOnRowClick" label="点击行切换选择" />
      <BingCheckbox v-model="basicDemo.pagination" label="开启分页" />
      <BingCheckbox v-model="basicDemo.preservePageHeight" label="分页保持高度" />
      <BingCheckbox v-model="basicDemo.showColumnControls" label="显示列设置" />
      <BingCheckbox v-model="basicDemo.loading" label="加载态" />
    </div>
  </div>

  </ClientOnly>
  <DocsExampleCode
    :code="basicCode"
    language="vue"
    title="代码示例"
    max-height="720px"
  />
</template>
