<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingRadio, BingRadioGroup } from '@moubing/bing-ui'
import type { BingRadioValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

// 根据导出文档另写的应用场景：false 和 0 是合法值，两组保持独立。
const enabled = ref<BingRadioValue | null>(null)
const retries = ref<BingRadioValue | null>(0)
const lastEvent = ref('尚未切换')
function change(value: BingRadioValue, event: Event) { lastEvent.value = `${typeof value}:${String(value)}:${event.type}` }
</script>

<template>
  <BingRadioGroup v-model="enabled" ariaLabel="启用决策" @change="change">
    <BingRadio :value="false" label="暂不启用" />
    <BingRadio :value="true" label="启用" />
  </BingRadioGroup>
  <BingRadioGroup
    v-model="retries" ariaLabel="重试次数"
    :options="[{ label: '不重试', value: 0 }, { label: '两次', value: 2 }]"
  />
  <p role="status">决策：{{ enabled === null ? '未选择' : String(enabled) }}；重试：{{ retries }}；类型：{{ typeof retries }}</p>
  <p>{{ lastEvent }}</p>
  <BingButton @click="enabled = null">清空决策</BingButton>
</template>
