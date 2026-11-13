<script setup lang="ts">
import { ref } from 'vue'
import { BingTag } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const visible = ref(true)
const rowClicks = ref(0)
const closeType = ref('等待关闭')
function close(event: MouseEvent) {
  closeType.value = event.type
  visible.value = false
}
</script>

<template>
  <div @click="rowClicks++">
    <BingTag v-if="visible" label="被插槽替代" closable close-aria-label="移除已完成筛选" @close="close">已完成</BingTag>
    <span>筛选区域</span>
  </div>
  <p role="status">行点击：{{ rowClicks }}；关闭事件：{{ closeType }}</p>
</template>
