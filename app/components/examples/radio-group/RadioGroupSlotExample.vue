<script setup lang="ts">
import { BingCodeBlock, BingRadio, BingRadioGroup } from '@moubing/bing-ui'
import { useExamples } from './state'
const { slotValue, slotCode } = useExamples()
</script>

<template>
  <div class="doc-example doc-example--stacked">
    <div class="doc-example__preview radio-group-demo-stage">
      <p class="preview-label">复杂选项</p>
      <ClientOnly>
        <BingRadioGroup id="radio-doc-1"
          v-model="slotValue"
          direction="column"
          name="doc-scope"
          aria-label="文档范围"
        >
          <BingRadio value="usage">
            <span class="radio-group-rich-option">
              <strong>使用说明</strong>
              <span>先解释组件解决什么问题。</span>
            </span>
          </BingRadio>

          <BingRadio value="api">
            <span class="radio-group-rich-option">
              <strong>API 表格</strong>
              <span>集中列出 props、slots 和 events。</span>
            </span>
          </BingRadio>

          <BingRadio value="demo">
            <span class="radio-group-rich-option">
              <strong>交互示例</strong>
              <span>用真实组件演示变化。</span>
            </span>
          </BingRadio>
        </BingRadioGroup>
      </ClientOnly>
    </div>
  </div>

  <BingCodeBlock :code="slotCode" language="vue" title="代码示例" wrap />
</template>
