<script setup lang="ts">
import { ref } from 'vue'
import { BingAutocomplete } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const query = ref('')
const chosen = ref('尚未选择')
const options = [
  { value: 'req_7', label: 'REQ-7（付款数据分类）', meta: { 状态: '进行中', 负责人: '设计同学' } },
  { value: 'req_4', label: 'REQ-4（编辑器布局优化）', meta: { 状态: '待整理', 负责人: '前端同学' } },
  { value: 'req_2', label: 'REQ-2（文档搜索）', disabled: true },
]
</script>
<template>
  <div style="width: 360px; max-width: 100%">
    <BingAutocomplete v-model="query" :options="options" placeholder="输入编号或名称" ariaLabel="搜索需求" block @select="chosen = $event.label" />
    <p role="status">已选择：{{ chosen }}</p>
  </div>
</template>
