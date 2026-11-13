<script setup lang="ts">
import { BingRadio, BingCheckbox, BingCodeBlock, BingColorPicker, BingInput, BingRadioGroup } from '@moubing/bing-ui'
import { useExamples } from './state'
const { examplesActive, sizeOptions, statusOptions, productPresets, playground, colorValue, updateSize, updateStatus, toNumberText, playgroundCode } = useExamples()
</script>

<template>
  <ClientOnly v-if="examplesActive">
  <div class="doc-example">
    <div class="doc-example__preview color-picker-demo-stage">
      <p class="preview-label">实时预览</p>
        <BingColorPicker
          v-model="colorValue"
          :presets="productPresets"
          :size="playground.size"
          :status="playground.status"
          :block="playground.block"
          :glass="playground.glass"
          :disabled="playground.disabled"
          :min-width="toNumberText(playground.minWidth)"
          :panel-width="toNumberText(playground.panelWidth)"
          aria-label="选择主题颜色"
        />

      <div class="color-picker-summary">
        <span class="color-picker-swatch" :style="{ background: colorValue }" />
        <span>
          <strong>{{ colorValue }}</strong>
          <small>当前颜色值会跟随面板和输入框同步更新。</small>
        </span>
      </div>
    </div>

    <div class="doc-example__controls">
      <label class="control-label" for="color-picker-value">颜色值</label>
      <BingColorPicker
        id="color-picker-value"
        v-model="colorValue"
        :presets="productPresets"
        block
        aria-label="选择颜色值"
      />

      <div class="control-group">
        <p class="control-label">尺寸</p>
        <BingRadioGroup id="color-picker-control-1" name="color-picker-control-1"
          :model-value="playground.size"
          direction="row"
          size="sm"
          aria-label="颜色选择器尺寸"
          @update:model-value="updateSize">
          <BingRadio v-for="option in sizeOptions" :id="`color-picker-control-1-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>

      <div class="control-group">
        <p class="control-label">状态</p>
        <BingRadioGroup id="color-picker-control-2" name="color-picker-control-2"
          :model-value="playground.status"
          direction="wrap"
          size="sm"
          aria-label="颜色选择器状态"
          @update:model-value="updateStatus">
          <BingRadio v-for="option in statusOptions" :id="`color-picker-control-2-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>

      <label class="control-label" for="color-picker-min-width">最小宽度</label>
      <BingInput id="color-picker-min-width" v-model="playground.minWidth" block />

      <label class="control-label" for="color-picker-panel-width">面板宽度</label>
      <BingInput id="color-picker-panel-width" v-model="playground.panelWidth" block />

      <BingCheckbox v-model="playground.block" label="撑满宽度" />
      <BingCheckbox v-model="playground.glass" label="玻璃效果" />
      <BingCheckbox v-model="playground.disabled" label="禁用" />
    </div>
  </div>

  </ClientOnly>

  <BingCodeBlock
    :code="playgroundCode"
    language="vue"
    title="代码示例"
    wrap
  />
</template>
