<script setup lang="ts">
import { BingCodeBlock, BingRadioGroup } from '@moubing/bing-ui'
import { useExamples } from './state'
const { compactOptions, compactValue, formatSelected, optionsCode } = useExamples()
</script>

<template>
  <div class="doc-example doc-example--stacked">
    <div class="doc-example__preview radio-group-demo-stage">
      <p class="preview-label">主题选项</p>
      <ClientOnly>
        <BingRadioGroup id="radio-doc-2" name="radio-doc-2"
          v-model="compactValue"
          :options="compactOptions"
          direction="row"
          size="sm"
          aria-label="主题模式"
        />
      </ClientOnly>
      <p class="radio-group-feedback">
        <span>当前主题：{{ formatSelected(compactValue) }}</span>
      </p>
    </div>
  </div>

  <BingCodeBlock :code="optionsCode" language="vue" title="代码示例" wrap />
</template>
