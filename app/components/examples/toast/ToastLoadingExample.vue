<script setup lang="ts">
import { BingButton, BingCodeBlock } from '@moubing/bing-ui'
import { useExamples } from './state'
const { pushLoadingFlow, pushStack, loadingCode } = useExamples()
</script>

<template>
  <div class="doc-example">
    <div class="doc-example__preview toast-demo-stage">
      <div class="toast-action-row">
        <BingButton variant="secondary" :throttle="false" @click="pushLoadingFlow">
          模拟 loading 到成功
        </BingButton>
        <BingButton variant="tertiary" :throttle="false" @click="pushStack">
          创建堆叠消息
        </BingButton>
      </div>
    </div>

    <div class="doc-example__controls">
      <p>
        每次新增 Toast 都会重置当前队列的自动关闭计时器；鼠标悬停或键盘焦点进入 Toast 时，计时器会暂停，离开后重新开始。
      </p>
    </div>
  </div>

  <BingCodeBlock :code="loadingCode" language="vue" title="代码示例" wrap />
</template>
