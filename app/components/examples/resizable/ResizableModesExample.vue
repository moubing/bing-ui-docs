<script setup lang="ts">
import { BingCodeBlock, BingResizable } from '@moubing/bing-ui'
import { useExamples } from './state'
const { modesCode } = useExamples()
</script>

<template>
  <div class="doc-example">
    <div class="doc-example__preview resizable-demo-stage">
      <div class="resizable-canvas-scroll"><div class="resizable-mode-grid">
        <ClientOnly>
          <BingResizable
            :default-size="{ width: 250, height: 150 }"
            :directions="['right', 'bottom', 'bottom-right']"
            show-size
            aria-label="fixed 模式示例"
          >
            <div class="resizable-panel-content">
              <strong>fixed</strong>
              <span>对边保持稳定。</span>
            </div>
          </BingResizable>

          <BingResizable
            mode="mirror"
            :default-size="{ width: 250, height: 150 }"
            :directions="['right', 'bottom', 'bottom-right']"
            show-size
            aria-label="mirror 模式示例"
          >
            <div class="resizable-panel-content">
              <strong>mirror</strong>
              <span>围绕中心缩放。</span>
            </div>
          </BingResizable>
        </ClientOnly>
      </div></div>
    </div>

    <div class="doc-example__controls">
      <p>
        如果内容需要固定左上角，使用 <code>fixed</code>；如果内容是中心预览画布、缩放时希望保持中心稳定，使用 <code>mirror</code>。
      </p>
    </div>
  </div>

  <BingCodeBlock :code="modesCode" language="vue" title="代码示例" wrap />
</template>
