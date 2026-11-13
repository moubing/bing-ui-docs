<script setup lang="ts">
import { BingCheckbox, BingCheckboxGroup, BingCodeBlock } from '@moubing/bing-ui'
import { useExamples } from './state'
const { slotValue, slotCode } = useExamples()
</script>

<template>
  <div class="doc-example doc-example--stacked">
    <div class="doc-example__preview checkbox-group-demo-stage">
      <p class="preview-label">复杂选项</p>
      <ClientOnly>
        <BingCheckboxGroup id="checkbox-doc-1"
          v-model="slotValue"
          direction="column"
          name="review-scope"
          aria-label="评审范围"
        >
          <BingCheckbox value="design">
            <span class="checkbox-group-rich-option">
              <strong>设计走查</strong>
              <span>检查状态、间距和可访问名称。</span>
            </span>
          </BingCheckbox>

          <BingCheckbox value="api">
            <span class="checkbox-group-rich-option">
              <strong>API 对齐</strong>
              <span>确认 props、slots 和 events 都有文档。</span>
            </span>
          </BingCheckbox>

          <BingCheckbox value="demo">
            <span class="checkbox-group-rich-option">
              <strong>示例验证</strong>
              <span>保证示例能直接体现组件能力。</span>
            </span>
          </BingCheckbox>
        </BingCheckboxGroup>
      </ClientOnly>
    </div>
  </div>

  <BingCodeBlock :code="slotCode" language="vue" title="代码示例" wrap />
</template>
