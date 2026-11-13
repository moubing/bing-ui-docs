<script setup lang="ts">
import { BingButton, BingCodeBlock, BingTooltip } from '@moubing/bing-ui'
import { useExamples } from './state'
const { examplesActive, manualTooltip, manualOpen, manualEventLog, showManualTooltip, hideManualTooltip, toggleManualTooltip, handleManualOpen, handleManualClose, manualCode } = useExamples()
</script>

<template>
  <div class="doc-example">
    <div class="doc-example__preview tooltip-demo-stage">
      <ClientOnly v-if="examplesActive">
        <BingTooltip
          ref="manualTooltip"
          v-model="manualOpen"
          trigger="manual"
          :close-on-outside="false"
          content="这个提示只由外部按钮控制，锚点本身不会触发打开。"
          placement="top"
          @open="handleManualOpen"
          @close="handleManualClose"
        >
          <span class="tooltip-passive-anchor">被控制的锚点</span>
        </BingTooltip>

        <div class="tooltip-action-row">
          <BingButton size="sm" :throttle="false" @click="showManualTooltip">打开</BingButton>
          <BingButton size="sm" variant="secondary" :throttle="false" @click="toggleManualTooltip">切换</BingButton>
          <BingButton size="sm" variant="ghost" :throttle="false" @click="hideManualTooltip">关闭</BingButton>
        </div>
      </ClientOnly>

      <p class="tooltip-feedback">
        <span>{{ manualEventLog }}</span><span>状态：{{ manualOpen ? '已打开' : '已关闭' }}</span>
      </p>
    </div>

    <div class="doc-example__controls">
      <p>
        手动模式下仍会维护 <code>aria-controls</code> 和 <code>aria-expanded</code>。如果锚点或浮层内容尺寸在打开后发生变化，可以调用 <code>updatePosition()</code> 重新定位。
      </p>
    </div>
  </div>

  <BingCodeBlock :code="manualCode" language="vue" title="代码示例" wrap />
</template>
