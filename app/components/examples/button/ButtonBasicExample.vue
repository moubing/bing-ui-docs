<script setup lang="ts">
import { BingRadio, BingButton, BingCheckbox, BingCodeBlock, BingInput, BingRadioGroup } from '@moubing/bing-ui'
import { useExamples } from './state'
const { variantOptions, sizeOptions, roundedOptions, playground, updateVariant, updateSize, updateRounded, playgroundCode } = useExamples()
</script>

<template>
  <div class="doc-example">
    <div class="doc-example__preview button-demo-stage">
      <p class="preview-label">实时预览</p>
      <ClientOnly>
        <BingButton
          :variant="playground.variant"
          :size="playground.size"
          :rounded="playground.rounded"
          :loading="playground.loading"
          :disabled="playground.disabled"
          :block="playground.block"
        >
          {{ playground.label }}
        </BingButton>
      </ClientOnly>
    </div>

    <div class="doc-example__controls">
      <label class="control-label" for="button-label">文案</label>
      <BingInput id="button-label" v-model="playground.label" block clearable />

      <div class="control-group">
        <p class="control-label">类型</p>
        <BingRadioGroup id="button-control-1" name="button-control-1"
          :model-value="playground.variant"
          direction="wrap"
          size="sm"
          aria-label="按钮类型"
          @update:model-value="updateVariant">
          <BingRadio v-for="option in variantOptions" :id="`button-control-1-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>

      <div class="control-group">
        <p class="control-label">尺寸</p>
        <BingRadioGroup id="button-control-2" name="button-control-2"
          :model-value="playground.size"
          direction="row"
          size="sm"
          aria-label="按钮尺寸"
          @update:model-value="updateSize">
          <BingRadio v-for="option in sizeOptions" :id="`button-control-2-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>

      <div class="control-group">
        <p class="control-label">圆角</p>
        <BingRadioGroup id="button-control-3" name="button-control-3"
          :model-value="playground.rounded"
          direction="row"
          size="sm"
          aria-label="按钮圆角"
          @update:model-value="updateRounded">
          <BingRadio v-for="option in roundedOptions" :id="`button-control-3-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>

      <BingCheckbox v-model="playground.loading" label="加载中" />
      <BingCheckbox v-model="playground.disabled" label="禁用" />
      <BingCheckbox v-model="playground.block" label="撑满宽度" />
    </div>
  </div>

  <BingCodeBlock
    :code="playgroundCode"
    language="vue"
    title="代码示例"
    wrap
  />
</template>
