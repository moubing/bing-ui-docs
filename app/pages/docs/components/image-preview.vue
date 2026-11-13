<script setup lang="ts">
import DocsMarkdown from '~/components/content/DocsMarkdown.vue'
import ImagePreviewBasicExample from '~/components/examples/image-preview/ImagePreviewBasicExample.vue'
import ImagePreviewGalleryExample from '~/components/examples/image-preview/ImagePreviewGalleryExample.vue'
import ImagePreviewBehaviorExample from '~/components/examples/image-preview/ImagePreviewBehaviorExample.vue'
import ImagePreviewGlassExample from '~/components/examples/image-preview/ImagePreviewGlassExample.vue'
import { provideExamples } from '~/components/examples/image-preview/state'
import source from '~~/content/components/image-preview.md?raw'
import { imagePreviewApi } from '#shared/docs/image-preview'

definePageMeta({ layout: 'docs' })
provideExamples()
const components = {
  'image-preview-basic-example': ImagePreviewBasicExample,
  'image-preview-gallery-example': ImagePreviewGalleryExample,
  'image-preview-behavior-example': ImagePreviewBehaviorExample,
  'image-preview-glass-example': ImagePreviewGlassExample,
}
</script>

<template>
  <DocsMarkdown document-id="image-preview" :source="source" :tables="imagePreviewApi" :components="components" />
</template>
