<script setup lang="ts">
import { BingTag } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
</script>

<template>
  <div class="tags">
    <BingTag tone="success" variant="soft">
      <span class="tag-content"><span class="tag-dot" aria-hidden="true"></span>已发布</span>
    </BingTag>
    <BingTag tone="neutral" variant="soft" size="sm">+3</BingTag>
    <BingTag tone="warning" variant="glass" label="这是一个很长的标签文案，会被省略展示" />
  </div>
</template>

<style scoped>
.tags { display: flex; flex-wrap: wrap; gap: 12px; max-width: 300px; }
.tag-content { display: inline-flex; align-items: center; gap: 6px; }
.tag-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; flex: none; }
</style>
