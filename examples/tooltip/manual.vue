<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { BingButton, BingTooltip, type BingTooltipExpose, type BingTooltipOpenReason, type BingTooltipCloseReason } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const tooltip = ref<BingTooltipExpose | null>(null)
const open = ref(false)
const shifted = ref(false)
const feedback = ref('等待手动控制')
function opened(reason: BingTooltipOpenReason) { feedback.value = `打开：${reason}` }
function closed(reason: BingTooltipCloseReason) { feedback.value = `关闭：${reason}` }
async function move() { shifted.value = !shifted.value; await nextTick(); tooltip.value?.updatePosition() }
</script>

<template>
  <div class="stage">
    <div :style="{ marginLeft: shifted ? '80px' : '0px' }">
      <BingTooltip id="manual-tooltip" ref="tooltip" v-model="open" trigger="manual" :close-on-outside="false"
        content="这个提示由外部按钮控制。" @open="opened" @close="closed">
        <span>被控制的锚点</span>
      </BingTooltip>
    </div>
    <div class="actions">
      <BingButton :throttle="false" @click="tooltip?.show('manual')">打开</BingButton>
      <BingButton :throttle="false" @click="tooltip?.toggle('manual')">切换</BingButton>
      <BingButton :throttle="false" @click="tooltip?.hide('manual')">关闭</BingButton>
      <BingButton :throttle="false" @click="move">移动并重新定位</BingButton>
    </div>
    <p role="status">{{ open ? '已打开' : '已关闭' }}；{{ feedback }}</p>
  </div>
</template>

<style scoped>
.stage { padding: 110px 20px; text-align: center; }
.actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin-top: 40px; }
</style>
