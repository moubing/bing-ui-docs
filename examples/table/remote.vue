<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { BingTable } from '@moubing/bing-ui'
import type { BingTablePageChangePayload, BingTableSortPayload, BingTableSortOrder } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const columns = [{ key: 'title', title: '文档编号', sortable: true, width: 280, ellipsis: false },
  { key: 'owner', title: '负责人', width: 180 }]
const source = [
  { id: 2, title: 'REQ-2', owner: '林晓' }, { id: 1, title: 'REQ-1', owner: '周宁' },
  { id: 20, title: 'REQ-20', owner: '林晓' }, { id: 10, title: 'REQ-10', owner: '周宁' },
  { id: 3, title: 'REQ-3', owner: '林晓' },
]
const items = ref(source.slice(0, 2))
const page = ref(1)
const pageSize = ref(2)
const sortKey = ref<string | null>(null)
const sortOrder = ref<BingTableSortOrder>(null)
const loading = ref(false)
const requests = ref(0)
let timer: ReturnType<typeof setTimeout> | undefined
function query() {
  clearTimeout(timer)
  requests.value++
  loading.value = true
  // 仅在示例中模拟服务端字符串排序。实际应用将分页与排序条件发送给接口。
  timer = setTimeout(() => {
    const ordered = sortOrder.value ? [...source].sort((a, b) => {
      const result = a.title < b.title ? -1 : a.title > b.title ? 1 : 0
      return sortOrder.value === 'asc' ? result : -result
    }) : source
    items.value = ordered.slice((page.value - 1) * pageSize.value, page.value * pageSize.value)
    loading.value = false
  }, 320)
}
function onPageChange(next: BingTablePageChangePayload) {
  page.value = next.page
  pageSize.value = next.pageSize
  query()
}
function onSortChange(next: BingTableSortPayload) {
  sortKey.value = next.key
  sortOrder.value = next.order
  page.value = 1
  query()
}
onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div>
    <BingTable :columns="columns" :data="items" pagination remote-pagination remote-sort
      :page="page" :page-size="pageSize" :total="source.length" :default-page-size="2" :page-size-options="[2, 3, 10]"
      :sort-key="sortKey" :sort-order="sortOrder" :loading="loading"
      :preserve-page-height="false" :virtual="false" :show-column-controls="false"
      @page-change="onPageChange" @sort-change="onSortChange" ariaLabel="远程文档列表" />
    <p role="status">模拟请求：{{ requests }}；排序：{{ sortOrder ?? '默认' }}</p>
  </div>
</template>
