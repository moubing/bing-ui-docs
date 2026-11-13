<script setup lang="ts">
import { onActivated, onDeactivated, onMounted, ref } from 'vue'
import { BingCodeBlock } from '@moubing/bing-ui'

defineOptions({ inheritAttrs: false })
withDefaults(defineProps<{
  code: string
  language?: string
  title?: string
  maxHeight?: string | number
}>(), { language: 'vue', title: '代码示例' })

const details = ref<HTMLDetailsElement | null>(null)
const expanded = ref(false)
const active = ref(true)
onActivated(() => { active.value = true })
onDeactivated(() => { active.value = false })
function syncExpanded() {
  expanded.value = details.value?.open === true
}
onMounted(syncExpanded)
</script>

<template>
  <details ref="details" class="docs-example-code" @toggle="syncExpanded">
    <summary>{{ title }}<span>{{ expanded ? '收起' : '展开查看' }}</span></summary>
    <BingCodeBlock
      v-if="expanded && active"
      v-bind="$attrs"
      :code="code"
      :language="language"
      :title="title"
      :max-height="maxHeight"
    />
    <!-- SSR 保留完整代码，关闭时不创建逐词高亮节点和滚动监听器。 -->
    <pre v-else class="docs-example-code__fallback" :style="{ maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight }"><code>{{ code }}</code></pre>
  </details>
</template>

<style scoped>
.docs-example-code {
  margin-top: 16px;
  border: 1px solid var(--bing-border);
  border-radius: 8px;
  background: var(--bing-surface);
}

.docs-example-code > summary {
  padding: 12px 16px;
  color: var(--bing-text);
  cursor: pointer;
  font-size: 13px;
}

.docs-example-code > summary > span {
  float: right;
  color: var(--bing-muted);
}

.docs-example-code[open] > summary {
  border-bottom: 1px solid var(--bing-border);
}

.docs-example-code > :deep(.bing-code-block) {
  margin: 0;
  border: 0;
}

.docs-example-code__fallback {
  margin: 0;
  overflow: auto;
  padding: 16px;
  font-size: 13px;
}

.doc-page .docs-example-code__fallback code {
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
}
</style>
