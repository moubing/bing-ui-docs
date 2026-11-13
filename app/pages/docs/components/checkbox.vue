<script setup lang="ts">
import CheckboxInteractionExample from '~/components/examples/checkbox/CheckboxInteractionExample.vue'
import DocsMarkdown from '~/components/content/DocsMarkdown.vue'
import CheckboxBasicExample from '~/components/examples/checkbox/CheckboxBasicExample.vue'
import CheckboxStatesExample from '~/components/examples/checkbox/CheckboxStatesExample.vue'
import CheckboxSizesExample from '~/components/examples/checkbox/CheckboxSizesExample.vue'
import CheckboxDecorativeExample from '~/components/examples/checkbox/CheckboxDecorativeExample.vue'
import CheckboxEventsExample from '~/components/examples/checkbox/CheckboxEventsExample.vue'
import { provideExamples } from '~/components/examples/checkbox/state'
import source from '~~/content/components/checkbox.md?raw'
import { checkboxApi } from '#shared/docs/checkbox'

definePageMeta({ layout: 'docs' })
provideExamples()
const components = {
  'checkbox-interaction-example': CheckboxInteractionExample,
  'checkbox-basic-example': CheckboxBasicExample,
  'checkbox-states-example': CheckboxStatesExample,
  'checkbox-sizes-example': CheckboxSizesExample,
  'checkbox-decorative-example': CheckboxDecorativeExample,
  'checkbox-events-example': CheckboxEventsExample,
}
</script>

<template>
  <DocsMarkdown document-id="checkbox" :source="source" :tables="checkboxApi" :components="components" />
</template>
