<script setup lang="ts">
import { BingButton, BingCodeBlock, BingDialog } from '@moubing/bing-ui'
import { useExamples } from './state'
const { behaviorOpen, behaviorEvents, behaviorLog, updateBehavior, handleBehaviorClose, behaviorCode } = useExamples()
</script>

<template>
  <div class="doc-example">
    <div class="doc-example__preview dialog-demo-stage">
      <ClientOnly>
        <BingButton variant="secondary" :throttle="false" @click="behaviorOpen = true; behaviorEvents = []">打开关闭行为示例</BingButton>
        <BingDialog
          :model-value="behaviorOpen"
          title="关闭行为"
          :close-on-overlay="false"
          :close-on-esc="false"
          close-on-confirm
          @close="handleBehaviorClose"
          @update:model-value="updateBehavior"
          @confirm="behaviorEvents.push('confirm')"
          @cancel="behaviorEvents.push('cancel')"
        >
          <p>
            遮罩点击和 Escape 不会关闭；确认会依次发出 confirm、update:false 和 close:confirm。
          </p>
          <BingButton variant="secondary" @click="behaviorOpen = false">直接设置模型关闭</BingButton>
        </BingDialog>
      </ClientOnly>

      <p class="dialog-feedback">
        <span>{{ behaviorLog }}</span>
      </p>
    </div>

    <div class="doc-example__controls">
      <p>
        需要强确认的场景可以禁用遮罩和 Escape 关闭；普通信息提示建议保留这些逃生路径。
      </p>
    </div>
  </div>

  <BingCodeBlock :code="behaviorCode" language="vue" title="代码示例" wrap />
</template>
