<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingDialog, BingTooltip, type BingTooltipExpose } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const first = ref<BingTooltipExpose | null>(null)
const second = ref<BingTooltipExpose | null>(null)
const firstOpen = ref(false)
const secondOpen = ref(false)
const disabled = ref(false)
const events = ref<string[]>([])
const compositionMode = new URLSearchParams(location.search).has('composition')
const dialogOpen = ref(false)
const reads = ref(0)
function record(message: string) { events.value.push(message) }
</script>

<template>
  <div style="padding: 180px 40px; display: grid; gap: 30px">
    <BingTooltip id="first-tip" ref="first" v-model="firstOpen" trigger="manual" :disabled="disabled" :close-on-outside="false" content="第一条内容"
      @open="record(`A-open:${$event}`)" @close="record(`A-close:${$event}`)">
      <template #default="{ open }"><span id="first-visible">A 实际显示：{{ open }}</span></template>
    </BingTooltip>
    <BingTooltip id="second-tip" ref="second" v-model="secondOpen" trigger="manual" :close-on-outside="false" content="第二条内容"><span>B 锚点</span></BingTooltip>
    <div>
      <button type="button" @click="first?.show()">显示 A</button>
      <button type="button" @click="second?.show()">显示 B</button>
      <button type="button" @click="disabled = !disabled">切换 A 禁用</button>
    </div>
    <BingTooltip id="hover-tip" content="焦点和悬停提示" :open-delay="200" :close-delay="100"
      @open="record(`hover-open:${$event}`)" @close="record(`hover-close:${$event}`)">
      <template #default="{ triggerProps }"><button type="button" v-bind="triggerProps">焦点锚点</button></template>
    </BingTooltip>
    <BingTooltip id="unsynced-tip" :model-value="false" trigger="click" content="没有同步不会打开" @update:model-value="record(`request:${$event}`)">
      <button type="button">未同步锚点</button>
    </BingTooltip>
    <p id="state">{{ JSON.stringify({ firstOpen, secondOpen, disabled, events }) }}</p>
    <template v-if="compositionMode">
      <BingButton @click="dialogOpen = true">打开提示弹窗</BingButton>
      <BingDialog v-model="dialogOpen" title="提示组合">
        <BingTooltip id="dialog-tip" trigger="click">
          <template #default="{ triggerProps }"><button type="button" v-bind="triggerProps">查看字段说明</button></template>
          <template #content><p>字段可以稍后补充</p><BingButton @click="reads++">我已阅读</BingButton></template>
        </BingTooltip>
        <p id="dialog-reads">阅读次数：{{ reads }}</p>
      </BingDialog>
    </template>
  </div>
  <div style="position: fixed; top: 0; right: 0">
    <BingTooltip id="edge-tip" trigger="click" placement="top" :open-delay="0" :viewport-padding="12" content="贴近边缘时翻转并保持可见。">
      <button type="button">边缘锚点</button>
    </BingTooltip>
  </div>
</template>
