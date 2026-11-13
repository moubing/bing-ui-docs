<script setup lang="ts">
import DocsMarkdown from '~/components/content/DocsMarkdown.vue'
import ColorPickerBasicExample from '~/components/examples/color-picker/ColorPickerBasicExample.vue'
import ColorPickerPresetsExample from '~/components/examples/color-picker/ColorPickerPresetsExample.vue'
import ColorPickerSizesExample from '~/components/examples/color-picker/ColorPickerSizesExample.vue'
import ColorPickerEventsExample from '~/components/examples/color-picker/ColorPickerEventsExample.vue'
import { provideExamples } from '~/components/examples/color-picker/state'
import source from '~~/content/components/color-picker.md?raw'
import { colorPickerApi } from '#shared/docs/color-picker'

definePageMeta({ layout: 'docs' })
provideExamples()
const components = {
  'color-picker-basic-example': ColorPickerBasicExample,
  'color-picker-presets-example': ColorPickerPresetsExample,
  'color-picker-sizes-example': ColorPickerSizesExample,
  'color-picker-events-example': ColorPickerEventsExample,
}
</script>

<template>
  <DocsMarkdown document-id="color-picker" :source="source" :tables="colorPickerApi" :components="components" />
</template>
