<script setup lang="ts">
import DocsMarkdown from '~/components/content/DocsMarkdown.vue'
import RadioBasicExample from '~/components/examples/radio/RadioBasicExample.vue'
import RadioStatesExample from '~/components/examples/radio/RadioStatesExample.vue'
import RadioGroupExample from '~/components/examples/radio/RadioGroupExample.vue'
import RadioEventsExample from '~/components/examples/radio/RadioEventsExample.vue'
import { provideExamples } from '~/components/examples/radio/state'
import source from '~~/content/components/radio.md?raw'
import { radioApi } from '#shared/docs/radio'

definePageMeta({ layout: 'docs' })
provideExamples()
const components = {
  'radio-basic-example': RadioBasicExample,
  'radio-states-example': RadioStatesExample,
  'radio-group-example': RadioGroupExample,
  'radio-events-example': RadioEventsExample,
}
</script>

<template>
  <DocsMarkdown document-id="radio" :source="source" :tables="radioApi" :components="components" />
</template>
