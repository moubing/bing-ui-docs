<script setup lang="ts">
import CheckboxGroupBatchExample from '~/components/examples/checkbox-group/CheckboxGroupBatchExample.vue'
import DocsMarkdown from '~/components/content/DocsMarkdown.vue'
import CheckboxGroupBasicExample from '~/components/examples/checkbox-group/CheckboxGroupBasicExample.vue'
import CheckboxGroupOptionsExample from '~/components/examples/checkbox-group/CheckboxGroupOptionsExample.vue'
import CheckboxGroupSlotExample from '~/components/examples/checkbox-group/CheckboxGroupSlotExample.vue'
import CheckboxGroupEventsExample from '~/components/examples/checkbox-group/CheckboxGroupEventsExample.vue'
import CheckboxGroupStatusExample from '~/components/examples/checkbox-group/CheckboxGroupStatusExample.vue'
import { provideExamples } from '~/components/examples/checkbox-group/state'
import source from '~~/content/components/checkbox-group.md?raw'
import { checkboxGroupApi } from '#shared/docs/checkbox-group'

definePageMeta({ layout: 'docs' })
provideExamples()
const components = {
  'checkbox-group-batch-example': CheckboxGroupBatchExample,
  'checkbox-group-basic-example': CheckboxGroupBasicExample,
  'checkbox-group-options-example': CheckboxGroupOptionsExample,
  'checkbox-group-slot-example': CheckboxGroupSlotExample,
  'checkbox-group-events-example': CheckboxGroupEventsExample,
  'checkbox-group-status-example': CheckboxGroupStatusExample,
}
</script>

<template>
  <DocsMarkdown document-id="checkbox-group" :source="source" :tables="checkboxGroupApi" :components="components" />
</template>
