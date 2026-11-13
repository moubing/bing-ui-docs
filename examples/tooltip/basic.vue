<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingTooltip, type BingTooltipProps, type BingTooltipOpenReason, type BingTooltipCloseReason } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

// @docs-options:start
const options: BingTooltipProps = {
  "content": "斜体",
  "trigger": "click",
  "placement": "top",
  "align": "center",
  "openDelay": 0,
  "closeDelay": 80,
  "offset": 10,
  "maxWidth": 280,
  "interactive": true,
  "disabled": false,
  "closeOnOutside": true,
  "closeOnEsc": true
}
// @docs-options:end
const open = ref(false)
const feedback = ref('等待操作')
function opened(reason: BingTooltipOpenReason) { feedback.value = `打开：${reason}` }
function closed(reason: BingTooltipCloseReason) { feedback.value = `关闭：${reason}` }
</script>

<template>
  <div class="stage">
    <BingTooltip id="basic-tooltip" v-model="open" v-bind="options" @open="opened" @close="closed">
      <template #default="{ triggerProps }">
        <button type="button" class="anchor" v-bind="triggerProps"
         >查看提示</button>
      </template>
    </BingTooltip>
    <BingButton v-if="options.trigger === 'manual'" :throttle="false" @click="open = !open">手动切换</BingButton>
    <p role="status">{{ open ? '已打开' : '已关闭' }}；{{ feedback }}</p>
  </div>
</template>

<style scoped>
.stage { padding: 110px 20px; text-align: center; }
.anchor { padding: 10px 16px; border: 1px solid var(--bing-border); border-radius: 8px; color: inherit; background: transparent; font: inherit; cursor: pointer; }
</style>
