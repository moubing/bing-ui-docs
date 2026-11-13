<script setup lang="ts">
import { BingButton, BingCodeBlock } from '@moubing/bing-ui'
import DocsToastViewport from '~/components/content/DocsToastViewport.vue'
import { useExamples } from './state'
const { clickCount, throttledCount, remainingMs, handleAcceptedClick, handleThrottled, throttleCode } = useExamples()
</script>

<template>
  <ClientOnly>
    <DocsToastViewport viewport-position="all" />
  </ClientOnly>

  <div class="doc-example">
    <div class="doc-example__preview">
      <p class="preview-label">节流反馈</p>
      <div class="button-demo-stack">
        <ClientOnly>
          <BingButton throttle :throttle-delay="1200" @click="handleAcceptedClick" @throttled="handleThrottled">
            连续点击试试
          </BingButton>
          <BingButton loading variant="secondary">加载中</BingButton>
          <BingButton disabled variant="ghost">不可用</BingButton>
        </ClientOnly>
      </div>
      <p class="button-feedback">
        <span>有效点击：{{ clickCount }}</span><span>被节流：{{ throttledCount }}</span><span>剩余等待：{{ remainingMs }}ms</span>
      </p>
    </div>

    <div class="doc-example__controls">
      <p>
        第一颗按钮显式开启 <code>throttle</code>，并设置 <code>throttleDelay</code> 为 1200ms。在 1.2 秒内连续点击，第二次会触发 <code>throttled</code>。默认按钮不拦截连续点击。
      </p>
    </div>
  </div>

  <BingCodeBlock
    :code="throttleCode"
    language="vue"
    title="代码示例"
    wrap
  />
</template>
