<script setup lang="ts">
import DocsMarkdown from '~/components/content/DocsMarkdown.vue'
import ResizableBasicExample from '~/components/examples/resizable/ResizableBasicExample.vue'
import ResizableModesExample from '~/components/examples/resizable/ResizableModesExample.vue'
import ResizableConstraintsExample from '~/components/examples/resizable/ResizableConstraintsExample.vue'
import ResizableMethodsExample from '~/components/examples/resizable/ResizableMethodsExample.vue'
import ResizableControlledExample from '~/components/examples/resizable/ResizableControlledExample.vue'
import { provideExamples } from '~/components/examples/resizable/state'
import source from '~~/content/components/resizable.md?raw'
import { resizableApi } from '#shared/docs/resizable'

definePageMeta({ layout: 'docs' })
provideExamples()
const components = {
  'resizable-basic-example': ResizableBasicExample,
  'resizable-modes-example': ResizableModesExample,
  'resizable-constraints-example': ResizableConstraintsExample,
  'resizable-methods-example': ResizableMethodsExample,
  'resizable-controlled-example': ResizableControlledExample,
}
</script>

<template>
  <DocsMarkdown document-id="resizable" :source="source" :tables="resizableApi" :components="components" />
</template>
