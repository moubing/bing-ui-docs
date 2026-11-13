<script setup lang="ts">
import { BingCodeBlock } from '@moubing/bing-ui'
import { useExamples } from './state'
const { longCode, resizableCode } = useExamples()
</script>

<template>
  <div class="doc-example doc-example--stacked">
    <div class="doc-example__preview codeblock-demo-stage codeblock-resizable-stage">
      <ClientOnly>
        <BingCodeBlock
          :code="longCode"
          language="ts"
          title="resizable-code.ts"
          resizable
          :highlight-lines="[4, [10, 13]]"
          :resizable-options="{
            defaultSize: { width: 720, height: 360 },
            minWidth: 280,
            minHeight: 260,
            maxWidth: 920,
            maxHeight: 460,
            directions: ['right', 'bottom', 'bottom-right'],
            showSize: true,
            ariaLabel: '可调整尺寸的代码示例',
          }"
        />
      </ClientOnly>
    </div>

    <div class="doc-example__controls">
      <p>
        <code>resizableOptions</code> 只转发 BingResizable 中和尺寸相关的配置。CodeBlock 会为内部可拖拽区域补齐默认尺寸、默认方向和 aria label。
        这个示例允许在 280–920px 之间调整宽度；当页面可用宽度不足时，滚动会被限制在预览容器内。
      </p>
    </div>
  </div>

  <BingCodeBlock :code="resizableCode" language="vue" title="代码示例" wrap />
</template>
