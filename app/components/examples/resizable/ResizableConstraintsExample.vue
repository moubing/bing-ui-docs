<script setup lang="ts">
import { BingCodeBlock, BingResizable } from '@moubing/bing-ui'
import { useExamples } from './state'
const { constraintCode } = useExamples()
</script>

<template>
  <div class="doc-example">
    <div class="doc-example__preview resizable-demo-stage">
      <div class="resizable-canvas-scroll"><div class="resizable-contained-stage">
        <ClientOnly>
          <BingResizable
            contain
            lock-aspect-ratio
            :directions="['right', 'bottom', 'bottom-right']"
            :default-size="{ width: 320, height: 180 }"
            :default-position="{ x: 24, y: 24 }"
            :min-width="220"
            :max-width="520"
            :step="12"
            snap-mode="end"
            show-size
            aria-label="比例锁定并限制在父容器内"
          >
            <div class="resizable-panel-content">
              <strong>16:9 preview</strong>
              <span>保持比例，限制在父容器内。</span>
            </div>
          </BingResizable>
        </ClientOnly>
      </div></div>
    </div>

    <div class="doc-example__controls">
      <p>
        <code>snapMode="end"</code> 适合拖拽时需要更顺滑、松手后再对齐网格的场景。
      </p>
    </div>
  </div>

  <BingCodeBlock :code="constraintCode" language="vue" title="代码示例" wrap />
</template>
