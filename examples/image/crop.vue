<script setup lang="ts">
import { BingImage } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const photoSrc = createSvgImage('Bing Image', '#fef3c7', '#f472b6', '#1f2937')
const portraitSrc = createSvgImage('Portrait', '#ede9fe', '#a78bfa', '#312e81', 'portrait')

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
  <div class="grid">
    <BingImage :src="photoSrc" alt="cover 示例" fit="cover" position="center" aspect-ratio="16 / 9" block radius="lg" />
    <BingImage :src="photoSrc" alt="contain 示例" fit="contain" aspect-ratio="16 / 9" block radius="lg" />
    <BingImage :src="portraitSrc" alt="portrait 示例" fit="cover" position="top" aspect-ratio="3 / 4" block radius="lg" />
  </div>
</template>

<style scoped>
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr)); gap: 16px; max-width: 1000px; align-items: start; }
</style>
