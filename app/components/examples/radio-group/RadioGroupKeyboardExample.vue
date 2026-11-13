<script setup lang="ts">
import { BingCodeBlock, BingRadioGroup } from '@moubing/bing-ui'
import { useExamples } from './state'
const { keyboardOptions, keyboardValue, eventLog, handleKeyboardChange, handleKeyboardFocus, handleKeyboardBlur, formatSelected, keyboardCode } = useExamples()
</script>

<template>
  <div class="doc-example">
    <div class="doc-example__preview radio-group-demo-stage">
      <p class="preview-label">键盘预览</p>
      <ClientOnly>
        <BingRadioGroup id="radio-doc-3" name="radio-doc-3"
          v-model="keyboardValue"
          :options="keyboardOptions"
          direction="column"
          aria-label="文档步骤"
          @change="handleKeyboardChange"
          @focus="handleKeyboardFocus"
          @blur="handleKeyboardBlur"
        />
      </ClientOnly>
      <p class="radio-group-feedback">
        <span>当前值：{{ formatSelected(keyboardValue) }}</span><span>{{ eventLog }}</span>
      </p>
    </div>

    <div class="doc-example__controls">
      <p>
        聚焦第一项后按 <code>ArrowRight</code> 或 <code>ArrowDown</code>，会跳过禁用的第二项并选择第三项。
      </p>
    </div>
  </div>

  <BingCodeBlock
    :code="keyboardCode"
    language="vue"
    title="代码示例"
    wrap
  />
</template>
