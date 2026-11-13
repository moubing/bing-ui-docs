<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingDialog, type BingDialogCloseReason } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const open = ref(false)
const events = ref<string[]>([])
function update(value: boolean) { events.value.push(`update:${value}`); open.value = value }
function closed(reason: BingDialogCloseReason) { events.value.push(`close:${reason}`) }
</script>

<template>
  <BingButton :throttle="false" @click="open = true; events = []">打开关闭行为示例</BingButton>
  <BingDialog :model-value="open" title="关闭行为"
    :close-on-overlay="false" :close-on-esc="false" close-on-confirm
    @update:model-value="update" @close="closed"
    @confirm="events.push('confirm')" @cancel="events.push('cancel')">
    <p>遮罩点击和 Escape 不会关闭；确认会依次发出 confirm、update:false 和 close:confirm。</p>
    <BingButton variant="secondary" @click="open = false">直接设置模型关闭</BingButton>
  </BingDialog>
  <p role="status">状态：{{ open ? '已打开' : '已关闭' }}；事件：{{ events.join(' → ') || '无' }}</p>
</template>
