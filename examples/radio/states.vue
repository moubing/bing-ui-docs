<script setup lang="ts">
import { ref } from 'vue'
import { BingRadio } from '@moubing/bing-ui'
import type { BingRadioValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

// 同组独立 Radio 共用模型和 name，每项的 id 与 value 不同。
const selected = ref<BingRadioValue | null>('md')
</script>

<template>
  <div class="radio-states">
    <BingRadio id="radio-state-sm" v-model="selected" name="radio-states" value="sm" size="sm" label="小尺寸" />
    <BingRadio id="radio-state-md" v-model="selected" name="radio-states" value="md" size="md" label="中尺寸" description="带描述文本时，控件会和内容顶部对齐。" />
    <BingRadio id="radio-state-lg" v-model="selected" name="radio-states" value="lg" size="lg" label="大尺寸" />
    <BingRadio id="radio-state-error" v-model="selected" name="radio-states" value="error" status="error" label="错误状态" />
    <BingRadio id="radio-state-disabled" v-model="selected" name="radio-states" value="disabled" disabled label="禁用状态" />
  </div>
  <p role="status">当前值：{{ selected }}</p>
</template>

<style scoped>
.radio-states { display: grid; gap: 16px; }
</style>
