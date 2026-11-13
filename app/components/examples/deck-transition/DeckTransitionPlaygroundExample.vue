<script setup lang="ts">
import { BingRadio, BingButton, BingCheckbox, BingCodeBlock, BingDeckTransition, BingRadioGroup } from '@moubing/bing-ui'
import { useExamples } from './state'
const { examplesActive, cards, cardOptions, playgroundActive, playgroundLoop, playgroundShowControls, playgroundReducedMotion, playgroundDisabled, changeLog, activeCard, updatePlaygroundActive, handleChange, playgroundCode } = useExamples()
</script>

<template>
  <div class="doc-example">
    <div class="doc-example__preview deck-demo-stage">
      <p class="preview-label">实时预览</p>
      <ClientOnly v-if="examplesActive">
        <BingDeckTransition
          v-model="playgroundActive"
          class="docs-deck-transition"
          :items="cards"
          :disabled="playgroundDisabled"
          :loop="playgroundLoop"
          :show-controls="playgroundShowControls"
          :respect-reduced-motion="playgroundReducedMotion"
          @change="handleChange"
        >
          <template #default="{ item, active, isAnimating }">
            <div
              class="deck-story-panel"
              :inert="!active"
              :class="{ 'is-active': active, 'is-animating': isAnimating }"
              :style="{ '--deck-accent': String(item.accent) }"
            >
              <span class="deck-story-panel__orb">{{ item.label }}</span>
              <h3>{{ item.title }}</h3>
              <p>{{ item.summary }}</p>
            </div>
          </template>

          <template #controls="{ next, activeItem, activeIndex, isAnimating }">
            <div class="deck-control-row">
              <BingButton size="sm" :disabled="isAnimating || playgroundDisabled" @click="next">
                下一张
              </BingButton>
              <span>{{ activeItem?.label }} / {{ activeIndex + 1 }}</span>
            </div>
          </template>
        </BingDeckTransition>
      </ClientOnly>

      <p class="deck-feedback">
        <span>当前卡片：{{ activeCard?.label }}</span><span>change：{{ changeLog }}</span>
      </p>
    </div>

    <div class="doc-example__controls">
      <div class="control-group">
        <p class="control-label">外部定位</p>
        <BingRadioGroup id="deck-transition-control-1" name="deck-transition-control-1"
          :model-value="playgroundActive"
          direction="column"
          size="sm"
          aria-label="选择卡片"
          @update:model-value="updatePlaygroundActive">
          <BingRadio v-for="option in cardOptions" :id="`deck-transition-control-1-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>

      <BingCheckbox v-model="playgroundLoop" label="允许循环" />
      <BingCheckbox v-model="playgroundShowControls" label="显示控制区" />
      <BingCheckbox v-model="playgroundReducedMotion" label="遵守 reduced motion" />
      <BingCheckbox v-model="playgroundDisabled" label="禁用卡组" />
    </div>
  </div>

  <BingCodeBlock
      :code="playgroundCode"
      language="vue"
      title="代码示例"
      max-height="520px"
    />
</template>
