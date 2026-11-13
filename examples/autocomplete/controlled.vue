<script setup lang="ts">
import { computed, ref } from 'vue'
import { BingAutocomplete, BingButton, type BingAutocompleteExpose, type BingAutocompleteOption } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const query = ref('')
const search = ref<BingAutocompleteExpose | null>(null)
const failed = ref(false)
const chosen = ref('尚未选择')
const all = [{ value: 'a', label: 'REQ-7（付款分类）' }, { value: 'b', label: 'REQ-4（页面布局）' }]
const options = computed(() => all.filter(item => item.label.replace('-', '').toLowerCase().includes(query.value.replace('-', '').trim().toLowerCase())))
function select(option: BingAutocompleteOption) { chosen.value = option.label; search.value?.close() }
</script>
<template>
  <div style="display: grid; gap: 12px; width: 380px; max-width: 100%">
    <BingAutocomplete ref="search" v-model="query" :options="options" :filter="false" :open-on-empty="false" :complete-on-select="false" :close-on-select="false" :error="failed ? '模拟加载失败' : ''" ariaLabel="受控搜索" placeholder="试试 req7，空输入不展开" block @select="select">
      <template #header>业务筛选：支持省略编号中的连字符</template>
      <template #error><BingButton variant="secondary" size="sm" @click="failed = false">重试</BingButton></template>
      <template #footer>找到 {{ options.length }} 个候选</template>
    </BingAutocomplete>
    <BingButton variant="secondary" @click="search?.focus()">聚焦搜索</BingButton>
    <BingButton variant="secondary" :disabled="!query.trim()" @click="failed = true; search?.focus()">模拟加载失败</BingButton>
    <p role="status">已选择：{{ chosen }}；关键字保留为：{{ query }}</p>
  </div>
</template>
