<script setup lang="ts">
import DocsMarkdown from '~/components/content/DocsMarkdown.vue'
import RadioGroupBasicExample from '~/components/examples/radio-group/RadioGroupBasicExample.vue'
import RadioGroupOptionsExample from '~/components/examples/radio-group/RadioGroupOptionsExample.vue'
import RadioGroupSlotExample from '~/components/examples/radio-group/RadioGroupSlotExample.vue'
import RadioGroupKeyboardExample from '~/components/examples/radio-group/RadioGroupKeyboardExample.vue'
import { provideExamples } from '~/components/examples/radio-group/state'
import source from '~~/content/components/radio-group.md?raw'
import { radioGroupApi } from '#shared/docs/radio-group'

definePageMeta({ layout: 'docs' })
provideExamples()
const components = {
  'radio-group-basic-example': RadioGroupBasicExample,
  'radio-group-options-example': RadioGroupOptionsExample,
  'radio-group-slot-example': RadioGroupSlotExample,
  'radio-group-keyboard-example': RadioGroupKeyboardExample,
}
</script>

<template>
  <DocsMarkdown document-id="radio-group" :source="source" :tables="radioGroupApi" :components="components" />
</template>
