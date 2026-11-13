<script setup lang="ts">
import { BingIcon, type BingIconSize } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
import { Star } from 'lucide-vue-next'

const sizes: BingIconSize[] = ['xs', 'sm', 'md', 'lg', 'xl', 28, '36px']
</script>

<template>
  <div style="display: flex; align-items: center; flex-wrap: wrap; gap: 20px">
    <span v-for="size in sizes" :key="size" style="display: inline-flex; align-items: center; gap: 6px">
      <BingIcon :icon="Star" :size="size" tone="primary" /><code>{{ size }}</code>
    </span>
  </div>
</template>
