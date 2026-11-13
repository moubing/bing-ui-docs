<script setup lang="ts">
import { ref } from 'vue'
import { BingInput } from '@moubing/bing-ui'
import { Search } from 'lucide-vue-next'
import '@moubing/bing-ui/style.css'

const keyword = ref<string | number | null>('')
const debounced = ref('等待输入')
const immediate = ref('等待输入')
const cleared = ref(0)
const focus = ref(0)
const blur = ref(0)
const key = ref('')
function handleInput(value: string, event: Event) { immediate.value = `${value}:${event.type}` }
function handleDebouncedInput(value: string) { debounced.value = value || '空字符串' }
</script>

<template>
  <BingInput v-model="keyword" :icon="Search" type="search" block placeholder="输入后等待 500ms" ariaLabel="防抖搜索"
    :debounce-delay="500" @input="handleInput" @debounced-input="handleDebouncedInput" @clear="cleared++"
    @focus="focus++" @blur="blur++" @keydown="key = $event.key" />
  <p role="status">即时：{{ immediate }}；防抖：{{ debounced }}；清除：{{ cleared }}</p>
  <p>focus：{{ focus }}；blur：{{ blur }}；按键：{{ key }}</p>
  <button type="button">移出焦点</button>
</template>
