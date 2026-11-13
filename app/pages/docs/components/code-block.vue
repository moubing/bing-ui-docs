<script setup lang="ts">
import DocsMarkdown from '~/components/content/DocsMarkdown.vue'
import CodeBlockBasicExample from '~/components/examples/code-block/CodeBlockBasicExample.vue'
import CodeBlockHighlightExample from '~/components/examples/code-block/CodeBlockHighlightExample.vue'
import CodeBlockWrapExample from '~/components/examples/code-block/CodeBlockWrapExample.vue'
import CodeBlockResizableExample from '~/components/examples/code-block/CodeBlockResizableExample.vue'
import CodeBlockTokensExample from '~/components/examples/code-block/CodeBlockTokensExample.vue'
import { provideExamples } from '~/components/examples/code-block/state'
import source from '~~/content/components/code-block.md?raw'
import { codeBlockApi } from '#shared/docs/code-block'

definePageMeta({ layout: 'docs' })
provideExamples()
const components = {
  'code-block-basic-example': CodeBlockBasicExample,
  'code-block-highlight-example': CodeBlockHighlightExample,
  'code-block-wrap-example': CodeBlockWrapExample,
  'code-block-resizable-example': CodeBlockResizableExample,
  'code-block-tokens-example': CodeBlockTokensExample,
}
</script>

<template>
  <DocsMarkdown document-id="code-block" :source="source" :tables="codeBlockApi" :components="components" />
</template>
