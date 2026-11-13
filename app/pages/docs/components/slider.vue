<script setup lang="ts">
import DocsMarkdown from '~/components/content/DocsMarkdown.vue'
import Example from '~/components/examples/slider/SliderBasicExample.vue'
import RangeExample from '~/components/examples/slider/SliderRangeExample.vue'
import VerticalExample from '~/components/examples/slider/SliderVerticalExample.vue'
import ControlledExample from '~/components/examples/slider/SliderControlledExample.vue'
import source from '~~/content/components/slider.md?raw'
import { sliderApi } from '#shared/docs/slider'
definePageMeta({ layout: 'docs' })
const components = { 'slider-basic-example': Example, 'slider-range-example': RangeExample, 'slider-vertical-example': VerticalExample, 'slider-controlled-example': ControlledExample }
</script>

<template>
  <DocsMarkdown document-id="slider" :source="source" :tables="sliderApi" :components="components" />
</template>
