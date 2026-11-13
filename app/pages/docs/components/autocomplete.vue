<script setup lang="ts">
import { defineComponent, h } from 'vue'
import DocsMarkdown from '~/components/content/DocsMarkdown.vue'
import AutocompleteExamples from '~/components/examples/autocomplete/AutocompleteExamples.vue'
import source from '~~/content/components/autocomplete.md?raw'
import { autocompleteApi } from '#shared/docs/autocomplete'
definePageMeta({ layout: 'docs' })
const components = {
  'autocomplete-basic-example': AutocompleteExamples,
  'autocomplete-controlled-example': defineComponent({ setup: () => () => h(AutocompleteExamples, { controlled: true }) }),
  'autocomplete-actions-example': defineComponent({ setup: () => () => h(AutocompleteExamples, { actions: true }) }),
}
</script>
<template><DocsMarkdown document-id="autocomplete" :source="source" :tables="autocompleteApi" :components="components" /></template>
