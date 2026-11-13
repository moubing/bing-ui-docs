<script setup lang="ts">
import DocsMarkdown from '~/components/content/DocsMarkdown.vue'
import FilePreviewBasicExample from '~/components/examples/file-preview/FilePreviewBasicExample.vue'
import FilePreviewLimitsExample from '~/components/examples/file-preview/FilePreviewLimitsExample.vue'
import FilePreviewOfficeExample from '~/components/examples/file-preview/FilePreviewOfficeExample.vue'
import { provideExamples } from '~/components/examples/file-preview/state'
import FilePreviewNestedExample from '~/components/examples/file-preview/FilePreviewNestedExample.vue'
import source from '~~/content/components/file-preview.md?raw'
import { filePreviewApi } from '#shared/docs/file-preview'

definePageMeta({ layout: 'docs' })
provideExamples()
const components = {
  'file-preview-basic-example': FilePreviewBasicExample,
  'file-preview-limits-example': FilePreviewLimitsExample,
  'file-preview-office-example': FilePreviewOfficeExample,
  'file-preview-nested-example': FilePreviewNestedExample,
}
</script>

<template>
  <DocsMarkdown document-id="file-preview" :source="source" :tables="filePreviewApi" :components="components" />
</template>
