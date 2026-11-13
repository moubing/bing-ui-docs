<script setup lang="ts">
import { BingRadio, BingInput, BingRadioGroup, BingTable, BingTag } from '@moubing/bing-ui'
import DocsExampleCode from '~/components/DocsExampleCode.vue'
import { onActivated, onDeactivated, ref } from 'vue'
import { useExamples } from './state'
const { columns, virtualRows, virtualDemo, virtualOptions, virtualMode, updateVirtual, getRiskTone, toNumberText, virtualCode } = useExamples()
const examplesActive = ref(true)
onActivated(() => { examplesActive.value = true })
onDeactivated(() => { examplesActive.value = false })
</script>

<template>
  <ClientOnly v-if="examplesActive">
  <div class="doc-example">
    <div class="doc-example__preview table-demo-stage">
        <BingTable
          :data="virtualRows"
          :columns="columns"
          row-key="id"
          :virtual="virtualMode"
          :virtual-row-height="toNumberText(virtualDemo.rowHeight)"
          :virtual-overscan="toNumberText(virtualDemo.overscan)"
          :max-height="toNumberText(virtualDemo.maxHeight)"
          :pagination="false"
          ariaLabel="大量项目表格"
        >
          <template #toolbar>
            <div class="table-toolbar">
              <strong>大量数据</strong>
              <span>{{ virtualRows.length }} 行</span>
            </div>
          </template>
          <template #cell-progress="{ value }">
            {{ value }}%
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
    </div>

    <div class="doc-example__controls">
      <div class="control-group">
        <p class="control-label">虚拟滚动</p>
        <BingRadioGroup id="table-control-2" name="table-control-2"
          :model-value="virtualDemo.virtual"
          direction="column"
          size="sm"
          ariaLabel="虚拟滚动模式"
          @update:model-value="updateVirtual">
          <BingRadio v-for="option in virtualOptions" :id="`table-control-2-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>
      <label class="control-label" for="table-max-height">最大高度</label>
      <BingInput id="table-max-height" v-model="virtualDemo.maxHeight" block />
      <label class="control-label" for="table-row-height">统一行高</label>
      <BingInput id="table-row-height" v-model="virtualDemo.rowHeight" placeholder="留空跟随尺寸" block />
      <label class="control-label" for="table-overscan">额外渲染行数</label>
      <BingInput id="table-overscan" v-model="virtualDemo.overscan" block />
    </div>
  </div>

  </ClientOnly>
  <DocsExampleCode
    :code="virtualCode"
    language="vue"
    title="代码示例"
    max-height="360px"
  />
</template>
