<script setup lang="ts">
import { BingRadio, BingButton, BingCheckbox, BingCodeBlock, BingColorPicker, BingInput, BingRadioGroup } from '@moubing/bing-ui'
import { useExamples } from './state'
const { textEffectOptions, textTriggerOptions, textEffectDemo, updateTextEffect, updateTextEffectTrigger, textEffectCode } = useExamples()
</script>

<template>
  <div class="doc-example">
    <div class="doc-example__preview button-demo-stage">
      <p class="preview-label">动效预览</p>
      <ClientOnly>
        <BingButton
          variant="primary"
          :text-effect="textEffectDemo.textEffect"
          :text-effect-trigger="textEffectDemo.textEffectTrigger"
          :shine-color="textEffectDemo.customShine ? textEffectDemo.shineColor : undefined"
          :shine-base-color="textEffectDemo.customShine ? textEffectDemo.shineBaseColor : undefined"
          :text-jump-y="-7"
          :text-jump-stagger="0.04"
        >
          {{ textEffectDemo.label }}
        </BingButton>
      </ClientOnly>
    </div>

    <div class="doc-example__controls">
      <label class="control-label" for="effect-button-label">文案</label>
      <BingInput id="effect-button-label" v-model="textEffectDemo.label" block clearable />

      <div class="control-group">
        <p class="control-label">文字效果</p>
        <BingRadioGroup id="button-control-4" name="button-control-4"
          :model-value="textEffectDemo.textEffect"
          direction="wrap"
          size="sm"
          aria-label="按钮文字效果"
          @update:model-value="updateTextEffect">
          <BingRadio v-for="option in textEffectOptions" :id="`button-control-4-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>

      <div class="control-group">
        <p class="control-label">触发方式</p>
        <BingRadioGroup id="button-control-5" name="button-control-5"
          :model-value="textEffectDemo.textEffectTrigger"
          direction="row"
          size="sm"
          aria-label="按钮文字动效触发方式"
          @update:model-value="updateTextEffectTrigger">
          <BingRadio v-for="option in textTriggerOptions" :id="`button-control-5-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>

      <BingCheckbox id="button-custom-shine" v-model="textEffectDemo.customShine" label="自定义扫光配色" />
      <p>默认配色随主题变化；开启自定义配色后，下方颜色仅在 shine 效果中生效。</p>

      <div class="inline-control-grid">
        <div class="control-group">
          <label class="control-label" for="button-shine-color">扫光颜色</label>
          <BingColorPicker
            id="button-shine-color"
            v-model="textEffectDemo.shineColor"
            :disabled="!textEffectDemo.customShine"
            block
            aria-label="选择按钮扫光颜色"
          />
        </div>

        <div class="control-group">
          <label class="control-label" for="button-base-color">基础颜色</label>
          <BingColorPicker
            id="button-base-color"
            v-model="textEffectDemo.shineBaseColor"
            :disabled="!textEffectDemo.customShine"
            block
            aria-label="选择按钮基础颜色"
          />
        </div>
      </div>
    </div>
  </div>

  <BingCodeBlock
    :code="textEffectCode"
    language="vue"
    title="代码示例"
    wrap
  />
</template>
