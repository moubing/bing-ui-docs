<script setup lang="ts">
import { ref } from 'vue'
import { BingRadio, BingRadioGroup } from '@moubing/bing-ui'
import type { BingRadioValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const mode = ref<BingRadioValue | null>('compact')
const eventLog = ref('等待组内变化')
function handleGroupChange(value: BingRadioValue, event: Event) {
  eventLog.value = `Group change：${String(value)}；原始事件：${event.type}`
}
</script>

<template>
  <BingRadioGroup id="display-mode" v-model="mode" direction="column" name="display-mode" ariaLabel="展示方案" @change="handleGroupChange">
    <BingRadio id="display-mode-default" value="default">
      <span class="rich-option"><strong>默认方案</strong><span>适合大多数页面。</span></span>
    </BingRadio>
    <BingRadio id="display-mode-compact" value="compact">
      <span class="rich-option"><strong>紧凑方案</strong><span>适合信息密度更高的面板。</span></span>
    </BingRadio>
    <BingRadio id="display-mode-immersive" value="immersive">
      <span class="rich-option"><strong>沉浸方案</strong><span>适合展示型页面。</span></span>
    </BingRadio>
  </BingRadioGroup>
  <p role="status">当前方案：{{ mode }}；{{ eventLog }}</p>
</template>

<style scoped>
.rich-option { display: grid; gap: 4px; }
.rich-option > span { font-size: 13px; opacity: .7; }
</style>
