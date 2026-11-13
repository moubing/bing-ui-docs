<script setup lang="ts">
import { computed, ref } from 'vue'
import { BingCheckbox } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const selected = ref([true, false, false])
const count = computed(() => selected.value.filter(Boolean).length)
function selectAll(value: boolean) { selected.value = selected.value.map(() => value) }
</script>

<template>
  <div class="choices">
    <BingCheckbox :model-value="count === 3" :indeterminate="count > 0 && count < 3" label="全选任务" @update:model-value="selectAll" />
    <BingCheckbox v-for="(_, index) in selected" :key="index" v-model="selected[index]" :label="'任务 ' + (index + 1)" />
    <BingCheckbox :model-value="true" disabled label="不可修改的任务" />
    <p role="status">已选 {{ count }} / 3</p>
  </div>
</template>

<style scoped>
.choices { display: grid; gap: 12px; }
.choices p { margin: 0; }
</style>
