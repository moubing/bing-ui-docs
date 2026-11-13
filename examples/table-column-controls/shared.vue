<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingTable, BingTableColumnControls } from '@moubing/bing-ui'
import type { BingTableFixed } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const columns = [{ key: 'title', title: '标题', width: 280, ellipsis: false },
  { key: 'owner', title: '负责人', width: 160 }, { key: 'priority', title: '优先级', width: 120 }]
const firstOpen = ref(false)
const secondOpen = ref(true)
const order = ref<string[]>([])
const hidden = ref<string[]>([])
const fixed = ref<Record<string, BingTableFixed | null>>({})
const widths = ref<Record<string, number>>({})
const groups = [
  [{ id: 1, title: '工作台布局', owner: '林晓', priority: '高' }],
  [{ id: 2, title: '独立保存文档标题和属性', owner: '周宁', priority: '中' }],
]
</script>

<template>
  <div style="display: grid; gap: 16px; min-width: 0;">
    <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 8px;">
      <BingTableColumnControls :columns="columns" ariaLabel="所有分组的列设置"
        v-model:column-order="order" v-model:hidden-column-keys="hidden"
        v-model:column-widths="widths" v-model:column-fixed="fixed" />
      <BingButton size="sm" variant="ghost" :throttle="false" @click="firstOpen = !firstOpen">{{ firstOpen ? '收起' : '展开' }}待处理</BingButton>
      <BingButton size="sm" variant="ghost" :throttle="false" @click="secondOpen = !secondOpen">{{ secondOpen ? '收起' : '展开' }}进行中</BingButton>
    </div>
    <BingTable v-if="firstOpen" :columns="columns" :data="groups[0]" :show-column-controls="false"
      v-model:column-order="order" v-model:hidden-column-keys="hidden"
      v-model:column-widths="widths" v-model:column-fixed="fixed" ariaLabel="待处理文档" />
    <BingTable v-if="secondOpen" :columns="columns" :data="groups[1]" :show-column-controls="false"
      v-model:column-order="order" v-model:hidden-column-keys="hidden"
      v-model:column-widths="widths" v-model:column-fixed="fixed" ariaLabel="进行中文档" />
    <p>折叠全部分组后仍可设置列；重新展开时使用同一份列模型。</p>
  </div>
</template>
