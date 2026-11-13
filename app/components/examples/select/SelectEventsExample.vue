<script setup lang="ts">
import { BingCodeBlock, BingSelect } from '@moubing/bing-ui'
import { onActivated, onDeactivated, ref } from 'vue'
import { useExamples } from './state'
const { detailOptions, eventValue, eventLog, handleChange, handleClear, handleOpen, handleClose, eventsCode } = useExamples()
const examplesActive = ref(true)
onActivated(() => { examplesActive.value = true })
onDeactivated(() => { examplesActive.value = false })
</script>

<template>
  <ClientOnly v-if="examplesActive">
  <div class="doc-example">
    <div class="doc-example__preview select-demo-stage">
      <p class="preview-label">事件预览</p>
        <BingSelect id="select-eventValue" v-model="eventValue" ariaLabel="选择事件方案"
          :options="detailOptions"
          placeholder="触发事件"
          block
          @change="handleChange"
          @clear="handleClear"
          @open="handleOpen"
          @close="handleClose"
        />
      <p class="select-feedback">
        <span>{{ eventLog }}</span>
      </p>
    </div>

    <div class="doc-example__controls">
      <p>打开、选择、清除或关闭面板时，下面的状态会跟随事件更新。</p>
    </div>
  </div>

  </ClientOnly>
  <BingCodeBlock :code="eventsCode" language="vue" title="代码示例" wrap />
</template>
