<script setup lang="ts">
import DocsMarkdown from '~/components/content/DocsMarkdown.vue'
import DatePickerBasicExample from '~/components/examples/date-picker/DatePickerBasicExample.vue'
import DatePickerSinglesExample from '~/components/examples/date-picker/DatePickerSinglesExample.vue'
import DatePickerRangesExample from '~/components/examples/date-picker/DatePickerRangesExample.vue'
import DatePickerRulesExample from '~/components/examples/date-picker/DatePickerRulesExample.vue'
import DatePickerMethodsExample from '~/components/examples/date-picker/DatePickerMethodsExample.vue'
import { provideExamples } from '~/components/examples/date-picker/state'
import source from '~~/content/components/date-picker.md?raw'
import { datePickerApi } from '#shared/docs/date-picker'

definePageMeta({ layout: 'docs' })
provideExamples()
const components = {
  'date-picker-basic-example': DatePickerBasicExample,
  'date-picker-singles-example': DatePickerSinglesExample,
  'date-picker-ranges-example': DatePickerRangesExample,
  'date-picker-rules-example': DatePickerRulesExample,
  'date-picker-methods-example': DatePickerMethodsExample,
}
</script>

<template>
  <DocsMarkdown document-id="date-picker" :source="source" :tables="datePickerApi" :components="components" />
</template>
