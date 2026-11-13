<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { BingButton } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const accepted = ref(0)
const completed = ref(0)
const pending = ref(false)
let frame = 0
function simulateWork() {
  accepted.value++ // click 同步生效，反馈不推迟业务事件。
  pending.value = true
  frame = requestAnimationFrame(() => {
    frame = requestAnimationFrame(() => {
      // 仅为演示模拟繁忙页面；实际项目应拆分长任务或减少挂载量。
      const until = performance.now() + 300
      while (performance.now() < until) { /* 模拟计算 */ }
      completed.value++
      pending.value = false
    })
  })
}
onBeforeUnmount(() => cancelAnimationFrame(frame))
</script>

<template>
  <div class="busy-example">
    <BingButton variant="secondary" text-effect="none" :disabled="pending" @click="simulateWork">模拟繁忙页面</BingButton>
    <p role="status">接受点击：{{ accepted }}；完成计算：{{ completed }}</p>
  </div>
</template>

<style scoped>
.busy-example { display: grid; justify-items: start; gap: 12px; padding: 32px; }
.busy-example p { margin: 0; }
</style>
