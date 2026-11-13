<script setup lang="ts">
import { BingCodeBlock } from '@moubing/bing-ui'
import { useExamples } from './state'
const { wrapCode, wrapUsageCode } = useExamples()
</script>

<template>
  <div class="doc-example">
    <div class="doc-example__preview codeblock-demo-stage">
      <ClientOnly>
        <BingCodeBlock
          :code="wrapCode"
          language="ts"
          title="message.ts"
          :line-numbers="false"
          :copyable="false"
          wrap
        />
      </ClientOnly>
    </div>

    <div class="doc-example__controls">
      <p>
        文档页面里如果示例宽度不可控，建议打开 <code>wrap</code>；如果要保持代码原始排版，则保留默认横向滚动。
      </p>
    </div>
  </div>

  <BingCodeBlock :code="wrapUsageCode" language="vue" title="代码示例" wrap />
</template>
