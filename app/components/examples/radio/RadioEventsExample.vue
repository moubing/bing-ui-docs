<script setup lang="ts">
import { BingButton, BingCodeBlock, BingRadio } from '@moubing/bing-ui'
import { useExamples } from './state'
const { eventModel, eventLog, handleChange, handleFocus, handleBlur, resetEventRadio, eventsCode } = useExamples()
</script>

<template>
  <div class="doc-example">
    <div class="doc-example__preview radio-demo-stage">
      <p class="preview-label">事件预览</p>
      <ClientOnly>
        <BingRadio
          id="radio-email"
          name="radio-email"
          v-model="eventModel"
          value="email"
          label="邮件通知"
          description="点击后写入 email。"
          @change="handleChange"
          @focus="handleFocus"
          @blur="handleBlur"
        />
      </ClientOnly>
      <div class="radio-actions">
        <BingButton size="sm" variant="ghost" @click="resetEventRadio">重置</BingButton>
      </div>
      <p class="radio-feedback">
        <span>当前值：{{ eventModel }}</span><span>{{ eventLog }}</span>
      </p>
    </div>

    <div class="doc-example__controls">
      <p>先点击 Radio 触发 change，再点击“重置”把外部值改回未选状态。</p>
    </div>
  </div>

  <BingCodeBlock
    :code="eventsCode"
    language="vue"
    title="代码示例"
    wrap
  />
</template>
