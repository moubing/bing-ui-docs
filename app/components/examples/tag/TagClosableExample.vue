<script setup lang="ts">
import { BingButton, BingCodeBlock, BingTag } from '@moubing/bing-ui'
import { useExamples } from './state'
const { closableTags, removeTag, restoreTags, closableCode } = useExamples()
</script>

<template>
  <div class="doc-example">
    <div class="doc-example__preview tag-demo-stage">
      <p class="preview-label">可移除筛选项</p>
      <div class="tag-demo-row">
        <ClientOnly>
          <BingTag
            v-for="tag in closableTags"
            :key="tag.id"
            :label="tag.label"
            :tone="tag.tone"
            closable
            @close="removeTag(tag.id)"
          />
          <BingTag label="禁用" tone="neutral" closable disabled close-aria-label="移除禁用标签" />
        </ClientOnly>
      </div>
    </div>

    <div class="doc-example__controls">
      <BingButton size="sm" variant="secondary" @click="restoreTags">恢复标签</BingButton>
    </div>
  </div>

  <BingCodeBlock
    :code="closableCode"
    language="vue"
    title="代码示例"
    wrap
  />
</template>
