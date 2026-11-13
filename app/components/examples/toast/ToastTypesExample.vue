<script setup lang="ts">
import { BingButton, BingCodeBlock } from '@moubing/bing-ui'
import { useExamples } from './state'
const { toastTypes, pushType, typeCode } = useExamples()
</script>

<template>
  <div class="doc-example">
    <div class="doc-example__preview toast-demo-stage">
      <div class="toast-method-grid">
        <BingButton
          v-for="type in toastTypes"
          :key="type"
          :throttle="false"
          @click="pushType(type)"
        >
          {{ type }}
        </BingButton>
      </div>
    </div>

    <div class="doc-example__controls">
      <p>
        <code>fail()</code> 和 <code>failed()</code> 是 <code>error()</code> 的别名。字符串入参会直接作为 message；对象入参可以设置 title、duration、position 等。
      </p>
    </div>
  </div>

  <BingCodeBlock :code="typeCode" language="vue" title="代码示例" wrap />
</template>
