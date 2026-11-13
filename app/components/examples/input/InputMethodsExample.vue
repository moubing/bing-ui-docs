<script setup lang="ts">
import { BingCodeBlock, BingInput } from '@moubing/bing-ui'
import { useExamples } from './state'
const { exposeValue, exposeInput, selectedText, focusExposeInput, blurExposeInput, selectExposeInput, exposeCode } = useExamples()
</script>

<template>
  <div class="doc-example">
    <div class="doc-example__preview input-demo-stage">
      <p class="preview-label">方法预览</p>
      <ClientOnly>
        <BingInput ref="exposeInput" v-model="exposeValue" block />
      </ClientOnly>
      <div class="input-action-row">
        <button type="button" @click="focusExposeInput">focus</button>
        <button type="button" @click="blurExposeInput">blur</button>
        <button type="button" @click="selectExposeInput">select</button>
      </div>
      <p class="input-feedback">
        <span>选中文本：{{ selectedText }}</span>
      </p>
    </div>

    <div class="doc-example__controls">
      <p>
        <code>focus()</code>、<code>blur()</code> 和 <code>select()</code>都直接操作内部原生输入框。
      </p>
    </div>
  </div>

  <BingCodeBlock :code="exposeCode" language="vue" title="代码示例" wrap />
</template>
