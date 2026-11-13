<script setup lang="ts">
import { BingButton, BingCodeBlock, BingDatePicker } from '@moubing/bing-ui'
import { useExamples } from './state'
const { examplesActive, exposeValue, exposePicker, exposeLog, openExposePanel, focusExposeTrigger, clearExposeValue, formatModelValue, exposeCode } = useExamples()
</script>

<template>
  <ClientOnly v-if="examplesActive">
  <div class="doc-example">
    <div class="doc-example__preview date-picker-demo-stage">
      <p class="preview-label">实时预览</p>
        <BingDatePicker id="date-picker-methods" ariaLabel="方法日期" ref="exposePicker" v-model="exposeValue" block />
      <div class="date-picker-action-row">
        <BingButton size="sm" variant="secondary" @click="openExposePanel">
          打开面板
        </BingButton>
        <BingButton size="sm" variant="ghost" @click="focusExposeTrigger">
          聚焦触发器
        </BingButton>
        <BingButton size="sm" variant="danger" @click="clearExposeValue">
          清空
        </BingButton>
      </div>
      <p class="date-picker-feedback">
        <span>当前值：{{ formatModelValue(exposeValue) }}</span><span>{{ exposeLog }}</span>
      </p>
    </div>
  </div>

  </ClientOnly>

  <BingCodeBlock
      :code="exposeCode"
      language="vue"
      title="代码示例"
      max-height="440px"
    />
</template>
