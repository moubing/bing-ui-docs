<script setup lang="ts">
import { BingButton, BingCodeBlock, BingDeckTransition } from '@moubing/bing-ui'
import { useExamples } from './state'
const { examplesActive, cards, controlsActive, controlsCode } = useExamples()
</script>

<template>
  <div class="doc-example doc-example--stacked">
      <div class="doc-example__preview deck-demo-stage">
        <p class="preview-label">自定义控制与非循环边界</p>
        <ClientOnly v-if="examplesActive">
          <BingDeckTransition v-model="controlsActive" :items="cards" :loop="false" class="docs-deck-transition">
            <template #default="{ item, active }"><div class="deck-story-panel" :inert="!active"><span class="deck-story-panel__orb">{{ item.label }}</span><h3>{{ item.title }}</h3><p>{{ item.summary }}</p></div></template>
            <template #controls="{ next, activeItem, activeIndex, isAnimating }">
              <div class="deck-control-row"><BingButton :throttle="false" :disabled="isAnimating || activeIndex >= cards.length - 1" @click="next">下一张</BingButton><span>{{ activeItem?.label }} / {{ activeIndex + 1 }}</span></div>
            </template>
          </BingDeckTransition>
        </ClientOnly>
        <BingButton :throttle="false" @click="controlsActive = 'plan'">返回第一张</BingButton>
      </div>
    </div>

  <BingCodeBlock
      :code="controlsCode"
      language="vue"
      title="controls 插槽"
      max-height="520px"
    />
</template>
