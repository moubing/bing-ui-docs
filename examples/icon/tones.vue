<script setup lang="ts">
import { BingIcon, type BingIconTone } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
import { Sparkles } from 'lucide-vue-next'

const tones: BingIconTone[] = ['inherit', 'muted', 'primary', 'secondary', 'danger', 'success', 'warning']
</script>

<template>
  <div style="display: flex; flex-wrap: wrap; gap: 20px; color: rebeccapurple">
    <span v-for="tone in tones" :key="tone" style="display: inline-flex; align-items: center; gap: 6px">
      <BingIcon :icon="Sparkles" size="lg" :tone="tone" /><code>{{ tone }}</code>
    </span>
  </div>
</template>
