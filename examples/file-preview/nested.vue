<script setup lang="ts">
import { onDeactivated, ref } from 'vue'
import { BingButton, BingDialog, BingFilePreview, BingImagePreview } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const open = ref(false)
const fileOpen = ref(false)
const imageOpen = ref(false)
const image = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><rect width="800" height="500" fill="#e4e4e7"/><circle cx="400" cy="250" r="120" fill="#71717a"/></svg>')
onDeactivated(() => { imageOpen.value = false; fileOpen.value = false; open.value = false })
</script>

<template>
  <BingButton @click="open = true">查看项目附件</BingButton>
  <BingDialog v-model="open" title="项目附件" :show-footer="false">
    <p>打开附件后按 Escape 返回此弹窗，再按一次关闭弹窗。</p>
    <div class="attachment-actions">
      <BingButton @click="fileOpen = true">预览说明文件</BingButton>
      <BingButton @click="imageOpen = true">预览示意图片</BingButton>
    </div>
    <BingFilePreview v-model="fileOpen" :file="{ name: '项目说明.txt', type: 'text', content: '关闭此预览后，焦点会回到项目附件中的打开按钮。' }" :downloadable="false" :openable="false" ariaLabel="项目说明预览" />
    <BingImagePreview v-model="imageOpen" :items="[{ src: image, alt: '项目示意图' }]" :downloadable="false" ariaLabel="项目图片预览" />
  </BingDialog>
</template>

<style scoped>
.attachment-actions { display: flex; flex-wrap: wrap; gap: 12px; }
</style>
