<script setup lang="ts">
import { ref } from 'vue'
import { BingTable, type BingTableKey } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const active = ref<BingTableKey | null>('active')
const selected = ref<BingTableKey[]>(['selected', 'active'])
const rows = [{ id: 'normal', name: '普通行' }, { id: 'selected', name: '选中行：浅底与复选框' }, { id: 'active', name: '活动行：标记与背景' }]
const columns = [{ key: 'name', title: '主题状态', width: 320 }]
</script>
<template>
  <BingTable class="table-theme-demo" v-model:active-row-key="active" v-model:selected-row-keys="selected" :data="rows" :columns="columns" selectable ariaLabel="表格公开主题变量" />
  <p>变量设置在组件或祖先上；活动行优先于选中行，悬停不改变文字颜色。不依赖内部 --_table-*。</p>
</template>
<style scoped>
.table-theme-demo {
  --bing-table-header-bg: var(--bing-surface-muted);
  --bing-table-row-selected-bg: color-mix(in srgb, var(--bing-accent) 7%, var(--bing-surface-solid));
  --bing-table-row-active-accent: var(--bing-accent);
  --bing-table-focus-ring: var(--bing-focus-ring);
  --bing-table-radius: 12px;
  --bing-table-cell-padding-x: 16px;
}
</style>
