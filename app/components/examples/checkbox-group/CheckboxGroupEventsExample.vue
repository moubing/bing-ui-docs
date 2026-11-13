<script setup lang="ts">
import { BingCheckboxGroup, BingCodeBlock } from '@moubing/bing-ui'
import { useExamples } from './state'
const { statusOptionsPreview, statusValue, eventValue, eventLog, handleGroupChange, handleGroupFocus, handleGroupBlur, eventsCode } = useExamples()
</script>

<template>
  <div class="doc-example">
    <div class="doc-example__preview checkbox-group-demo-stage">
      <p class="preview-label">事件预览</p>
      <ClientOnly>
        <BingCheckboxGroup id="checkbox-doc-3" name="checkbox-doc-3"
          v-model="eventValue"
          :options="[
            { label: '站内提醒', value: 'inbox' },
            { label: '邮件', value: 'email' },
            { label: 'Webhook', value: 'webhook' },
          ]"
          direction="column"
          status="success"
          aria-label="通知渠道"
          @change="handleGroupChange"
          @focus="handleGroupFocus"
          @blur="handleGroupBlur"
        />
      </ClientOnly>
      <p class="checkbox-group-feedback">
        <span>{{ eventLog }}</span>
      </p>
    </div>

    <div class="doc-example__controls">
      <p>切换选项、使用键盘进入或离开选项组，可以观察事件文案变化。</p>
      <ClientOnly>
        <BingCheckboxGroup id="checkbox-doc-4" name="checkbox-doc-4"
          v-model="statusValue"
          :options="statusOptionsPreview"
          direction="column"
          status="error"
          aria-label="发布检查项"
        />
      </ClientOnly>
    </div>
  </div>

  <BingCodeBlock
    :code="eventsCode"
    language="vue"
    title="代码示例"
    wrap
  />
</template>
