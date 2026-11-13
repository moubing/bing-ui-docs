<script setup lang="ts">
import { BingRadio, BingCheckbox, BingCodeBlock, BingInput, BingRadioGroup, BingTreeSelect } from '@moubing/bing-ui'
import { onActivated, onDeactivated, ref } from 'vue'
import { useExamples } from './state'
const { searchableOptions, virtualTree, virtualDemo, virtualValue, virtualMode, selectedVirtualText, formatSelectedCount, updateControl4, toNumberText, virtualCode } = useExamples()
const examplesActive = ref(true)
onActivated(() => { examplesActive.value = true })
onDeactivated(() => { examplesActive.value = false })
</script>

<template>
  <ClientOnly v-if="examplesActive">
  <div class="doc-example demo-grid tree-select-demo-grid">
    <div class="doc-example__preview demo-panel tree-select-demo-stage">
      <p class="preview-label">大量节点</p>
        <BingTreeSelect
          id="tree-select-virtualValue" ariaLabel="大量层级节点" v-model="virtualValue"
          :options="virtualTree"
          multiple
          searchable
          :default-expand-all="virtualDemo.defaultExpandAll"
          :virtual="virtualMode"
          :virtual-threshold="20"
          :virtual-item-height="virtualDemo.itemHeight.trim() ? toNumberText(virtualDemo.itemHeight) : undefined"
          :virtual-overscan="6"
          :panel-max-height="toNumberText(virtualDemo.panelMaxHeight)"
          placeholder="搜索并选择大量层级节点"
          block
        />
      <div class="tree-select-feedback">
        <span>已选数量：{{ formatSelectedCount(virtualValue) }}</span>
        <span>已选文本：{{ selectedVirtualText }}</span>
      </div>
    </div>

    <div class="doc-example__controls demo-panel tree-select-control-panel">
      <div class="demo-control">
        <span>虚拟滚动</span>
        <BingRadioGroup direction="wrap" id="tree-select-control-6" name="tree-select-control-6" ariaLabel="虚拟滚动"
          :model-value="virtualDemo.virtual"
          @update:model-value="updateControl4">
          <BingRadio v-for="option in searchableOptions" :id="`tree-select-control-6-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>
      <label class="demo-control">
        <span>虚拟行高（留空跟随尺寸）</span>
        <BingInput ariaLabel="虚拟行高" :model-value="virtualDemo.itemHeight" @update:model-value="virtualDemo.itemHeight = String($event)" placeholder="默认 32px" clearable />
      </label>
      <label class="demo-control">
        <span>面板最大高度</span>
        <BingInput ariaLabel="面板最大高度" v-model="virtualDemo.panelMaxHeight" clearable />
      </label>
      <BingCheckbox v-model="virtualDemo.defaultExpandAll" label="默认展开全部节点" />
    </div>
  </div>

  </ClientOnly>
  <BingCodeBlock :code="virtualCode" language="vue" title="代码示例" />
</template>
