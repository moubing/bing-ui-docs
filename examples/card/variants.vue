<script setup lang="ts">
import { BingCard, type BingCardVariant } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const variants: BingCardVariant[] = ['plain', 'soft', 'accent', 'sky']
</script>

<template>
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 230px), 1fr)); gap: 20px">
    <BingCard v-for="variant in variants" :key="variant" :title="variant" :variant="variant"
      :glass="variant !== 'plain'" entrance="bubble">
      <p>{{ variant }} 适合不同层级的信息展示。</p>
    </BingCard>
  </div>
</template>
