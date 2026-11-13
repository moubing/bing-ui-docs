<script setup lang="ts">
import { BingAppSwitcherTransition, BingCodeBlock } from '@moubing/bing-ui'
import { useExamples } from './state'
const { examplesActive, panels, basicActive, basicCode } = useExamples()
</script>

<template>
  <div class="doc-example doc-example--stacked">
    <div class="doc-example__preview app-switcher-demo-stage">
      <p class="preview-label">实时预览</p>
      <ClientOnly v-if="examplesActive">
        <BingAppSwitcherTransition v-model="basicActive" :items="panels" ariaLabel="基础应用面板">
          <template #default="{ item, active }">
            <div
              class="app-switcher-panel"
              :inert="!active"
              :class="{ 'is-active': active }"
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
    </div>


  </div>

  <BingCodeBlock
      :code="basicCode"
      language="vue"
      title="代码示例"
      max-height="520px"
    />
</template>
