<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingTable } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const error = ref<string | boolean>('示例请求失败，请重试')
const rows = ref<{ id: number; name: string }[]>([])
const columns = [{ key: 'name', title: '记录', width: 280 }]
function retry() { error.value = false; rows.value = [{ id: 1, name: '重试后加载成功' }] }
</script>
<template>
  <div style="display: grid; gap: 14px; min-width: 0">
    <BingTable :data="rows" :columns="columns" :error="error" ariaLabel="错误重试表格" @retry="retry" />
    <BingButton variant="secondary" @click="error = '示例请求失败，请重试'; rows = []">模拟失败</BingButton>
    <BingTable :data="[]" :columns="columns" :show-column-controls="false" ariaLabel="自定义空状态"><template #empty>当前没有记录，可以创建新条目。</template></BingTable>
  </div>
</template>
