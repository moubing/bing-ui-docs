<script setup lang="ts">
import { BingResizable } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
</script>

<template>
  <div style="max-width: 100%; overflow: auto; padding: 12px">
    <div style="position: relative; width: 620px; height: 350px; border: 1px dashed var(--bing-border)">
      <BingResizable contain lock-aspect-ratio :directions="['right', 'bottom', 'bottom-right']"
        :default-size="{ width: 320, height: 180 }" :default-position="{ x: 24, y: 24 }"
        :min-width="220" :max-width="520" :step="12" snap-mode="end" show-size ariaLabel="比例锁定面板">
        <div style="padding: 24px"><strong>16:9 preview</strong><p>保持比例，在预留足够空间的父容器中调整。</p></div>
      </BingResizable>
    </div>
  </div>
</template>
