<script setup lang="ts">
import { ref } from 'vue'
import { BingInput } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const value = ref<string | number | null>('初始内容')
const delay = ref(500)
const visible = ref(true)
const events = ref<string[]>([])
function record(name: string, value?: string | number | null) { events.value.push(value === undefined ? name : `${name}:${value}`) }
</script>

<template>
  <BingInput v-if="visible" v-model="value" clearable :debounce-delay="delay" ariaLabel="查询条件"
    @update:model-value="record('update', $event)" @input="record('input', $event)"
    @clear="record('clear')" @debounced-input="record('debounced', $event)" />
  <button type="button" @click="value = '程序赋值'">程序赋值</button>
  <button type="button" @click="delay = 0">立即通知</button>
  <button type="button" @click="visible = false">卸载输入</button>
  <p role="status">{{ JSON.stringify(events) }}</p>
</template>
