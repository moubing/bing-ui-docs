<script setup lang="ts">
import { computed, ref } from 'vue'
import { BingButton, BingTable, type BingTableKey, type BingTableSelectionPayload } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const page = ref(1)
const all = ref(false)
const excluded = ref<BingTableKey[]>([])
const keys = ref<BingTableKey[]>([])
const rows = computed(() => Array.from({ length: 3 }, (_, index) => ({ id: (page.value - 1) * 3 + index + 1, name: '当前查询记录 ' + ((page.value - 1) * 3 + index + 1) })))
const columns = [{ key: 'name', title: '记录', width: 260 }]
const payload = ref<BingTableSelectionPayload>({ keys: [], rows: [] })
function filter() { page.value = 1; keys.value = []; all.value = false; excluded.value = []; payload.value = { keys: [], rows: [] } }
</script>
<template>
  <div style="display: grid; gap: 14px; min-width: 0">
    <BingButton variant="secondary" @click="filter">模拟切换筛选并清空选择</BingButton>
    <BingTable v-model:page="page" v-model:selected-row-keys="keys" v-model:all-pages-selected="all" v-model:excluded-row-keys="excluded" :data="rows" :columns="columns" selectable pagination remote-pagination :page-size="3" :page-size-options="[3]" :total="30" ariaLabel="远程跨页选择" @selection-change="payload = $event">
      <template #toolbar="{ selectAllPages, clearSelection, selectionCount }">
        <div style="display: flex; gap: 8px; flex-wrap: wrap"><BingButton size="sm" @click="selectAllPages">选择全部 30 条</BingButton><BingButton size="sm" variant="ghost" @click="clearSelection">清空选择</BingButton><span>已选 {{ selectionCount }}</span></div>
      </template>
    </BingTable>
    <p role="status">allPages：{{ all }}；excludedKeys：{{ excluded.join(', ') || '无' }}；已缓存 {{ payload.rows.length }} 行</p>
    <p>这里仅模拟分页。真实批量接口应接收查询条件与 excludedKeys；rows 只含已加载数据，不能当作全部 30 条。</p>
  </div>
</template>
