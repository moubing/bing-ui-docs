<script setup lang="ts">
import { BingCheckbox, BingCodeBlock } from '@moubing/bing-ui'
import { useExamples } from './state'
const { baseChecked, indeterminateChecked, circleChecked, statesCode } = useExamples()
</script>

<template>
  <div class="doc-example doc-example--stacked">
    <div class="doc-example__preview">
      <p class="preview-label">状态示例</p>
      <div class="checkbox-demo-list">
        <ClientOnly>
          <BingCheckbox v-model="baseChecked" label="已选中" />
          <BingCheckbox v-model="indeterminateChecked" indeterminate tone="secondary" label="部分选中" />
          <BingCheckbox :model-value="true" disabled label="禁用状态" />
          <BingCheckbox v-model="circleChecked" shape="circle" label="圆形样式" />
        </ClientOnly>
      </div>
    </div>
  </div>

  <BingCodeBlock :code="statesCode" language="vue" title="代码示例" wrap />
</template>
