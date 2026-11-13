<script setup lang="ts">
import { BingRadio, BingCodeBlock, BingInput, BingRadioGroup, BingTreeSelect } from '@moubing/bing-ui'
import { onActivated, onDeactivated, ref } from 'vue'
import { useExamples } from './state'
const { panelPlacementOptions, panelAlignOptions, workspaceTree, panelDemo, panelValue, selectedPanelText, updateControl5, updateControl6, toNumberText, panelCode } = useExamples()
const examplesActive = ref(true)
onActivated(() => { examplesActive.value = true })
onDeactivated(() => { examplesActive.value = false })
</script>

<template>
  <ClientOnly v-if="examplesActive">
  <div class="doc-example demo-grid tree-select-demo-grid">
    <div class="doc-example__preview demo-panel tree-select-demo-stage">
      <p class="preview-label">定位预览</p>
        <BingTreeSelect
          id="tree-select-panelValue" ariaLabel="树选择器定位" v-model="panelValue"
          :options="workspaceTree"
          :panel-placement="panelDemo.placement"
          :panel-align="panelDemo.align"
          :panel-gap="toNumberText(panelDemo.gap)"
          placeholder="测试弹层位置"
          :default-expanded-values="['library', 'form']"
          block
        />
      <div class="tree-select-feedback">
        <span>当前文本：{{ selectedPanelText }}</span>
        <span>位置：{{ panelDemo.placement }} / {{ panelDemo.align }}</span>
      </div>
    </div>

    <div class="doc-example__controls demo-panel tree-select-control-panel">
      <div class="demo-control">
        <span>位置</span>
        <BingRadioGroup direction="wrap" id="tree-select-control-4" name="tree-select-control-4" ariaLabel="位置"
          :model-value="panelDemo.placement"
          @update:model-value="updateControl5">
          <BingRadio v-for="option in panelPlacementOptions" :id="`tree-select-control-4-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>
      <div class="demo-control">
        <span>对齐</span>
        <BingRadioGroup direction="wrap" id="tree-select-control-5" name="tree-select-control-5" ariaLabel="对齐"
          :model-value="panelDemo.align"
          @update:model-value="updateControl6">
          <BingRadio v-for="option in panelAlignOptions" :id="`tree-select-control-5-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>
      <label class="demo-control">
        <span>面板间距</span>
        <BingInput ariaLabel="面板间距" v-model="panelDemo.gap" clearable />
      </label>
    </div>
  </div>

  </ClientOnly>
  <BingCodeBlock :code="panelCode" language="vue" title="代码示例" />
</template>
