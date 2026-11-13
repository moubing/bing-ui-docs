<script setup lang="ts">
import { BingRadio, BingCarouselTransition, BingCheckbox, BingCodeBlock, BingRadioGroup } from '@moubing/bing-ui'
import { useExamples } from './state'
const { examplesActive, panels, panelOptions, playgroundActive, playgroundDisabled, playgroundLoop, playgroundShowTabs, playgroundRespectReducedMotion, changeLog, selectedPanel, updatePlaygroundActive, handleChange, playgroundCode } = useExamples()
</script>

<template>
  <div class="doc-example">
    <div class="doc-example__preview carousel-demo-stage">
      <p class="preview-label">实时预览</p>
      <ClientOnly v-if="examplesActive">
        <BingCarouselTransition
          v-model="playgroundActive"
          :items="panels"
          :disabled="playgroundDisabled"
          :loop="playgroundLoop"
          :show-tabs="playgroundShowTabs"
          :respect-reduced-motion="playgroundRespectReducedMotion"
          aria-label="轮播面板切换"
          @change="handleChange"
        >
          <template #default="{ item, active, isAnimating }">
            <div
              class="carousel-panel carousel-panel--compact"
              :inert="!active"
              :class="{ 'is-active': active, 'is-animating': isAnimating }"
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

      <p class="carousel-feedback">
        <span>当前面板：{{ selectedPanel?.label }}</span><span>change：{{ changeLog }}</span>
      </p>
    </div>

    <div class="doc-example__controls">
      <div class="control-group">
        <p class="control-label">外部切换</p>
        <BingRadioGroup id="carousel-transition-control-1" name="carousel-transition-control-1"
          :model-value="playgroundActive"
          direction="column"
          size="sm"
          aria-label="选择轮播面板"
          @update:model-value="updatePlaygroundActive">
          <BingRadio v-for="option in panelOptions" :id="`carousel-transition-control-1-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>

      <BingCheckbox v-model="playgroundShowTabs" label="显示内置 tabs" />
      <BingCheckbox v-model="playgroundLoop" label="允许循环切换" />
      <BingCheckbox v-model="playgroundRespectReducedMotion" label="遵守 reduced motion" />
      <BingCheckbox v-model="playgroundDisabled" label="禁用切换器" />
    </div>
  </div>

  <BingCodeBlock
    :code="playgroundCode"
    language="vue"
    title="代码示例"
    max-height="520px"
  />
</template>
