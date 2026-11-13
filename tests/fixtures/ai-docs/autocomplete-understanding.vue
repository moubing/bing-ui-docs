<script setup lang="ts">
import { ref } from 'vue'
import { BingAutocomplete, type BingAutocompleteExpose } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const query = ref('')
const search = ref<BingAutocompleteExpose | null>(null)
const chosen = ref('无')
const options = [
  { value: 1, label: '第一项', disabled: true },
  { value: 2, label: '第二项', detail: '允许选择的目标' },
]
</script>
<template>
  <button @click="search?.focus()">聚焦搜索</button>
  <BingAutocomplete ref="search" v-model="query" :filter="false" :options="options" :complete-on-select="false" ariaLabel="命令搜索" @select="chosen = String($event.value)" />
  <p role="status">选中 {{ chosen }}；输入 {{ query }}</p>
</template>
