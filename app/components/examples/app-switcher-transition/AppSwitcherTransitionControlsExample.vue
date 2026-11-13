<script setup lang="ts">
import { BingRadio, BingAppSwitcherTransition, BingCheckbox, BingCodeBlock, BingRadioGroup } from '@moubing/bing-ui'
import { useExamples } from './state'
const { examplesActive, panels, panelOptions, playgroundActive, playgroundDisabled, playgroundLoop, playgroundShowTabs, playgroundRespectReducedMotion, changeLog, selectedPanel, updatePlaygroundActive, handleChange, playgroundCode } = useExamples()
</script>

<template>
  <div class="doc-example">
    <div class="doc-example__preview app-switcher-demo-stage">
      <p class="preview-label">实时预览</p>
      <ClientOnly v-if="examplesActive">
        <BingAppSwitcherTransition
          v-model="playgroundActive"
          :items="panels"
          :disabled="playgroundDisabled"
          :loop="playgroundLoop"
          :show-tabs="playgroundShowTabs"
          :respect-reduced-motion="playgroundRespectReducedMotion"
          aria-label="应用面板切换"
          @change="handleChange"
        >
          <template #default="{ item, active, isAnimating }">
            <div
              class="app-switcher-panel app-switcher-panel--compact"
              :inert="!active"
              :class="{ 'is-active': active, 'is-animating': isAnimating }"
              :style="{ '--app-switcher-accent': String(item.accent) }"
            >
              <span class="app-switcher-panel__metric">{{ item.metric }}</span>
              <div>
                <p class="app-switcher-panel__label">{{ item.label }}</p>
                <h3>{{ item.title }}</h3>
                <p>{{ item.summary }}</p>
              </div>
            </div>
          </template>
        </BingAppSwitcherTransition>
      </ClientOnly>

      <p class="app-switcher-feedback">
        <span>当前面板：{{ selectedPanel?.label }}</span><span>change：{{ changeLog }}</span>
      </p>
    </div>

    <div class="doc-example__controls">
      <div class="control-group">
        <p class="control-label">外部切换</p>
        <BingRadioGroup id="app-switcher-transition-control-1" name="app-switcher-transition-control-1"
          :model-value="playgroundActive"
          direction="column"
          size="sm"
          aria-label="选择应用面板"
          @update:model-value="updatePlaygroundActive">
          <BingRadio v-for="option in panelOptions" :id="`app-switcher-transition-control-1-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
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
