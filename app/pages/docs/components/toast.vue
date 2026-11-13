<script setup lang="ts">
import DocsMarkdown from '~/components/content/DocsMarkdown.vue'
import ToastBasicExample from '~/components/examples/toast/ToastBasicExample.vue'
import ToastTypesExample from '~/components/examples/toast/ToastTypesExample.vue'
import ToastLoadingExample from '~/components/examples/toast/ToastLoadingExample.vue'
import ToastActionExample from '~/components/examples/toast/ToastActionExample.vue'
import ToastPositionsExample from '~/components/examples/toast/ToastPositionsExample.vue'
import { provideExamples } from '~/components/examples/toast/state'
import source from '~~/content/components/toast.md?raw'
import { toastApi } from '#shared/docs/toast'

definePageMeta({ layout: 'docs' })
provideExamples()
const components = {
  'toast-basic-example': ToastBasicExample,
  'toast-types-example': ToastTypesExample,
  'toast-loading-example': ToastLoadingExample,
  'toast-action-example': ToastActionExample,
  'toast-positions-example': ToastPositionsExample,
}
</script>

<template>
  <DocsMarkdown document-id="toast" :source="source" :tables="toastApi" :components="components" />
</template>
