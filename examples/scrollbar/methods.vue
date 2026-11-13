<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { BingButton, BingScrollbar, type BingScrollbarExpose } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const scrollbar = ref<BingScrollbarExpose | null>(null)
const count = ref(36)
const feedback = ref('等待调用')
function top() { scrollbar.value?.scrollTo(0); feedback.value = 'scrollTo(0)' }
function down() { scrollbar.value?.scrollBy(120); feedback.value = 'scrollBy(120)' }
function bottom() { scrollbar.value?.scrollTo({ top: 9999, behavior: 'smooth' }); feedback.value = '原生平滑滚动到底部' }
function stop() { scrollbar.value?.stop(); feedback.value = '停止组件插值' }
async function add() { count.value += 10; await nextTick(); scrollbar.value?.update(); feedback.value = '已追加并更新' }
function forwardWheel(event: WheelEvent) {
  feedback.value = `外部滚轮消费：${scrollbar.value?.handleWheel(event) ?? false}`
}
</script>

<template>
  <div class="forward" @wheel="forwardWheel">在这里使用滚轮，将事件转交给下方列表。</div>
  <BingScrollbar ref="scrollbar" height="260px" always ariaLabel="日志列表">
    <div class="logs"><p v-for="index in count" :key="index">{{ index }}：组件状态已同步。</p></div>
  </BingScrollbar>
  <div class="actions">
    <BingButton size="sm" :throttle="false" @click="top">顶部</BingButton>
    <BingButton size="sm" :throttle="false" @click="down">下移 120</BingButton>
    <BingButton size="sm" :throttle="false" @click="bottom">底部</BingButton>
    <BingButton size="sm" :throttle="false" @click="stop">停止组件插值</BingButton>
    <BingButton size="sm" :throttle="false" @click="add">追加并更新</BingButton>
  </div>
  <p role="status">{{ feedback }}</p>
</template>

<style scoped>
.forward { padding: 12px; border: 1px dashed var(--bing-border); }
.logs { padding: 10px; }
.logs p { margin: 0; padding: 12px; border-bottom: 1px solid var(--bing-border); }
.actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 12px; }
</style>
