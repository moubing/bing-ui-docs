<script setup lang="ts">
import { Bell, Search } from 'lucide-vue-next'
import { BingCodeBlock, BingIcon } from '@moubing/bing-ui'
import { useExamples } from './state'
const { accessibilityCode } = useExamples()
</script>

<template>
  <div class="doc-example doc-example--stacked">
    <div class="doc-example__preview">
      <p class="preview-label">语义差异</p>
      <div class="icon-access-grid">
        <div class="icon-access-card">
          <ClientOnly>
            <BingIcon :icon="Search" tone="muted" decorative />
          </ClientOnly>
          <strong>装饰性图标</strong>
          <span>渲染 <code>aria-hidden="true"</code>，不会进入屏幕阅读器内容。</span>
        </div>
        <div class="icon-access-card">
          <ClientOnly>
            <BingIcon :icon="Bell" tone="warning" :decorative="false" label="打开通知" />
          </ClientOnly>
          <strong>语义图标</strong>
          <span>渲染 <code>role="img"</code> 和 <code>aria-label="打开通知"</code>。</span>
        </div>
      </div>
    </div>
  </div>

  <BingCodeBlock :code="accessibilityCode" language="vue" title="代码示例" wrap />
</template>
