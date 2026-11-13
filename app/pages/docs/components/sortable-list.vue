<script setup lang="ts">
import DocsMarkdown from '~/components/content/DocsMarkdown.vue'
import SortableListBasicExample from '~/components/examples/sortable-list/SortableListBasicExample.vue'
import SortableListDisabledExample from '~/components/examples/sortable-list/SortableListDisabledExample.vue'
import SortableListHorizontalExample from '~/components/examples/sortable-list/SortableListHorizontalExample.vue'
import SortableListControlledExample from '~/components/examples/sortable-list/SortableListControlledExample.vue'
import SortableListOverlayExample from '~/components/examples/sortable-list/SortableListOverlayExample.vue'
import { provideExamples } from '~/components/examples/sortable-list/state'
import source from '~~/content/components/sortable-list.md?raw'
import { sortableListApi } from '#shared/docs/sortable-list'

definePageMeta({ layout: 'docs' })
provideExamples()
const components = {
  'sortable-list-basic-example': SortableListBasicExample,
  'sortable-list-disabled-example': SortableListDisabledExample,
  'sortable-list-horizontal-example': SortableListHorizontalExample,
  'sortable-list-controlled-example': SortableListControlledExample,
  'sortable-list-overlay-example': SortableListOverlayExample,
}
</script>

<template>
  <DocsMarkdown document-id="sortable-list" :source="source" :tables="sortableListApi" :components="components" />
</template>
