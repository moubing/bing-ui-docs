<script setup lang="ts">
import { BingButton } from '@moubing/bing-ui'
import type { BingButtonRounded, BingButtonSize } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const sizes: BingButtonSize[] = ['xs', 'sm', 'md', 'lg', 'xl']
const roundedItems: BingButtonRounded[] = ['none', 'sm', 'md', 'lg', 'full']
</script>

<template>
  <p>尺寸</p>
  <div class="button-row">
    <BingButton v-for="size in sizes" :key="size" :size="size">{{ size.toUpperCase() }}</BingButton>
  </div>
  <p>圆角</p>
  <div class="button-row">
    <BingButton v-for="rounded in roundedItems" :key="rounded" variant="secondary" :rounded="rounded">{{ rounded }}</BingButton>
  </div>
</template>

<style scoped>
.button-row { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
</style>
