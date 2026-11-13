<script setup lang="ts">
import { ref } from 'vue'
import { BingInput, type BingInputSize, type BingInputProps } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const sizes = ref<{ size: BingInputSize; value: string | number | null }[]>([
  { size: 'sm', value: 'sm 尺寸' }, { size: 'md', value: 'md 尺寸' }, { size: 'lg', value: 'lg 尺寸' },
])
const states = ref<{ status: NonNullable<BingInputProps['status']>; value: string | number | null }[]>([
  { status: 'default', value: 'default' }, { status: 'success', value: 'success' },
  { status: 'warning', value: 'warning' }, { status: 'error', value: 'error' },
])
</script>

<template>
  <div style="display: grid; gap: 16px">
    <BingInput v-for="item in sizes" :key="item.size" v-model="item.value" :size="item.size" :ariaLabel="`${item.size} 尺寸`" />
    <BingInput v-for="item in states" :key="item.status" v-model="item.value" :status="item.status" :ariaLabel="`${item.status} 状态`" />
    <BingInput model-value="不可编辑" disabled ariaLabel="禁用输入" />
  </div>
</template>
