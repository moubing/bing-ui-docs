<script setup lang="ts">
import { computed, ref } from 'vue'
import { BingTable, type BingTableColumn, type BingTableRow, type BingTableKey, type BingTableExpose, type BingTableSelectionPayload, type BingTableSortOrder, type BingTableFixed } from '@moubing/bing-ui'
const source: BingTableRow[] = [
  { id: 'a', name: '甲项目', score: 30, children: [{ id: 'a1', name: '子项一', score: 9 }, { id: 'a2', name: '子项二', score: 1 }] },
  { id: 'b', name: '乙项目', score: 10, disabled: true },
  { id: 'c', name: '丙项目', score: 20 }, { id: 'd', name: '丁项目', score: 40 },
]
const columns: BingTableColumn[] = [{ key: 'name', title: '名称', width: 220 }, { key: 'score', title: '分数', sortable: true, width: 120, minWidth: 100, maxWidth: 150 }]
const mode = ref('local'), page = ref(1), pageSize = ref(2), selected = ref<BingTableKey[]>(['ghost']), expanded = ref<BingTableKey[]>(['a'])
const sortKey = ref<string | null>(null), sortOrder = ref<BingTableSortOrder>(null)
const widths = ref<Record<string, number>>({}), order = ref<string[]>([]), hidden = ref<string[]>([]), fixed = ref<Record<string, BingTableFixed | null>>({})
const table = ref<BingTableExpose | null>(null), events = ref<string[]>([]), payload = ref<BingTableSelectionPayload>()
const defaults = ref(false)
const defaultRows = ref<BingTableRow[]>([...source])
const data = computed(() => mode.value === 'remote' ? source.slice((page.value - 1) * pageSize.value, page.value * pageSize.value) : source)
function switchMode(next: string) { mode.value = next; page.value = 1; selected.value = ['ghost']; sortKey.value = null; sortOrder.value = null; events.value = [] }
function selection(value: BingTableSelectionPayload) { payload.value = value; events.value.push('selection') }
function resetColumns() { events.value = []; table.value?.resetColumns() }
</script>
<template>
  <main style="padding: 20px; max-width: 800px">
    <button @click="switchMode('local')">本地分页</button><button @click="switchMode('remote')">远程分页</button>
    <button @click="defaults = !defaults">检查默认值边界</button>
    <template v-if="defaults">
      <button @click="defaultRows = [...defaultRows]">替换数据引用</button>
      <BingTable :data="defaultRows" :columns="columns" :sortKey="null" :sortOrder="null"
        defaultSortKey="score" defaultSortOrder="asc" defaultExpandAll ariaLabel="默认值边界" />
    </template>
    <button @click="table?.clearSelection()">清空全部选择</button><button @click="resetColumns">重置列状态</button>
    <BingTable ref="table" :key="mode" :data="data" :columns="columns" rowKey="id" rowDisabled="disabled" selectable
      v-model:selectedRowKeys="selected" v-model:expandedRowKeys="expanded" v-model:page="page" v-model:pageSize="pageSize"
      v-model:sortKey="sortKey" v-model:sortOrder="sortOrder" v-model:columnWidths="widths" v-model:columnOrder="order"
      v-model:hiddenColumnKeys="hidden" v-model:columnFixed="fixed" :smoothScroll="false" :virtual="false"
      pagination :remotePagination="mode === 'remote'" :total="source.length" :pageSizeOptions="[2, 4]" ariaLabel="阅读表格"
      @selection-change="selection" @update:selectedRowKeys="events.push('update-selection')"
      @page-change="events.push('page')" @sort-change="events.push('sort')"
      @update:columnWidths="events.push('widths')" @update:columnOrder="events.push('order')"
      @update:hiddenColumnKeys="events.push('hidden')" @update:columnFixed="events.push('fixed')"
      @column-resize="events.push('resize')" @column-visibility-change="events.push('visibility')">
      <template #toolbar="{ selectedRowKeys }">选中键 {{ selectedRowKeys.length }}</template>
      <template #header-score>分数</template>
      <template #cell-score="{ value, rowIndex, level }"><span :title="`${rowIndex}/${level}`">{{ typeof value === 'number' ? value.toFixed(0) : '—' }}</span></template>
      <template #cell="{ value }">{{ String(value ?? '') }}</template>
    </BingTable>
    <pre id="selected">{{ JSON.stringify(selected) }}</pre><pre id="payload">{{ JSON.stringify(payload) }}</pre>
    <pre id="events">{{ JSON.stringify(events) }}</pre><pre id="page">{{ page }} / {{ pageSize }}</pre>
    <pre id="columns">{{ JSON.stringify({ widths, order, hidden, fixed }) }}</pre>
  </main>
</template>
