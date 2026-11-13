<script setup lang="ts">
import { ref } from 'vue'
import { BingAnimatedText, BingButton, type BingAnimatedTextExpose } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const count = ref(15)
const uploaded = ref(0)
const manual = ref<BingAnimatedTextExpose | null>(null)
</script>

<template>
  <div class="motion-demo">
    <BingAnimatedText effect="shimmer">正在同步内容</BingAnimatedText>
    <div class="row">
      <BingButton variant="secondary" ariaLabel="减少未读" @click="count = Math.max(0, count - 1)">−</BingButton>
      <BingButton variant="secondary" ariaLabel="增加未读" @click="count++">+</BingButton>
      <span role="status"><BingAnimatedText swap>{{ count }} 条未读消息</BingAnimatedText></span>
    </div>
    <div class="row">
      <BingButton variant="tertiary" @click="uploaded++">模拟上传</BingButton>
      <span role="status"><BingAnimatedText swap>{{ uploaded ? uploaded + ' 个文件已上传' : '等待上传' }}</BingAnimatedText></span>
    </div>
    <button class="motion-trigger" type="button" @click="manual?.play($event)">
      <BingAnimatedText ref="manual" effect="jump" trigger="hover" hover-target=".motion-trigger">悬停、聚焦或点击播放</BingAnimatedText>
    </button>
  </div>
</template>

<style scoped>
.motion-demo { display: grid; gap: 24px; }
.row { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
.motion-trigger { padding: 20px; color: inherit; background: transparent; border: 1px solid currentColor; border-radius: 12px; font: inherit; cursor: pointer; }
</style>
