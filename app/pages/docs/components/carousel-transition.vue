<script setup lang="ts">
import DocsMarkdown from '~/components/content/DocsMarkdown.vue'
import CarouselTransitionBasicExample from '~/components/examples/carousel-transition/CarouselTransitionBasicExample.vue'
import CarouselTransitionControlsExample from '~/components/examples/carousel-transition/CarouselTransitionControlsExample.vue'
import CarouselTransitionWheelExample from '~/components/examples/carousel-transition/CarouselTransitionWheelExample.vue'
import { provideExamples } from '~/components/examples/carousel-transition/state'
import source from '~~/content/components/carousel-transition.md?raw'
import { carouselTransitionApi } from '#shared/docs/carousel-transition'

definePageMeta({ layout: 'docs' })
provideExamples()
const components = {
  'carousel-transition-basic-example': CarouselTransitionBasicExample,
  'carousel-transition-controls-example': CarouselTransitionControlsExample,
  'carousel-transition-wheel-example': CarouselTransitionWheelExample,
}
</script>

<template>
  <DocsMarkdown document-id="carousel-transition" :source="source" :tables="carouselTransitionApi" :components="components" />
</template>
