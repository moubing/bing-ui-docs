<script setup lang="ts">
import { ref } from 'vue'
import { BingImagePreview, BingImage, type BingImagePreviewItem } from '@moubing/bing-ui'
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

const open = ref(false)
const currentIndex = ref(0)
function openGallery(index: number) { currentIndex.value = index; open.value = true }

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
  <div class="gallery">
    <button v-for="(item, index) in previewItems" :key="item.src" type="button" class="thumb" :aria-label="item.alt" @click="openGallery(index)">
      <BingImage :src="item.src" :alt="item.alt" width="100%" aspect-ratio="4 / 3" block radius="lg" />
      <span>{{ item.caption }}</span>
    </button>
  </div>
  <p role="status">当前索引：{{ currentIndex }}</p>
  <BingImagePreview v-model="open" v-model:current-index="currentIndex" :items="previewItems" ariaLabel="受控图片预览" />
</template>

<style scoped>
.gallery { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 180px), 1fr)); gap: 14px; max-width: 960px; }
.thumb { display: grid; gap: 8px; min-width: 0; border: 0; padding: 0; background: transparent; color: inherit; text-align: left; cursor: pointer; }
.thumb:focus-visible { outline: 3px solid #a78bfa; outline-offset: 4px; }
</style>
