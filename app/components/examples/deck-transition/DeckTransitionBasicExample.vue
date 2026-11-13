<script setup lang="ts">
import { BingCodeBlock, BingDeckTransition } from '@moubing/bing-ui'
import { useExamples } from './state'
const { examplesActive, cards, basicActive, basicCode } = useExamples()
</script>

<template>
  <div class="doc-example doc-example--stacked">
    <div class="doc-example__preview deck-demo-stage">
      <p class="preview-label">实时预览</p>
      <ClientOnly v-if="examplesActive">
        <BingDeckTransition
          v-model="basicActive"
          class="docs-deck-transition"
          :items="cards"
        >
          <template #default="{ item, active }">
            <div
              class="deck-story-panel"
              :inert="!active"
              :class="{ 'is-active': active }"
              :style="{ '--deck-accent': String(item.accent) }"
            >
              <span class="deck-story-panel__orb">{{ item.label }}</span>
              <h3>{{ item.title }}</h3>
              <p>{{ item.summary }}</p>
            </div>
          </template>
        </BingDeckTransition>
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
