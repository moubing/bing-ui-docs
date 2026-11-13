<script setup lang="ts">
import { BingScrollbar } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const items = Array.from({ length: 18 }, (_, index) => `滚动内容 ${index + 1}`)
</script>

<template>
  <p>可切换浏览器 100%、110%、125% 缩放后再滚动，比较组件惯性与原生滚动。</p>
  <div class="comparison">
    <div><p>组件平滑插值</p><BingScrollbar height="260px" :smooth="{ duration: 400, stepSize: 100, respectReducedMotion: true }" ariaLabel="平滑滚动示例">
      <p v-for="item in items" :key="item" class="row">{{ item }}</p>
    </BingScrollbar></div>
    <div><p>浏览器原生纵向滚动</p><BingScrollbar height="260px" :smooth="false" ariaLabel="原生滚动示例">
      <p v-for="item in items" :key="item" class="row">{{ item }}</p>
    </BingScrollbar></div>
  </div>
</template>

<style scoped>
.comparison { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr)); gap: 20px; }
.comparison > div { min-width: 0; }
.row { margin: 0 10px; padding: 18px 8px; border-bottom: 1px solid var(--bing-border); }
</style>
