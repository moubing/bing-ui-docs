<script setup lang="ts">
import { onBeforeUnmount } from 'vue'
import { BING_TOAST_POSITION_OPTIONS, BingButton, BingToast, bingToast, type BingToastPosition } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const ownedIds = new Set<string>()
function show(position: BingToastPosition) {
  ownedIds.add(bingToast.success({ message: `位置：${position}`, position, duration: 0, ariaLabel: position }))
}
onBeforeUnmount(() => ownedIds.forEach(id => bingToast.close(id)))
</script>

<template>
  <div class="actions">
    <BingButton v-for="position in BING_TOAST_POSITION_OPTIONS" :key="position" :throttle="false" @click="show(position)">{{ position }}</BingButton>
    <BingButton :throttle="false" @click="bingToast.clear('top-center')">清空顶部中央</BingButton>
    <BingButton :throttle="false" @click="bingToast.clear()">清空全部</BingButton>
  </div>
  <p>max=2 只限制视觉深度，所有消息仍保留在队列和滚动区域中。</p>
  <BingToast viewport-position="all" :max="2" />
</template>

<style scoped>
.actions { display: flex; gap: 10px; flex-wrap: wrap; max-width: 440px; margin: 140px auto 24px; }
</style>
