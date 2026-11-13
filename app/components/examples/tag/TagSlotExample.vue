<script setup lang="ts">
import { BingCodeBlock, BingTag } from '@moubing/bing-ui'
import { useExamples } from './state'
const { slotCode } = useExamples()
</script>

<template>
  <div class="doc-example doc-example--stacked">
    <div class="doc-example__preview">
      <p class="preview-label">插槽内容</p>
      <div class="tag-demo-row">
        <ClientOnly>
          <BingTag tone="success" variant="soft">
            <span class="tag-custom-content">
              <span class="tag-dot"></span>
              已发布
            </span>
          </BingTag>
          <BingTag tone="neutral" variant="soft" size="sm">+3</BingTag>
          <BingTag tone="warning" variant="glass" label="这是一个很长的标签文案，会被省略展示" />
        </ClientOnly>
      </div>
    </div>
  </div>

  <BingCodeBlock :code="slotCode" language="vue" title="代码示例" wrap />
</template>
