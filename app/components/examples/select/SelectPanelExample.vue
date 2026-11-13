<script setup lang="ts">
import { BingRadio, BingCodeBlock, BingInput, BingRadioGroup, BingSelect } from '@moubing/bing-ui'
import { onActivated, onDeactivated, ref } from 'vue'
import { useExamples } from './state'
const { panelPlacementOptions, panelAlignOptions, cityOptions, panelDemo, panelValue, selectedPanelLabel, updatePanelPlacement, updatePanelAlign, toNumberText, panelCode } = useExamples()
const examplesActive = ref(true)
onActivated(() => { examplesActive.value = true })
onDeactivated(() => { examplesActive.value = false })
</script>

<template>
  <ClientOnly v-if="examplesActive">
  <div class="doc-example">
    <div class="doc-example__preview select-demo-stage">
      <p class="preview-label">定位预览</p>
        <BingSelect id="select-panelValue" v-model="panelValue"
          :options="cityOptions"
          :panel-placement="panelDemo.placement"
          :panel-align="panelDemo.align"
          :panel-gap="toNumberText(panelDemo.gap)"
          placeholder="测试弹层位置"
          block
          ariaLabel="测试选择器弹层位置"
        />
      <p class="select-feedback">
        <span>当前选择：{{ selectedPanelLabel }}</span>
      </p>
    </div>

    <div class="doc-example__controls">
      <div class="control-group">
        <p class="control-label">位置</p>
        <BingRadioGroup id="select-control-4" name="select-control-4"
          :model-value="panelDemo.placement"
          direction="wrap"
          size="sm"
          ariaLabel="选择器弹层位置"
          @update:model-value="updatePanelPlacement">
          <BingRadio v-for="option in panelPlacementOptions" :id="`select-control-4-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>

      <div class="control-group">
        <p class="control-label">对齐</p>
        <BingRadioGroup id="select-control-5" name="select-control-5"
          :model-value="panelDemo.align"
          direction="row"
          size="sm"
          ariaLabel="选择器弹层对齐"
          @update:model-value="updatePanelAlign">
          <BingRadio v-for="option in panelAlignOptions" :id="`select-control-5-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>

      <label class="control-label" for="select-panel-gap">面板间距</label>
      <BingInput id="select-panel-gap" v-model="panelDemo.gap" block />
    </div>
  </div>

  </ClientOnly>
  <BingCodeBlock
    :code="panelCode"
    language="vue"
    title="代码示例"
    wrap
  />
</template>
