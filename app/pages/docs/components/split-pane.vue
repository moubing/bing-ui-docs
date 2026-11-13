<script setup lang="ts">
import DocsMarkdown from '~/components/content/DocsMarkdown.vue'
import Example from '~/components/examples/split-pane/SplitPaneBasicExample.vue'
import source from '~~/content/components/split-pane.md?raw'
import { splitPaneApi } from '#shared/docs/split-pane'
definePageMeta({ layout: 'docs' })
const components = { 'split-pane-basic-example': Example }
</script>

<template>
  <DocsMarkdown document-id="split-pane" :source="source" :tables="splitPaneApi" :components="components" />
</template>
