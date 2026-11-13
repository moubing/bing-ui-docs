<script setup lang="ts">
import { BingCard, type BingCardEntrance } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const entrances: BingCardEntrance[] = ['fade-up', 'bubble', 'rotate-up', 'soft-pop']
</script>

<template>
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 230px), 1fr)); gap: 20px">
    <BingCard v-for="entrance in entrances" :key="entrance" :title="entrance" :entrance="entrance"
      :variant="entrance === 'rotate-up' ? 'sky' : 'soft'">
      <p>不同入场动画适合不同的信息密度。</p>
    </BingCard>
  </div>
</template>
