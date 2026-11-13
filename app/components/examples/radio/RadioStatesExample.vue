<script setup lang="ts">
import { BingCodeBlock, BingRadio } from '@moubing/bing-ui'
import { useExamples } from './state'
const { stateModel, statesCode } = useExamples()
</script>

<template>
  <div class="doc-example doc-example--stacked">
    <div class="doc-example__preview">
      <p class="preview-label">状态示例</p>
      <div class="radio-demo-list">
        <ClientOnly>
          <BingRadio id="radio-state-sm" name="radio-states" v-model="stateModel" value="sm" size="sm" label="小尺寸" />
          <BingRadio
            id="radio-state-md"
            name="radio-states"
            v-model="stateModel"
            value="md"
            size="md"
            label="中尺寸"
            description="带描述文本时，控件会和内容顶部对齐。"
          />
          <BingRadio id="radio-state-lg" name="radio-states" v-model="stateModel" value="lg" size="lg" label="大尺寸" />
          <BingRadio id="radio-state-error" name="radio-states" v-model="stateModel" value="error" status="error" label="错误状态" />
          <BingRadio id="radio-state-disabled" name="radio-states" v-model="stateModel" value="disabled" disabled label="禁用状态" />
        </ClientOnly>
      </div>
    </div>
  </div>

  <BingCodeBlock :code="statesCode" language="vue" title="代码示例" wrap />
</template>
