<script setup lang="ts">
import DocsMarkdown from '~/components/content/DocsMarkdown.vue'
import TextareaBasicExample from '~/components/examples/textarea/TextareaBasicExample.vue'
import TextareaAutosizeExample from '~/components/examples/textarea/TextareaAutosizeExample.vue'
import TextareaResizeExample from '~/components/examples/textarea/TextareaResizeExample.vue'
import TextareaEventsExample from '~/components/examples/textarea/TextareaEventsExample.vue'
import TextareaMethodsExample from '~/components/examples/textarea/TextareaMethodsExample.vue'
import TextareaSubmitExample from '~/components/examples/textarea/TextareaSubmitExample.vue'
import { provideExamples } from '~/components/examples/textarea/state'
import source from '~~/content/components/textarea.md?raw'
import { textareaApi } from '#shared/docs/textarea'

definePageMeta({ layout: 'docs' })
provideExamples()
const components = {
  'textarea-basic-example': TextareaBasicExample,
  'textarea-autosize-example': TextareaAutosizeExample,
  'textarea-resize-example': TextareaResizeExample,
  'textarea-events-example': TextareaEventsExample,
  'textarea-methods-example': TextareaMethodsExample,
  'textarea-submit-example': TextareaSubmitExample,
}
</script>

<template>
  <DocsMarkdown document-id="textarea" :source="source" :tables="textareaApi" :components="components" />
</template>
