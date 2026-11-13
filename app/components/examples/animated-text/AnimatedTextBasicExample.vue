<script setup lang="ts">
import { BingRadio, BingAnimatedText, BingCheckbox, BingCodeBlock, BingInput, BingRadioGroup } from '@moubing/bing-ui'
import { useExamples } from './state'
const { examplesActive, effectOptions, triggerOptions, playground, updatePlaygroundEffect, updatePlaygroundTrigger, playgroundCode } = useExamples()
</script>

<template>
  <ClientOnly v-if="examplesActive">
  <div class="doc-example">
    <div class="doc-example__preview">
      <p class="preview-label">实时预览</p>
      <p class="animated-text-stage">

          <BingAnimatedText
            :effect="playground.effect"
            :trigger="playground.trigger"
            :disabled="playground.disabled"
          >
            {{ playground.text }}
          </BingAnimatedText>

      </p>
    </div>

    <div class="doc-example__controls">
      <label class="control-label" for="animated-text-label">文案</label>
      <BingInput
        id="animated-text-label"
        v-model="playground.text"
        block
        clearable
        aria-label="动效文本内容"
      />

      <div class="control-group">
        <p class="control-label">效果</p>
        <BingRadioGroup id="animated-text-control-1" name="animated-text-control-1"
          :model-value="playground.effect"
          direction="wrap"
          size="sm"
          aria-label="文本动效"
          @update:model-value="updatePlaygroundEffect">
          <BingRadio v-for="option in effectOptions" :id="`animated-text-control-1-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>

      <div class="control-group">
        <p class="control-label">触发方式</p>
        <BingRadioGroup id="animated-text-control-2" name="animated-text-control-2"
          :model-value="playground.trigger"
          direction="wrap"
          size="sm"
          aria-label="文本动效触发方式"
          @update:model-value="updatePlaygroundTrigger">
          <BingRadio v-for="option in triggerOptions" :id="`animated-text-control-2-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>

      <BingCheckbox v-model="playground.disabled" label="禁用动画" />
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
