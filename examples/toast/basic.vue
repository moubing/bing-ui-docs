<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { BingButton, BingToast, bingToast, type BingToastItem, type BingToastOptions, type BingToastProps } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

type DemoOptions = BingToastOptions & BingToastProps
// @docs-options:start
const options: DemoOptions = {
  "type": "success",
  "title": "保存成功",
  "message": "新的组件文档已经写入本地页面。",
  "position": "top-right",
  "duration": 2800,
  "closable": true,
  "viewportPosition": "all",
  "width": "360px",
  "offset": "18px",
  "gap": "10px",
  "max": 5
}
// @docs-options:end
const ownedIds = new Set<string>()
const lastId = ref<string>()
const feedback = ref('等待操作')
const count = computed(() => bingToast.getToasts().length)
function notify() {
  lastId.value = bingToast.show({ type: options.type, title: options.title, message: options.message,
    position: options.position, duration: options.duration, closable: options.closable })
  ownedIds.add(lastId.value)
}
function closeLast() { if (lastId.value) bingToast.close(lastId.value); feedback.value = '服务关闭' }
function handleClose(item: BingToastItem) { feedback.value = `用户关闭：${item.type}` }
onBeforeUnmount(() => ownedIds.forEach(id => bingToast.close(id)))
</script>

<template>
  <div class="actions">
    <BingButton :throttle="false" @click="notify">创建提示</BingButton>
    <BingButton :throttle="false" @click="closeLast">关闭上一条</BingButton>
    <BingButton :throttle="false" @click="bingToast.clear(options.position)">清空当前位置</BingButton>
    <BingButton :throttle="false" @click="bingToast.clear()">清空全部</BingButton>
  </div>
  <p role="status">队列：{{ count }}；{{ feedback }}</p>
  <BingToast :viewport-position="options.viewportPosition" :width="options.width" :offset="options.offset"
    :gap="options.gap" :max="options.max" @close="handleClose" />
</template>

<style scoped>
.actions { display: flex; gap: 10px; flex-wrap: wrap; }
</style>
