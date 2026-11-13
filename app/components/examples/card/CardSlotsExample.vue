<script setup lang="ts">
import { BingButton, BingCard, BingCodeBlock } from '@moubing/bing-ui'
import { useExamples } from './state'
const { slotsCode } = useExamples()
</script>

<template>
  <div class="doc-example doc-example--stacked">
    <div class="doc-example__preview">
      <p class="preview-label">结构示例</p>
      <ClientOnly>
        <BingCard title="任务卡片" description="使用多个插槽组织复杂内容。" variant="accent" rounded="lg">
          <template #media>
            <div class="card-demo-media">
              <span>media</span>
            </div>
          </template>

          <template #header>
            <div class="card-custom-header">
              <span class="card-status-dot"></span>
              <div>
                <strong>自定义头部</strong>
                <p>可替代默认 title 与 description。</p>
              </div>
            </div>
          </template>

          <p>默认插槽承载正文内容，适合放说明、指标或简短列表。</p>

          <template #footer>
            <BingButton size="sm">开始处理</BingButton>
            <BingButton size="sm" variant="ghost">稍后查看</BingButton>
          </template>

          <template #back>
            <div class="card-back-face">
              <strong>反面插槽</strong>
              <span>用于承载翻面后的扩展内容。</span>
            </div>
          </template>
        </BingCard>
      </ClientOnly>
    </div>
  </div>

  <BingCodeBlock :code="slotsCode" language="vue" title="代码示例" wrap />
</template>
