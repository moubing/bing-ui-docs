<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingDialog, type BingDialogProps, type BingDialogCloseReason } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

// @docs-options:start
const options: BingDialogProps = {
  "title": "发布组件文档",
  "width": "560px",
  "showFooter": true,
  "showClose": true,
  "showPeek": true,
  "lockScroll": true,
  "closeOnOverlay": true,
  "closeOnEsc": true,
  "closeOnConfirm": false,
  "confirmLoading": false,
  "confirmDisabled": false
}
// @docs-options:end
const open = ref(false)
const loading = ref(options.confirmLoading ?? false)
const lastCloseReason = ref<BingDialogCloseReason | '未关闭'>('未关闭')
const confirmCount = ref(0)
const cancelCount = ref(0)
function handleConfirm() { confirmCount.value += 1 }
function handleCancel() { cancelCount.value += 1 }
function handleClose(reason: BingDialogCloseReason) { lastCloseReason.value = reason }
</script>

<template>
  <BingButton :throttle="false" @click="open = true">打开弹窗</BingButton>
  <BingDialog v-model="open" v-bind="options" :confirm-loading="loading" cancel-text="稍后" confirm-text="确认发布"
    @confirm="handleConfirm" @cancel="handleCancel" @close="handleClose">
    <p>这里展示本地文档发布摘要，不会发送发布请求。</p>
    <ul><li>文档页：BingDialog</li><li>状态：等待确认</li><li>默认确认不会自动关闭</li></ul>
    <BingButton v-if="loading" variant="secondary" @click="loading = false">结束模拟加载</BingButton>
  </BingDialog>
  <p role="status">最后关闭：{{ lastCloseReason }}；confirm：{{ confirmCount }}；cancel：{{ cancelCount }}；状态：{{ open ? '已打开' : '已关闭' }}</p>
</template>
