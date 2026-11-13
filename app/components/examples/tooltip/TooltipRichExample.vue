<script setup lang="ts">
import { BingButton, BingCodeBlock, BingIcon, BingTooltip } from '@moubing/bing-ui'
import { Sparkles } from 'lucide-vue-next'
import { useExamples } from './state'
const { examplesActive, richActionCount, richContentCode } = useExamples()
</script>

<template>
  <div class="doc-example">
    <div class="doc-example__preview tooltip-demo-stage">
      <ClientOnly v-if="examplesActive">
        <BingTooltip id="docs-tooltip-rich" trigger="click" placement="right" :open-delay="0" max-width="320px">
          <template #default="{ triggerProps }">
          <BingButton variant="secondary" :throttle="false" v-bind="triggerProps">
            字段说明
            <template #prefix>
              <BingIcon :icon="Sparkles" :size="16" decorative />
            </template>
          </BingButton>
          </template>

          <template #content>
            <div class="tooltip-rich-content">
              <strong>价格策略</strong>
              <span>这里可以放多行说明、状态标签和轻量操作，用来解释当前字段为什么重要。</span>
              <BingButton size="xs" variant="primary" :throttle="false" @click="richActionCount += 1">
                标记已读
              </BingButton>
            </div>
          </template>
        </BingTooltip>
      </ClientOnly>

      <p class="tooltip-feedback">
        <span>浮层内按钮点击：{{ richActionCount }} 次</span>
      </p>
    </div>

    <div class="doc-example__controls">
      <p>
        富内容提示仍然是 tooltip，不适合承载复杂表单或强决策流程。需要阻塞用户、确认危险操作或展示大量内容时，应该使用 Dialog 这类更明确的浮层。
      </p>
    </div>
  </div>

  <BingCodeBlock :code="richContentCode" language="vue" title="代码示例" wrap />
</template>
