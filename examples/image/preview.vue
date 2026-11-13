<script setup lang="ts">
import { ref } from 'vue'
import { BingImage, type BingImagePreviewClosePayload } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const galleryItems = [
  {
    src: createSvgImage('Gallery 01', '#fee2e2', '#fb7185', '#7f1d1d'),
    alt: '图库图片一',
    caption: '图库图片一',
    downloadName: 'gallery-01.svg',
  },
  {
    src: createSvgImage('Gallery 02', '#dbeafe', '#60a5fa', '#1e3a8a'),
    alt: '图库图片二',
    caption: '图库图片二',
    downloadName: 'gallery-02.svg',
  },
  {
    src: createSvgImage('Gallery 03', '#dcfce7', '#4ade80', '#14532d'),
    alt: '图库图片三',
    caption: '图库图片三',
    downloadName: 'gallery-03.svg',
  },
]
const feedback = ref('等待打开图库')
function closed(payload: BingImagePreviewClosePayload) { feedback.value = '关闭原因：' + payload.reason }

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
  <circle cx="${width * 0.78}" cy="${height * 0.22}" r="${Math.min(width, height) * 0.2}" fill="${accent}" opacity="0.5"/>
  <circle cx="${width * 0.22}" cy="${height * 0.76}" r="${Math.min(width, height) * 0.28}" fill="${accent}" opacity="0.22"/>
  <path d="M0 ${height * 0.72} C ${width * 0.25} ${height * 0.48}, ${width * 0.45} ${height * 0.92}, ${width} ${height * 0.58} L ${width} ${height} L 0 ${height} Z" fill="${accent}" opacity="0.32"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="${text}" font-family="Maple Mono NF CN, Consolas, monospace" font-size="${Math.round(width / 12)}" font-weight="800">${label}</text>
</svg>`

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}
</script>

<template>
  <div class="gallery">
    <BingImage v-for="(item, index) in galleryItems" :key="item.src" :src="item.src" :alt="item.alt"
      :preview-items="galleryItems" :preview-initial-index="index" :preview-aria-label="'预览' + item.alt"
      preview preview-downloadable width="100%" aspect-ratio="4 / 3" block radius="lg"
      @preview-open="feedback = '打开：' + item.caption" @preview-close="closed" />
  </div>
  <p role="status">{{ feedback }}</p>
</template>

<style scoped>
.gallery { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 180px), 1fr)); gap: 16px; max-width: 960px; }
</style>
