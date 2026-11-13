<script setup lang="ts">
import DropDownSelectionExample from '~/components/examples/drop-down/DropDownSelectionExample.vue'
import DocsMarkdown from '~/components/content/DocsMarkdown.vue'
import DropDownBasicExample from '~/components/examples/drop-down/DropDownBasicExample.vue'
import DropDownContextExample from '~/components/examples/drop-down/DropDownContextExample.vue'
import DropDownItemsExample from '~/components/examples/drop-down/DropDownItemsExample.vue'
import DropDownControlledExample from '~/components/examples/drop-down/DropDownControlledExample.vue'
import DropDownCaretExample from '~/components/examples/drop-down/DropDownCaretExample.vue'
import { provideExamples } from '~/components/examples/drop-down/state'
import source from '~~/content/components/drop-down.md?raw'
import { dropDownApi } from '#shared/docs/drop-down'

definePageMeta({ layout: 'docs' })
provideExamples()
const components = {
  'drop-down-selection-example': DropDownSelectionExample,
  'drop-down-caret-example': DropDownCaretExample,
  'drop-down-basic-example': DropDownBasicExample,
  'drop-down-context-example': DropDownContextExample,
  'drop-down-items-example': DropDownItemsExample,
  'drop-down-controlled-example': DropDownControlledExample,
}
</script>

<template>
  <DocsMarkdown document-id="drop-down" :source="source" :tables="dropDownApi" :components="components" />
</template>
