<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingSplitPane } from '@moubing/bing-ui'
import type { BingSplitPaneCancelPayload, BingSplitPaneResizePayload } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const size = ref(240)
const narrow = ref(false)
const log = ref('尚未调整')
function finish(value: BingSplitPaneResizePayload) { log.value = `提交偏好：${value.preferredSize}px` }
function cancel(value: BingSplitPaneCancelPayload) { log.value = `取消原因：${value.reason}` }
</script>

<template>
  <div style="display: grid; gap: 16px; min-width: 0;">
    <BingButton size="sm" variant="secondary" :throttle="false" style="justify-self: start" @click="narrow = !narrow">切换容器宽度</BingButton>
    <BingSplitPane v-model:side-size="size" :default-side-size="240" :min-side-size="100" :max-side-size="360" :min-main-size="180"
      :style="{ width: narrow ? '340px' : '100%', maxWidth: '100%', height: '240px', border: '1px solid var(--bing-border)' }"
      @resize-end="finish" @resize-cancel="cancel">
      <div style="padding: 12px;">正文区域。按 Esc 取消拖动，Enter 或双击恢复默认宽度。</div>
      <template #side="{ size: actual }"><div style="padding: 12px;">属性栏<br>{{ Math.round(actual) }}px</div></template>
    </BingSplitPane>
    <p role="status">偏好宽度：{{ size }}px；{{ log }}</p>
  </div>
</template>
