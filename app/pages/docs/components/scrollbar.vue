<script setup lang="ts">
import DocsMarkdown from '~/components/content/DocsMarkdown.vue'
import ScrollbarBasicExample from '~/components/examples/scrollbar/ScrollbarBasicExample.vue'
import ScrollbarHorizontalExample from '~/components/examples/scrollbar/ScrollbarHorizontalExample.vue'
import ScrollbarSmoothExample from '~/components/examples/scrollbar/ScrollbarSmoothExample.vue'
import ScrollbarMethodsExample from '~/components/examples/scrollbar/ScrollbarMethodsExample.vue'
import ScrollbarViewportExample from '~/components/examples/scrollbar/ScrollbarViewportExample.vue'
import { provideExamples } from '~/components/examples/scrollbar/state'
import source from '~~/content/components/scrollbar.md?raw'
import { scrollbarApi } from '#shared/docs/scrollbar'

definePageMeta({ layout: 'docs' })
provideExamples()
const components = {
  'scrollbar-basic-example': ScrollbarBasicExample,
  'scrollbar-horizontal-example': ScrollbarHorizontalExample,
  'scrollbar-smooth-example': ScrollbarSmoothExample,
  'scrollbar-methods-example': ScrollbarMethodsExample,
  'scrollbar-viewport-example': ScrollbarViewportExample,
}
</script>

<template>
  <DocsMarkdown document-id="scrollbar" :source="source" :tables="scrollbarApi" :components="components" />
</template>
