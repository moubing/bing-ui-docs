<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingCheckbox } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const checked = ref(false)
const eventLog = ref('等待操作')
function handleChange(value: boolean, event: Event) {
  eventLog.value = `change：${value ? '已选中' : '未选中'}；原始事件：${event.type}`
}
function handleFocus(_event: FocusEvent) { eventLog.value = 'focus：获得焦点' }
function handleBlur(_event: FocusEvent) { eventLog.value = 'blur：失去焦点' }
</script>

<template>
  <BingCheckbox
    v-model="checked" label="接收通知" id="receive-notification" name="receive-notification"
    @change="handleChange" @focus="handleFocus" @blur="handleBlur"
  />
  <p role="status">{{ eventLog }}</p>
  <BingButton>移动焦点</BingButton>
</template>
