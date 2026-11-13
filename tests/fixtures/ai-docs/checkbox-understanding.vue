<script setup lang="ts">
import { computed, ref } from 'vue'
import { BingCheckbox, BingCheckboxGroup } from '@moubing/bing-ui'
import type { BingCheckboxGroupValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const available = ['email', 'inbox']
const selected = ref<BingCheckboxGroupValue[]>(['email'])
const all = computed({
  get: () => available.every(value => selected.value.includes(value)),
  set: (checked: boolean) => { selected.value = checked ? [...available] : [] },
})
const partial = computed(() => selected.value.length > 0 && selected.value.length < available.length)
const childChanges = ref(0)
const groupLog = ref('等待组内变化')
function change(value: BingCheckboxGroupValue[], event: Event) { groupLog.value = `${value.join(',')}:${event.type}` }
</script>

<template>
  <BingCheckbox v-model="all" :indeterminate="partial" label="被插槽替代的标签">全选通知</BingCheckbox>
  <BingCheckboxGroup v-model="selected" id="notice-items" name="notice-items" ariaLabel="通知选项" @change="change">
    <BingCheckbox value="email" label="邮件" @change="childChanges++" />
    <BingCheckbox value="inbox" label="站内" @change="childChanges++" />
  </BingCheckboxGroup>
  <p role="status">全选：{{ all }}；半选：{{ partial }}；值：{{ selected.join(',') }}</p>
  <p>{{ groupLog }}；子项 change 次数：{{ childChanges }}</p>
</template>
