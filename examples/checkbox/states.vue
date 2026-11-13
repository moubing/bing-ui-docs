<script setup lang="ts">
import { ref } from 'vue'
import { BingCheckbox } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const checked = ref(true)
const partialChecked = ref(false)
const circle = ref(true)
</script>

<template>
  <div class="states">
    <BingCheckbox v-model="checked" label="已选中" />
    <BingCheckbox v-model="partialChecked" indeterminate tone="secondary" label="部分选中" />
    <BingCheckbox :model-value="true" disabled label="禁用状态" />
    <BingCheckbox v-model="circle" shape="circle" label="圆形样式" />
  </div>
  <p>半选项的布尔模型：{{ partialChecked }}。固定的 indeterminate 仅用于对照展示，业务应根据子项重新计算它。</p>
</template>

<style scoped>
.states { display: flex; flex-wrap: wrap; gap: 16px; }
</style>
