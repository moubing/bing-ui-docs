<script setup lang="ts">
import { BingAppSwitcherTransition, BingButton, BingCodeBlock } from '@moubing/bing-ui'
import { useExamples } from './state'
const { examplesActive, panels, slotActive, counts, increment, slotCode } = useExamples()
</script>

<template>
  <div class="doc-example doc-example--stacked">
    <div class="doc-example__preview app-switcher-demo-stage">
      <p class="preview-label">插槽与保留状态</p>
      <ClientOnly v-if="examplesActive">
        <BingAppSwitcherTransition v-model="slotActive" :items="panels" ariaLabel="插槽应用面板">
          <template #default="{ item, index, active, isAnimating }">
            <div class="app-switcher-panel" :inert="!active" :class="{ 'is-animating': isAnimating }">
              <div><p>第 {{ index + 1 }} 个面板</p><h3>{{ item.label }}</h3><p>{{ active ? '当前展示' : '后台保留' }} · {{ isAnimating ? '切换中' : '静止' }}</p></div>
              <BingButton :throttle="false" @click="increment(item.value)">{{ item.label }}计数：{{ counts[String(item.value)] ?? 0 }}</BingButton>
            </div>
          </template>
        </BingAppSwitcherTransition>
      </ClientOnly>
    </div>
  </div>

  <BingCodeBlock
    :code="slotCode"
    language="vue"
    title="插槽示例"
    max-height="420px"
  />
</template>
