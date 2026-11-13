<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingImagePreview, type BingImagePreviewProps, type BingImagePreviewCloseReason, type BingImagePreviewDownloadPayload, type BingImagePreviewItem } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const previewItems: BingImagePreviewItem[] = [
  {
    src: createSvgImage('Preview 01', '#fee2e2', '#fb7185', '#7f1d1d'),
    alt: '预览图片一',
    caption: '第一张图片：横向封面图。',
    downloadName: 'preview-01.svg',
  },
  {
    src: createSvgImage('Preview 02', '#dbeafe', '#60a5fa', '#1e3a8a'),
    alt: '预览图片二',
    caption: '第二张图片：用于测试切换和计数器。',
    downloadName: 'preview-02.svg',
  },
  {
    src: createSvgImage('Preview 03', '#ede9fe', '#a78bfa', '#312e81', 'portrait'),
    alt: '预览图片三',
    caption: '第三张图片：竖向图片会完整适配预览空间。',
    downloadName: 'preview-03.svg',
  },
]

// @docs-options:start
const options: BingImagePreviewProps = { "showToolbar": true, "showCounter": true, "downloadable": true, "loop": true, "closeOnEsc": true, "closeOnOverlay": true, "lockScroll": true }
// @docs-options:end
const open = ref(false)
const lastChangeText = ref('还没有切换')
const lastCloseReason = ref<BingImagePreviewCloseReason | '未关闭'>('未关闭')
const downloadCount = ref(0)
function handleChange(index: number, item: BingImagePreviewItem) { lastChangeText.value = (index + 1) + '：' + (item.caption || item.alt || item.src) }
function handleClose(reason: BingImagePreviewCloseReason) { lastCloseReason.value = reason }
function handleDownload(payload: BingImagePreviewDownloadPayload) { downloadCount.value += 1; lastChangeText.value = '下载：' + (payload.item.downloadName || payload.item.src) }

function createSvgImage(
  label: string,
  background: string,
  accent: string,
  text: string,
  mode: 'landscape' | 'portrait' = 'landscape',
) {
  const width = mode === 'portrait' ? 520 : 900
  const height = mode === 'portrait' ? 720 : 560
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="${background}"/>
  <circle cx="${width * 0.76}" cy="${height * 0.2}" r="${Math.min(width, height) * 0.22}" fill="${accent}" opacity="0.52"/>
  <circle cx="${width * 0.22}" cy="${height * 0.78}" r="${Math.min(width, height) * 0.28}" fill="${accent}" opacity="0.22"/>
  <path d="M0 ${height * 0.72} C ${width * 0.22} ${height * 0.44}, ${width * 0.5} ${height * 0.9}, ${width} ${height * 0.58} L ${width} ${height} L 0 ${height} Z" fill="${accent}" opacity="0.34"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="${text}" font-family="Maple Mono NF CN, Consolas, monospace" font-size="${Math.round(width / 12)}" font-weight="800">${label}</text>
</svg>`

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}
</script>

<template>
  <BingButton :throttle="false" @click="open = true">打开带事件的预览</BingButton>
  <p role="status">最后切换：{{ lastChangeText }}；关闭来源：{{ lastCloseReason }}；下载次数：{{ downloadCount }}</p>
  <BingImagePreview v-model="open" :items="previewItems" v-bind="options" ariaLabel="带事件的图片预览" @change="handleChange" @close="handleClose" @download="handleDownload" />
</template>
