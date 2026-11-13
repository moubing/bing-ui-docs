<script setup lang="ts">
import { BingCheckboxGroup, BingCodeBlock } from '@moubing/bing-ui'
import { useExamples } from './state'
const { compactOptions, compactValue, formatSelected, optionsCode } = useExamples()
</script>

<template>
  <div class="doc-example doc-example--stacked">
    <div class="doc-example__preview checkbox-group-demo-stage">
      <p class="preview-label">紧凑选项</p>
      <ClientOnly>
        <BingCheckboxGroup id="checkbox-doc-2" name="checkbox-doc-2"
          v-model="compactValue"
          :options="compactOptions"
          direction="row"
          size="sm"
          aria-label="文档范围"
        />
      </ClientOnly>
      <p class="checkbox-group-feedback">
        <span>已选择：{{ formatSelected(compactValue) }}</span>
      </p>
    </div>
  </div>

  <BingCodeBlock :code="optionsCode" language="vue" title="代码示例" wrap />
</template>
