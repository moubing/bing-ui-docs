<script setup lang="ts">
import DocsMarkdown from '~/components/content/DocsMarkdown.vue'
import TreeSelectBasicExample from '~/components/examples/tree-select/TreeSelectBasicExample.vue'
import TreeSelectCascadeExample from '~/components/examples/tree-select/TreeSelectCascadeExample.vue'
import TreeSelectCustomExample from '~/components/examples/tree-select/TreeSelectCustomExample.vue'
import TreeSelectVirtualExample from '~/components/examples/tree-select/TreeSelectVirtualExample.vue'
import TreeSelectPanelExample from '~/components/examples/tree-select/TreeSelectPanelExample.vue'
import { provideExamples } from '~/components/examples/tree-select/state'
import source from '~~/content/components/tree-select.md?raw'
import { treeSelectApi } from '#shared/docs/tree-select'

definePageMeta({ layout: 'docs' })
provideExamples()
const components = {
  'tree-select-basic-example': TreeSelectBasicExample,
  'tree-select-cascade-example': TreeSelectCascadeExample,
  'tree-select-custom-example': TreeSelectCustomExample,
  'tree-select-virtual-example': TreeSelectVirtualExample,
  'tree-select-panel-example': TreeSelectPanelExample,
}
</script>

<template>
  <DocsMarkdown document-id="tree-select" :source="source" :tables="treeSelectApi" :components="components" />
</template>
