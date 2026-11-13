<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingDialog, type BingDialogOverlayOrb } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const open = ref(false)
const customOrbs: BingDialogOverlayOrb[] = [
  { id: 'rose', color: '#fb7185', x: 24, y: 28, size: 320, opacity: .26, blur: 58, motionX: 64, motionY: 40, duration: 12 },
  { id: 'cyan', color: '#38bdf8', x: 78, y: 26, size: 300, opacity: .22, blur: 54, motionX: -72, motionY: 48, duration: 14 },
  { id: 'violet', color: '#a78bfa', x: 58, y: 78, size: 260, opacity: .2, blur: 60, motionX: 42, motionY: -56, duration: 16 },
]
</script>

<template>
  <BingButton variant="tertiary" :throttle="false" @click="open = true">打开氛围弹窗</BingButton>
  <BingDialog v-model="open" title="带氛围遮罩的弹窗" width="620px"
    :overlay-orbs="customOrbs" overlay-orbs-animated overlay-blur>
    <p>光圈提供背景氛围，按住标题栏的查看背景按钮可暂时隐藏面板与遮罩。</p>
  </BingDialog>
</template>
