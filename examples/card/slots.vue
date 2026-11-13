<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingCard } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const action = ref('等待操作')
</script>

<template>
  <BingCard title="任务卡片" description="使用多个插槽组织复杂内容。" variant="accent" rounded="lg">
    <template #media><div style="padding: 32px; text-align: center; background: linear-gradient(120deg, #93c5fd, #fbcfe8)">media</div></template>
    <template #header><strong>自定义头部</strong><p>可替代默认 title 与 description。</p></template>
    <p>默认插槽承载正文内容，适合放说明、指标或简短列表。</p>
    <template #footer>
      <div style="display: flex; flex-wrap: wrap; gap: 12px" @pointerdown.stop @click.stop>
        <BingButton size="sm" @click="action = '开始处理'">开始处理</BingButton>
        <BingButton size="sm" variant="ghost" @click="action = '稍后查看'">稍后查看</BingButton>
      </div>
    </template>
    <template #back><div>用于承载翻面后的扩展内容。</div></template>
  </BingCard>
  <p role="status">{{ action }}</p>
</template>
