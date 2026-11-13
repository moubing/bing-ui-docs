<script setup lang="ts">
import { BingCarouselTransition, BingButton, BingCodeBlock } from '@moubing/bing-ui'
import { useExamples } from './state'
const { examplesActive, panels, wheelActive, counts, increment, wheelCode } = useExamples()
</script>

<template>
  <div class="doc-example doc-example--stacked">
    <div class="doc-example__preview carousel-demo-stage">
      <p class="preview-label">横向滚动，边界不循环</p>
      <ClientOnly v-if="examplesActive">
        <BingCarouselTransition v-model="wheelActive" :items="panels" :loop="false" ariaLabel="滚轮轮播面板">
          <template #default="{ item, index, active, isAnimating }">
            <div class="carousel-panel" :inert="!active" :class="{ 'is-animating': isAnimating }">
              <div><p>第 {{ index + 1 }} 个面板</p><h3>{{ item.label }}</h3><p>{{ active ? '当前展示' : '后台保留' }} · {{ isAnimating ? '切换中' : '静止' }}</p></div>
              <BingButton :throttle="false" @click="increment(item.value)">{{ item.label }}计数：{{ counts[String(item.value)] ?? 0 }}</BingButton>
            </div>
          </template>
        </BingCarouselTransition>
      </ClientOnly>
    </div>
  </div>

  <BingCodeBlock
    :code="wheelCode"
    language="vue"
    title="滚轮场景"
    max-height="360px"
  />
</template>
