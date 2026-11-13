<script setup lang="ts">
import DocsMarkdown from '~/components/content/DocsMarkdown.vue'
import InputBasicExample from '~/components/examples/input/InputBasicExample.vue'
import InputStatesExample from '~/components/examples/input/InputStatesExample.vue'
import InputIconsExample from '~/components/examples/input/InputIconsExample.vue'
import InputDebounceExample from '~/components/examples/input/InputDebounceExample.vue'
import InputMethodsExample from '~/components/examples/input/InputMethodsExample.vue'
import InputNumberExample from '~/components/examples/input/InputNumberExample.vue'
import InputReadonlyExample from '~/components/examples/input/InputReadonlyExample.vue'
import InputEditingExample from '~/components/examples/input/InputEditingExample.vue'
import InputControlledExample from '~/components/examples/input/InputControlledExample.vue'
import { provideExamples } from '~/components/examples/input/state'
import source from '~~/content/components/input.md?raw'
import { inputApi } from '#shared/docs/input'

definePageMeta({ layout: 'docs' })
provideExamples()
const components = {
  'input-basic-example': InputBasicExample,
  'input-states-example': InputStatesExample,
  'input-icons-example': InputIconsExample,
  'input-debounce-example': InputDebounceExample,
  'input-methods-example': InputMethodsExample,
  'input-number-example': InputNumberExample,
  'input-readonly-example': InputReadonlyExample,
  'input-editing-example': InputEditingExample,
  'input-controlled-example': InputControlledExample,
}
</script>

<template>
  <DocsMarkdown document-id="input" :source="source" :tables="inputApi" :components="components" />
</template>
