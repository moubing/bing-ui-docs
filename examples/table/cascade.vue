<script setup lang="ts">
import { ref } from 'vue'
import { BingTable, type BingTableKey } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const keys = ref<BingTableKey[]>([])
const rows = [{ id: 'project', name: '项目', children: [{ id: 'design', name: '设计' }, { id: 'code', name: '实现' }, { id: 'locked', name: '冻结项', disabled: true }] }]
const columns = [{ key: 'name', title: '工作项', width: 300 }]
</script>
<template>
  <BingTable v-model:selected-row-keys="keys" :data="rows" :columns="columns" selectable selection-strategy="cascade" row-disabled="disabled" default-expand-all tree-guides ariaLabel="级联选择树表" />
  <p role="status">叶子键：{{ keys.join(', ') || '无' }}</p>
  <p>父项聚合可选后代；禁用项跳过。Shift 点击或 Shift+Space 按可见顺序选择范围。</p>
</template>
