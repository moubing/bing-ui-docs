<script setup lang="ts">
import { computed, ref } from 'vue'
import { BingCheckbox, BingCheckboxGroup, type BingCheckboxGroupValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const selected = ref<BingCheckboxGroupValue[]>([])
const changes = ref(0)
const options = [
  { label: '设计', value: 1 }, { label: '开发', value: 2 },
  { label: '已归档（禁用）', value: 3, disabled: true },
  { label: '测试', value: 4 }, { label: '发布', value: 5 },
]
const available = options.filter(option => !option.disabled).map(option => option.value)
const count = computed(() => available.filter(value => selected.value.includes(value)).length)
function selectAll(value: boolean) { selected.value = value ? [...available] : [] }
</script>

<template>
  <div class="batch">
    <BingCheckbox :model-value="count === available.length" :indeterminate="count > 0 && count < available.length" label="全选可用项" @update:model-value="selectAll" />
    <BingCheckboxGroup v-model="selected" :options="options" direction="column" drag-select range-select ariaLabel="批量选择" @change="changes++" />
    <p role="status">已选：{{ selected.join(', ') || '无' }}；change：{{ changes }}</p>
  </div>
</template>

<style scoped>
.batch { display: grid; gap: 18px; }
.batch p { margin: 0; }
</style>
