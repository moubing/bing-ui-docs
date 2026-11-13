<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingRadio } from '@moubing/bing-ui'
import type { BingRadioValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const choice = ref<BingRadioValue | null>(0)
const log = ref('等待操作')
function changed(value: BingRadioValue, event: Event) {
  log.value = `${typeof value}:${String(value)}:${event.type}`
}
</script>

<template>
  <BingRadio v-model="choice" name="quota-choice" :value="0" label="数字零" @change="changed" />
  <BingRadio v-model="choice" name="quota-choice" value="0" label="被替代的主文案" description="被替代的描述" @change="changed">
    <template #default>字符串零</template>
    <template #description>保留字符串类型</template>
  </BingRadio>
  <BingRadio v-model="choice" name="quota-choice" :value="false" label="关闭配额" @change="changed" />
  <BingButton @click="choice = null">清空选择</BingButton>
  <p role="status">{{ choice === null ? '未选择' : `${typeof choice}:${String(choice)}` }}</p>
  <p>{{ log }}</p>
</template>
