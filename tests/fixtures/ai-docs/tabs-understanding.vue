<script setup lang="ts">
import { reactive } from 'vue'
import { BingTabs, type BingTabValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const sizes = ['sm', 'md', 'lg'] as const
const values = reactive<Record<typeof sizes[number], BingTabValue>>({ sm: 0, md: 0, lg: 0 })
const items = Array.from({ length: 8 }, (_, index) => ({ label: `项目 ${index + 1}：较长的分组名称`, value: index }))
</script>

<template>
  <div style="max-width: 350px; display: grid; gap: 16px">
    <div v-for="size in sizes" :key="size">
      <BingTabs v-model="values[size]" :items="items" :size="size" :ariaLabel="size === 'sm' ? undefined : '尺寸 ' + size" />
      <p :id="'tabs-value-' + size">当前：{{ values[size] }}</p>
    </div>
  </div>
</template>
