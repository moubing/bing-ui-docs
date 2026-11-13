<script setup lang="ts">
import { BING_TOAST_POSITION_OPTIONS, BingButton, BingCodeBlock } from '@moubing/bing-ui'
import { useExamples } from './state'
const { pushAtPosition, positionCode } = useExamples()
</script>

<template>
  <div class="doc-example">
    <div class="doc-example__preview toast-demo-stage">
      <div class="toast-position-grid">
        <BingButton
          v-for="position in BING_TOAST_POSITION_OPTIONS"
          :key="position"
          variant="secondary"
          :throttle="false"
          @click="pushAtPosition(position)"
        >
          {{ position }}
        </BingButton>
      </div>
    </div>

    <div class="doc-example__controls">
      <p>
        如果页面只挂载了某一个 <code>viewportPosition</code>，其它位置的 Toast 仍会保存在服务状态里，但不会由这个视口渲染。通常文档站和业务应用直接使用 <code>all</code>。
      </p>
    </div>
  </div>

  <BingCodeBlock :code="positionCode" language="vue" title="代码示例" wrap />
</template>
