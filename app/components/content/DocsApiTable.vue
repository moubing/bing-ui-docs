<script setup lang="ts">
import { computed, inject } from 'vue'
import { docsApiKey } from './docs-api-context'

const props = defineProps<{ name: string }>()
const tables = inject(docsApiKey)
const table = computed(() => {
  const value = tables?.value[props.name]
  if (!value) throw new Error(`未找到文档 API 表：${props.name}`)
  return value
})
</script>

<template>
  <div class="props-table-wrap" role="region" :aria-label="`${name} API 表格，可横向滚动`" tabindex="0">
    <table class="props-table">
      <thead>
        <tr>
          <th v-for="header in table.headers" :key="header">{{ header }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in table.rows" :key="row[0]">
          <td v-for="(cell, index) in row" :key="index">
            <code v-if="index < table.codeColumns">{{ cell }}</code>
            <template v-else>{{ cell }}</template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
