<script setup lang="ts">
import { ref } from 'vue'
import { BingImage, type BingImageProps, type BingImageStatus, type BingImageLoadPayload, type BingImageStatusChangePayload } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

// @docs-options:start
const options: BingImageProps = {
  "width": "100%",
  "aspectRatio": "16 / 9",
  "fit": "cover",
  "position": "center",
  "radius": "lg",
  "block": true,
  "preview": true
}
// @docs-options:end
const photoSrc = createSvgImage('Bing Image', '#fef3c7', '#f472b6', '#1f2937')
const status = ref<BingImageStatus>('idle')
const dimensions = ref('等待图片加载')
function changed(payload: BingImageStatusChangePayload) { status.value = payload.status }
function loaded(payload: BingImageLoadPayload) { dimensions.value = payload.naturalWidth + ' × ' + payload.naturalHeight }

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
  <div class="stage">
    <BingImage :src="photoSrc" alt="组件封面图" v-bind="options" preview-aria-label="预览组件封面图" @status-change="changed" @load="loaded" />
    <p role="status">状态：{{ status }}；原始尺寸：{{ dimensions }}</p>
  </div>
</template>

<style scoped>
.stage { max-width: 620px; }
</style>
