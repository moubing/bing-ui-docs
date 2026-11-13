<script setup lang="ts">
import { ref } from 'vue'
import { BingCheckbox, BingInput, type BingInputValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const password = ref<BingInputValue>('sample-password')
const title = ref<BingInputValue>('')
const query = ref<BingInputValue>('')
const loading = ref(false)
</script>
<template>
  <div style="display: grid; gap: 18px; min-width: 0">
    <BingInput v-model="password" type="password" autocomplete="new-password" ariaLabel="密码显隐示例" block />
    <BingInput v-model="title" prefix="标题" suffix="字符" :max-length="20" show-count clearable ariaLabel="计数示例" block />
    <BingCheckbox v-model="loading" label="模拟加载状态" />
    <BingInput v-model="query" type="search" :loading="loading" ariaLabel="加载搜索示例" block />
    <p>显隐切换保留选区；计数仅在阈值处播报。加载开关仅演示外观，没有网络请求。</p>
  </div>
</template>
