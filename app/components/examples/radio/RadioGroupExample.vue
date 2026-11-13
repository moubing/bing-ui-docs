<script setup lang="ts">
import { BingCodeBlock, BingRadio, BingRadioGroup } from '@moubing/bing-ui'
import { useExamples } from './state'
const { groupModel, groupCode } = useExamples()
</script>

<template>
  <div class="doc-example doc-example--stacked">
    <div class="doc-example__preview radio-demo-stage">
      <p class="preview-label">组内自定义选项</p>
      <ClientOnly>
        <BingRadioGroup
          id="display-mode"
          v-model="groupModel"
          direction="column"
          name="display-mode"
          aria-label="展示方案"
        >
          <BingRadio id="display-mode-default" value="default">
            <span class="radio-rich-option">
              <strong>默认方案</strong>
              <span>适合大多数页面。</span>
            </span>
          </BingRadio>

          <BingRadio id="display-mode-compact" value="compact">
            <span class="radio-rich-option">
              <strong>紧凑方案</strong>
              <span>适合信息密度更高的面板。</span>
            </span>
          </BingRadio>

          <BingRadio id="display-mode-immersive" value="immersive">
            <span class="radio-rich-option">
              <strong>沉浸方案</strong>
              <span>适合展示型页面。</span>
            </span>
          </BingRadio>
        </BingRadioGroup>
      </ClientOnly>
      <p class="radio-feedback">
        <span>当前方案：{{ groupModel }}</span>
      </p>
    </div>
  </div>

  <BingCodeBlock :code="groupCode" language="vue" title="代码示例" wrap />
</template>
