<script setup lang="ts">
import { BingButton, BingCodeBlock } from '@moubing/bing-ui'
import { useExamples } from './state'
const { variants, variantsCode } = useExamples()
</script>

<template>
  <div class="doc-example doc-example--stacked">
    <div class="doc-example__preview">
      <p class="preview-label">按钮类型</p>
      <div class="button-demo-row">
        <ClientOnly>
          <BingButton
            v-for="variant in variants"
            :key="variant"
            :variant="variant"
            :text-effect="variant === 'primary' ? undefined : 'none'"
          >
            {{ variant }}
          </BingButton>
        </ClientOnly>
      </div>
    </div>
  </div>

  <BingCodeBlock :code="variantsCode" language="vue" title="代码示例" wrap />
</template>
