<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { BingButton, BingToast, bingToast } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const busy = ref(false)
let id: string | undefined
let timer: ReturnType<typeof setTimeout> | undefined
function cancel() {
  if (timer !== undefined) clearTimeout(timer)
  timer = undefined
  if (id !== undefined) bingToast.close(id)
  busy.value = false
}
function start() {
  cancel()
  busy.value = true
  id = bingToast.loading({ title: '处理中', message: '正在同步组件元数据。', position: 'top-right' })
  const currentId = id
  // 仅模拟耗时，没有网络请求；用户已关闭的提示不再重新创建。
  timer = setTimeout(() => {
    timer = undefined
    busy.value = false
    if (!bingToast.getToasts().some(item => item.id === currentId)) return
    // 同 id 是整条替换，所需参数需要重新提供。
    bingToast.success({ id: currentId, title: '同步完成', message: '组件元数据已经更新。',
      position: 'top-right', duration: 2600, closable: true })
  }, 1200)
}
onBeforeUnmount(cancel)
</script>

<template>
  <div class="actions">
    <BingButton :disabled="busy" :throttle="false" @click="start">模拟 loading 到成功</BingButton>
    <BingButton :throttle="false" @click="cancel">取消演示</BingButton>
  </div>
  <BingToast viewport-position="all" />
</template>

<style scoped>
.actions { display: flex; gap: 10px; flex-wrap: wrap; }
</style>
