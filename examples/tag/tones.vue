<script setup lang="ts">
import { BingTag } from '@moubing/bing-ui'
import type { BingTagTone } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const tones: BingTagTone[] = ['primary', 'secondary', 'neutral', 'success', 'warning', 'danger']
</script>

<template>
  <div class="tags">
    <BingTag v-for="tone in tones" :key="tone" :tone="tone" :variant="tone === 'primary' || tone === 'secondary' ? 'glass' : 'soft'" :label="tone" />
  </div>
</template>

<style scoped>
.tags { display: flex; flex-wrap: wrap; gap: 12px; }
</style>
