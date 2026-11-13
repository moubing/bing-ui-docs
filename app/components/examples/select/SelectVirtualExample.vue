<script setup lang="ts">
import { BingRadio, BingCodeBlock, BingInput, BingRadioGroup, BingSelect } from '@moubing/bing-ui'
import { onActivated, onDeactivated, ref } from 'vue'
import { useExamples } from './state'
const { modeOptions, virtualOptions, virtualDemo, virtualValue, selectedVirtualLabel, virtualMode, virtualItemHeight, updateVirtual, toNumberText, virtualCode } = useExamples()
const examplesActive = ref(true)
onActivated(() => { examplesActive.value = true })
onDeactivated(() => { examplesActive.value = false })
</script>

<template>
  <ClientOnly v-if="examplesActive">
  <div class="doc-example">
    <div class="doc-example__preview select-demo-stage">
      <p class="preview-label">大量选项</p>
        <BingSelect id="select-virtualValue" v-model="virtualValue"
          :options="virtualOptions"
          multiple
          searchable
          :virtual="virtualMode"
          :virtual-item-height="virtualItemHeight"
          :virtual-overscan="5"
          :panel-max-height="toNumberText(virtualDemo.panelMaxHeight)"
          placeholder="选择大量选项"
          select-all-text="全选当前结果"
          clear-all-text="清空当前结果"
          block
          ariaLabel="选择大量选项"
        />
      <p class="select-feedback">
        <span>已选：{{ selectedVirtualLabel }}</span>
      </p>
    </div>

    <div class="doc-example__controls">
      <div class="control-group">
        <p class="control-label">虚拟列表</p>
        <BingRadioGroup id="select-control-6" name="select-control-6"
          :model-value="virtualDemo.virtual"
          direction="wrap"
          size="sm"
          ariaLabel="虚拟列表模式"
          @update:model-value="updateVirtual">
          <BingRadio v-for="option in modeOptions" :id="`select-control-6-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>

      <label class="control-label" for="select-item-height">单项高度</label>
      <BingInput id="select-item-height" :model-value="virtualDemo.itemHeight" placeholder="留空使用当前尺寸的默认行高" block
        @update:model-value="virtualDemo.itemHeight = String($event)" />

      <label class="control-label" for="select-panel-height">面板最大高度</label>
      <BingInput id="select-panel-height" v-model="virtualDemo.panelMaxHeight" block />
    </div>
  </div>

  </ClientOnly>
  <BingCodeBlock
    :code="virtualCode"
    language="vue"
    title="代码示例"
    wrap
  />
</template>
