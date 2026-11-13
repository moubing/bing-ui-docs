<script setup lang="ts">
import DocsMarkdown from '~/components/content/DocsMarkdown.vue'
import Example from '~/components/examples/table-column-controls/TableColumnControlsSharedExample.vue'
import source from '~~/content/components/table-column-controls.md?raw'
import { tableColumnControlsApi } from '#shared/docs/table-column-controls'
definePageMeta({ layout: 'docs' })
const components = { 'table-column-controls-shared-example': Example }
</script>

<template>
  <DocsMarkdown document-id="table-column-controls" :source="source" :tables="tableColumnControlsApi" :components="components" />
</template>
