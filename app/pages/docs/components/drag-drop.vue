<script setup lang="ts">
import DocsMarkdown from '~/components/content/DocsMarkdown.vue'
import DragDropBasicExample from '~/components/examples/drag-drop/DragDropBasicExample.vue'
import DragDropRulesExample from '~/components/examples/drag-drop/DragDropRulesExample.vue'
import source from '~~/content/components/drag-drop.md?raw'
import { dragDropApi } from '#shared/docs/drag-drop'

definePageMeta({ layout: 'docs' })
const components = {
  'drag-drop-basic-example': DragDropBasicExample,
  'drag-drop-rules-example': DragDropRulesExample,
}
</script>

<template>
  <DocsMarkdown document-id="drag-drop" :source="source" :tables="dragDropApi" :components="components" />
</template>
