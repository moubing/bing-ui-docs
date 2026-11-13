<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingCard, type BingCardProps } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

// @docs-options:start
const options: BingCardProps = {
  "entrance": "fade-up",
  "entranceOnce": false,
  "entranceDuration": 0.72,
  "entranceDelay": 0
}
// @docs-options:end
const revision = ref(0)
const count = ref(0)
</script>

<template>
  <BingCard :key="revision" v-bind="options" title="入场动画" description="滚动进入视口或重新挂载时观察动画。"
    variant="accent" rounded="lg" @enter="count++">
    <p>这张卡片在进入视口时播放当前入场动画。</p>
  </BingCard>
  <BingButton size="sm" :throttle="false" @click="revision++">重新挂载</BingButton>
  <p role="status">进入次数：{{ count }}</p>
</template>
