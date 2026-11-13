<script setup lang="ts">
import { parseMarkdown } from '@comark/nuxt/parse'
import type { Node as MarkdownNode } from 'comark'
import { BingCodeBlock } from '@moubing/bing-ui'
import source from '../../../content/guides/upgrade.md?raw'
import { docsVersion } from '#shared/docs/migration'
import { renderUpgradeGuide } from '#shared/docs/release'

definePageMeta({ layout: 'docs' })

function nodeText(node: MarkdownNode): string {
  return typeof node === 'string' ? node : (node.slice(2) as MarkdownNode[]).map(nodeText).join('')
}

function renderCodeBlocks(nodes: MarkdownNode[]): MarkdownNode[] {
  return nodes.map((node): MarkdownNode => {
    if (typeof node === 'string' || node[0] === null) return node
    if (node[0] === 'pre') return ['bing-code-block', {
      code: nodeText(node), language: String(node[1].language ?? 'text'), wrap: true, lineNumbers: false,
    }]
    return [node[0], node[1], ...renderCodeBlocks(node.slice(2) as MarkdownNode[])]
  })
}

const { data: document } = await useAsyncData(`guide:upgrade:${docsVersion.packageVersion}:${docsVersion.docsRevision}`, async () => {
  const parsed = await parseMarkdown(renderUpgradeGuide(source), { autoUnwrap: false, headingIds: false })
  return { ...parsed, nodes: renderCodeBlocks(parsed.nodes) }
})
</script>

<template>
  <div class="docs-document" data-docs-route="/docs/upgrade">
    <MarkdownDocument v-if="document" :value="document" :components="{ 'bing-code-block': BingCodeBlock }" />
  </div>
</template>

<style scoped>
:deep(.upgrade-guide ul),
:deep(.upgrade-guide ol) {
  padding-left: 1.4rem;
  color: var(--bing-text);
  line-height: 1.85;
}

:deep(.upgrade-guide li + li) { margin-top: 0.8rem; }
:deep(.upgrade-guide a) { text-decoration: underline; text-underline-offset: 3px; }
:deep(.upgrade-guide code) { overflow-wrap: anywhere; }
</style>
