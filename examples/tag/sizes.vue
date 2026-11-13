<script setup lang="ts">
import { BingTag } from '@moubing/bing-ui'
import type { BingTagSize } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const sizes: BingTagSize[] = ['sm', 'md', 'lg']
</script>

<template>
  <div class="tags">
    <BingTag v-for="size in sizes" :key="size" :size="size" tone="secondary" variant="soft" :label="`${size} 标签`" />
  </div>
</template>

<style scoped>
.tags { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
</style>
