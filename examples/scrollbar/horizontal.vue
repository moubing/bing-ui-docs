<script setup lang="ts">
import { BingScrollbar } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const columns = Array.from({ length: 10 }, (_, index) => ({ id: index + 1, title: `Column ${index + 1}` }))
</script>

<template>
  <BingScrollbar height="180px" horizontal always ariaLabel="横向内容">
    <div class="lane"><article v-for="column in columns" :key="column.id"><strong>{{ column.title }}</strong><p>横向滚动内容块。</p></article></div>
  </BingScrollbar>
</template>

<style scoped>
.lane { display: grid; grid-template-columns: repeat(10, 160px); gap: 8px; padding: 10px; }
article { height: 130px; box-sizing: border-box; padding: 14px; border: 1px solid var(--bing-border); border-radius: 8px; }
</style>
