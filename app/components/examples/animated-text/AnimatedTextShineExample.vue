<script setup lang="ts">
import { BingRadio, BingAnimatedText, BingCodeBlock, BingColorPicker, BingInput, BingRadioGroup } from '@moubing/bing-ui'
import { useExamples } from './state'
const { examplesActive, shineDirectionOptions, shineDemo, updateShineDirection, shineCode } = useExamples()
</script>

<template>
  <ClientOnly v-if="examplesActive">
  <div class="doc-example doc-example--stacked">
    <div class="doc-example__preview">
      <p class="preview-label">扫光控制</p>
      <p class="animated-text-stage">

          <BingAnimatedText :follow-pointer="false"
            effect="shine"
            trigger="always"
            :shine-direction="shineDemo.direction"
            :shine-color="shineDemo.shineColor"
            :shine-base-color="shineDemo.shineBaseColor"
            :shine-speed="2.4"
            :shine-interval="1.2"
          >
            {{ shineDemo.text }}
          </BingAnimatedText>

      </p>
    </div>

    <div class="doc-example__controls">
      <label class="control-label" for="shine-text">文案</label>
      <BingInput id="shine-text" v-model="shineDemo.text" block clearable />

      <div class="control-group">
        <p class="control-label">方向</p>
        <BingRadioGroup id="animated-text-control-3" name="animated-text-control-3"
          :model-value="shineDemo.direction"
          direction="row"
          size="sm"
          aria-label="扫光方向"
          @update:model-value="updateShineDirection">
          <BingRadio v-for="option in shineDirectionOptions" :id="`animated-text-control-3-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>

      <div class="inline-control-grid">
        <div class="control-group">
          <label class="control-label" for="shine-color">扫光颜色</label>
          <BingColorPicker
            id="shine-color"
            v-model="shineDemo.shineColor"
            block
            aria-label="选择扫光颜色"
          />
        </div>

        <div class="control-group">
          <label class="control-label" for="shine-base-color">基础颜色</label>
          <BingColorPicker
            id="shine-base-color"
            v-model="shineDemo.shineBaseColor"
            block
            aria-label="选择基础颜色"
          />
        </div>
      </div>
    </div>
  </div>

  </ClientOnly>

  <BingCodeBlock
    :code="shineCode"
    language="vue"
    title="代码示例"
    wrap
  />
</template>
