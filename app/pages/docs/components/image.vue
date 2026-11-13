<script setup lang="ts">
import DocsMarkdown from '~/components/content/DocsMarkdown.vue'
import ImageBasicExample from '~/components/examples/image/ImageBasicExample.vue'
import ImageFallbackExample from '~/components/examples/image/ImageFallbackExample.vue'
import ImageCropExample from '~/components/examples/image/ImageCropExample.vue'
import ImagePreviewExample from '~/components/examples/image/ImagePreviewExample.vue'
import ImageSlotsExample from '~/components/examples/image/ImageSlotsExample.vue'
import { provideExamples } from '~/components/examples/image/state'
import source from '~~/content/components/image.md?raw'
import { imageApi } from '#shared/docs/image'

definePageMeta({ layout: 'docs' })
provideExamples()
const components = {
  'image-basic-example': ImageBasicExample,
  'image-fallback-example': ImageFallbackExample,
  'image-crop-example': ImageCropExample,
  'image-preview-example': ImagePreviewExample,
  'image-slots-example': ImageSlotsExample,
}
</script>

<template>
  <DocsMarkdown document-id="image" :source="source" :tables="imageApi" :components="components" />
</template>
