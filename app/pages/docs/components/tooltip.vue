<script setup lang="ts">
import TooltipToolbarExample from '~/components/examples/tooltip/TooltipToolbarExample.vue'
import DocsMarkdown from '~/components/content/DocsMarkdown.vue'
import TooltipBasicExample from '~/components/examples/tooltip/TooltipBasicExample.vue'
import TooltipRichExample from '~/components/examples/tooltip/TooltipRichExample.vue'
import TooltipPlacementExample from '~/components/examples/tooltip/TooltipPlacementExample.vue'
import TooltipManualExample from '~/components/examples/tooltip/TooltipManualExample.vue'
import { provideExamples } from '~/components/examples/tooltip/state'
import source from '~~/content/components/tooltip.md?raw'
import { tooltipApi } from '#shared/docs/tooltip'

definePageMeta({ layout: 'docs' })
provideExamples()
const components = {
  'tooltip-toolbar-example': TooltipToolbarExample,
  'tooltip-basic-example': TooltipBasicExample,
  'tooltip-rich-example': TooltipRichExample,
  'tooltip-placement-example': TooltipPlacementExample,
  'tooltip-manual-example': TooltipManualExample,
}
</script>

<template>
  <DocsMarkdown document-id="tooltip" :source="source" :tables="tooltipApi" :components="components" />
</template>
