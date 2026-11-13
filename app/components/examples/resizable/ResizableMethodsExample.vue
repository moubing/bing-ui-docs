<script setup lang="ts">
import { BingButton, BingCodeBlock, BingResizable } from '@moubing/bing-ui'
import { useExamples } from './state'
const { apiResizableRef, apiSize, resetApiPanel, readApiPanel, exposeCode } = useExamples()
</script>

<template>
  <div class="doc-example">
    <div class="doc-example__preview resizable-demo-stage">
      <div class="resizable-canvas-scroll"><div class="resizable-api-stage">
        <ClientOnly>
          <BingResizable
            ref="apiResizableRef"
            :default-size="{ width: 300, height: 170 }"
            :default-position="{ x: 26, y: 24 }"
            show-size
            aria-label="可读取尺寸的面板"
          >
            <div class="resizable-panel-content">
              <strong>Expose</strong>
              <span>调用 getSize、getPosition 或 reset。</span>
            </div>
          </BingResizable>
        </ClientOnly>
      </div></div>

      <div class="toast-action-row">
        <BingButton size="sm" :throttle="false" @click="readApiPanel">读取尺寸</BingButton>
        <BingButton size="sm" variant="ghost" :throttle="false" @click="resetApiPanel">重置</BingButton>
      </div>

      <p class="resizable-feedback">
        <span>{{ apiSize }}</span>
      </p>
    </div>

    <div class="doc-example__controls">
      <p>
        <code>reset()</code> 会触发 <code>update:size</code> 和 <code>update:position</code>，因此外部状态也能收到重置后的值。
      </p>
    </div>
  </div>

  <BingCodeBlock :code="exposeCode" language="vue" title="代码示例" wrap />
</template>
