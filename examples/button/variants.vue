<script setup lang="ts">
import { BingButton } from '@moubing/bing-ui'
import type { BingButtonVariant } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const variants: BingButtonVariant[] = ['primary', 'secondary', 'tertiary', 'ghost', 'danger', 'success', 'warning']
</script>

<template>
  <div class="button-row">
    <BingButton v-for="variant in variants" :key="variant" :variant="variant" :text-effect="variant === 'primary' ? undefined : 'none'">{{ variant }}</BingButton>
  </div>
</template>

<style scoped>
.button-row { display: flex; flex-wrap: wrap; gap: 12px; }
</style>
