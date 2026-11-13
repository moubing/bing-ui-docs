<script setup lang="ts">
import { BingButton, BingCodeBlock, BingTextarea } from '@moubing/bing-ui'
import { useExamples } from './state'
const { exposeValue, exposeTextarea, selectedText, focusExposeTextarea, blurExposeTextarea, selectExposeTextarea, exposeCode } = useExamples()
</script>

<template>
  <div class="doc-example">
    <div class="doc-example__preview textarea-demo-stage">
      <p class="preview-label">方法预览</p>
      <ClientOnly>
        <BingTextarea ref="exposeTextarea" v-model="exposeValue" block ariaLabel="实例方法示例" />
      </ClientOnly>
      <div class="textarea-actions">
        <BingButton size="sm" variant="secondary" @click="focusExposeTextarea">
          focus
        </BingButton>
        <BingButton size="sm" variant="ghost" @click="blurExposeTextarea">
          blur
        </BingButton>
        <BingButton size="sm" variant="ghost" @click="selectExposeTextarea">
          select
        </BingButton>
      </div>
      <p class="textarea-feedback">
        <span>选中文本：{{ selectedText }}</span>
      </p>
    </div>

    <div class="doc-example__controls">
      <p>
        <code>select()</code> 会调用内部原生 textarea 的选择能力；这里的反馈读取原生元素实际选中的文本。
      </p>
    </div>
  </div>

  <BingCodeBlock :code="exposeCode" language="vue" title="代码示例" wrap />
</template>
