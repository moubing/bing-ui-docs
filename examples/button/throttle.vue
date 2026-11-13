<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingToast, bingToast } from '@moubing/bing-ui'
import type { BingButtonThrottledPayload } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const clickCount = ref(0)
const throttledCount = ref(0)
const remainingMs = ref(0)
function handleAcceptedClick() {
  clickCount.value += 1
  // 仅演示反馈，不发送业务请求。
  bingToast.success({ title: '点击已生效', message: `第 ${clickCount.value} 次有效点击已通过节流校验。`, duration: 5000 })
}
function handleThrottled(payload: BingButtonThrottledPayload) {
  throttledCount.value += 1
  remainingMs.value = Math.ceil(payload.remaining)
}
</script>

<template>
  <div class="button-stack">
    <BingButton throttle :throttle-delay="1200" @click="handleAcceptedClick" @throttled="handleThrottled">连续点击试试</BingButton>
    <BingButton loading variant="secondary">加载中</BingButton>
    <BingButton disabled variant="ghost">不可用</BingButton>
  </div>
  <p role="status">有效点击：{{ clickCount }}；被节流：{{ throttledCount }}；剩余等待：{{ remainingMs }}ms</p>
  <!-- 应用根部通常只挂一个 Toast 容器；独立运行本例时在此挂载。 -->
  <BingToast viewport-position="all" />
</template>

<style scoped>
.button-stack { display: grid; justify-items: start; gap: 12px; }
</style>
