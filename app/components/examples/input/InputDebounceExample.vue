<script setup lang="ts">
import { BingCodeBlock, BingInput } from '@moubing/bing-ui'
import { useExamples } from './state'
const { SearchIcon, debounceValue, debouncedValue, clearCount, focusCount, blurCount, handleDebouncedInput, handleClear, handleFocus, handleBlur, debounceCode } = useExamples()
</script>

<template>
  <div class="doc-example">
    <div class="doc-example__preview input-demo-stage">
      <p class="preview-label">事件预览</p>
      <ClientOnly>
        <BingInput
          v-model="debounceValue"
          :icon="SearchIcon"
          type="search"
          block
          placeholder="输入后等待 500ms"
          :debounce-delay="500"
          @debounced-input="handleDebouncedInput"
          @clear="handleClear"
          @focus="handleFocus"
          @blur="handleBlur"
        />
      </ClientOnly>
      <p class="input-feedback">
        <span>即时值：{{ debounceValue || '空' }}</span><span>防抖值：{{ debouncedValue }}</span><span>清除：{{ clearCount }}</span><span>focus：{{ focusCount }}</span><span>blur：{{ blurCount }}</span>
      </p>
    </div>

    <div class="doc-example__controls">
      <p>
        输入内容后等待 500ms，防抖值才会更新。点击清除按钮时，会立即触发<code>clear</code> 和空字符串的 <code>debounced-input</code>。
      </p>
    </div>
  </div>

  <BingCodeBlock
    :code="debounceCode"
    language="vue"
    title="代码示例"
    wrap
  />
</template>
