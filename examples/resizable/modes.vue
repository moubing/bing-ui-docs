<script setup lang="ts">
import { BingResizable, type BingResizableMode } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const modes: BingResizableMode[] = ['fixed', 'mirror']
</script>

<template>
  <div style="max-width: 100%; overflow: auto; padding: 12px">
    <div style="display: flex; gap: 30px; width: 740px">
      <div v-for="mode in modes" :key="mode" style="position: relative; width: 350px; height: 280px; border: 1px dashed var(--bing-border)">
        <BingResizable :mode="mode" :default-size="{ width: 250, height: 150 }" :default-position="{ x: 40, y: 40 }"
          :directions="['right', 'bottom', 'bottom-right']" show-size :ariaLabel="`${mode} 模式示例`">
          <div style="padding: 24px"><strong>{{ mode }}</strong><p>{{ mode === 'fixed' ? '对边保持稳定' : '围绕中心缩放' }}</p></div>
        </BingResizable>
      </div>
    </div>
  </div>
</template>
