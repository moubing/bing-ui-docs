<script setup lang="ts">
import AnimatedTextMotionExample from '~/components/examples/animated-text/AnimatedTextMotionExample.vue'
import DocsMarkdown from '~/components/content/DocsMarkdown.vue'
import AnimatedTextBasicExample from '~/components/examples/animated-text/AnimatedTextBasicExample.vue'
import AnimatedTextShineExample from '~/components/examples/animated-text/AnimatedTextShineExample.vue'
import AnimatedTextJumpExample from '~/components/examples/animated-text/AnimatedTextJumpExample.vue'
import AnimatedTextDisabledExample from '~/components/examples/animated-text/AnimatedTextDisabledExample.vue'
import { provideExamples } from '~/components/examples/animated-text/state'
import source from '~~/content/components/animated-text.md?raw'
import { animatedTextApi } from '#shared/docs/animated-text'

definePageMeta({ layout: 'docs' })
provideExamples()
const components = {
  'animated-text-motion-example': AnimatedTextMotionExample,
  'animated-text-basic-example': AnimatedTextBasicExample,
  'animated-text-shine-example': AnimatedTextShineExample,
  'animated-text-jump-example': AnimatedTextJumpExample,
  'animated-text-disabled-example': AnimatedTextDisabledExample,
}
</script>

<template>
  <DocsMarkdown document-id="animated-text" :source="source" :tables="animatedTextApi" :components="components" />
</template>
