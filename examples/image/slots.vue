<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingImage } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const brokenSrc = 'data:image/png;base64,bm90LWFuLWltYWdl'
const photoSrc = createSvgImage('Bing Image', '#fef3c7', '#f472b6', '#1f2937')
const src = ref(brokenSrc)
const failures = ref(0)

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
    <BingImage :src="src" alt="错误槽示例" width="100%" aspect-ratio="16 / 9" block radius="lg" @error="failures += 1">
      <template #error="{ src: failedSrc, retry }">
        <div class="error-content">
          <strong>图片没有加载成功</strong>
          <span>{{ failedSrc }}</span>
          <BingButton :throttle="false" @click.stop="retry">重试</BingButton>
        </div>
      </template>
    </BingImage>
    <p role="status">错误事件：{{ failures }}</p>
    <p>数据故意损坏，重试仍会失败；可切换有效图片验证恢复。</p>
    <BingButton :throttle="false" @click="src = photoSrc">使用有效图片</BingButton>
    <BingButton variant="secondary" :throttle="false" @click="src = brokenSrc">恢复错误示例</BingButton>
  </div>
</template>

<style scoped>
.stage { max-width: 620px; }
.error-content { display: grid; justify-items: center; gap: 12px; padding: 16px; }
.error-content span { overflow-wrap: anywhere; }
</style>
