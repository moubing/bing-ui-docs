<script setup lang="ts">
import { BingCarouselTransition, BingCodeBlock } from '@moubing/bing-ui'
import { useExamples } from './state'
const { examplesActive, panels, basicActive, basicCode } = useExamples()
</script>

<template>
  <div class="doc-example doc-example--stacked">
    <div class="doc-example__preview carousel-demo-stage">
      <p class="preview-label">实时预览</p>
      <ClientOnly v-if="examplesActive">
        <BingCarouselTransition v-model="basicActive" :items="panels" ariaLabel="基础轮播面板">
          <template #default="{ item, active }">
            <div
              class="carousel-panel"
              :inert="!active"
              :class="{ 'is-active': active }"
              :style="{ '--carousel-accent': String(item.accent) }"
            >
              <span class="carousel-panel__badge">{{ item.badge }}</span>
              <div>
                <p class="carousel-panel__label">{{ item.label }}</p>
                <h3>{{ item.title }}</h3>
                <p>{{ item.summary }}</p>
              </div>
            </div>
          </template>
        </BingCarouselTransition>
      </ClientOnly>
    </div>
  </div>

  <BingCodeBlock
      :code="basicCode"
      language="vue"
      title="代码示例"
      max-height="520px"
    />
</template>
