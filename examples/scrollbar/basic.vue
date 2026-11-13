<script setup lang="ts">
import { ref } from 'vue'
import { BingScrollbar, type BingScrollbarProps } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

// @docs-options:start
const options: BingScrollbarProps = {
  "height": "300px",
  "minThumbSize": 28,
  "overflowTolerance": 1,
  "vertical": true,
  "horizontal": false,
  "always": true,
  "disabled": false
}
// @docs-options:end
const items = Array.from({ length: 18 }, (_, index) => ({
  id: index + 1, title: `交互层 ${index + 1}`,
  description: index % 2 === 0 ? '动效反馈和状态展示。' : '稳定的结构内容区域。',
}))
const feedback = ref('等待滚动')
function handleScroll(event: Event) {
  const viewport = event.currentTarget as HTMLElement
  feedback.value = `scrollTop: ${Math.round(viewport.scrollTop)} / scrollLeft: ${Math.round(viewport.scrollLeft)}`
}
</script>

<template>
  <BingScrollbar v-bind="options" ariaLabel="组件列表" @scroll="handleScroll">
    <div class="list"><article v-for="item in items" :key="item.id"><strong>{{ item.title }}</strong><span>{{ item.description }}</span></article></div>
  </BingScrollbar>
  <p role="status">{{ feedback }}</p>
</template>

<style scoped>
.list { display: grid; gap: 8px; padding: 10px; }
article { display: grid; gap: 4px; padding: 14px; border: 1px solid var(--bing-border); border-radius: 8px; }
</style>
