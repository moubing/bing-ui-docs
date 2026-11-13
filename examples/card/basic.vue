<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingCard, type BingCardProps } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

// @docs-options:start
const options: BingCardProps = {
  "title": "洞察面板",
  "description": "把信息、操作和轻量动效放在同一个内容容器里。",
  "variant": "soft",
  "padding": "md",
  "rounded": "md",
  "glass": true,
  "tilt": true,
  "glare": true,
  "disabled": false
}
// @docs-options:end
const message = ref('')
</script>

<template>
  <BingCard v-bind="options">
    <p>转化率 <strong>18.6%</strong></p>
    <p>活跃用户 <strong>4,280</strong></p>
    <template #footer>
      <div @pointerdown.stop @click.stop>
        <BingButton size="sm" variant="ghost" :disabled="options.disabled" @click="message = '已查看详情'">查看详情</BingButton>
      </div>
    </template>
  </BingCard>
  <p role="status">{{ message }}</p>
</template>
