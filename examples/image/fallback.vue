<script setup lang="ts">
import { ref } from 'vue'
import { BingImage, type BingImageStatus, type BingImageErrorPayload, type BingImageStatusChangePayload } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

// 故意损坏的图片数据，无需准备不存在的本地文件。
const brokenSrc = 'data:image/png;base64,bm90LWFuLWltYWdl'
const placeholderSrc = createSvgImage('Loading', '#e0f2fe', '#93c5fd', '#475569')
const fallbackSrc = createSvgImage('Fallback', '#dcfce7', '#34d399', '#14532d')
const status = ref<BingImageStatus>('idle')
const failures = ref<string[]>([])
function changed(payload: BingImageStatusChangePayload) { status.value = payload.status }
function failed(payload: BingImageErrorPayload) { failures.value.push(payload.isFallback ? '回退图失败' : '主图失败') }

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
    <BingImage :src="brokenSrc" :fallback-src="fallbackSrc" :placeholder-src="placeholderSrc"
      alt="带回退图的示例" width="100%" aspect-ratio="16 / 9" radius="lg" block error-text="图片加载失败"
      @status-change="changed" @error="failed" />
    <p role="status">状态：{{ status }}；错误事件：{{ failures.length }}；{{ failures.join(' → ') }}</p>
  </div>
</template>

<style scoped>
.stage { max-width: 620px; }
</style>
