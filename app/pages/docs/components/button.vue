<script setup lang="ts">
import ButtonSwapExample from '~/components/examples/button/ButtonSwapExample.vue'
import ButtonBusyExample from '~/components/examples/button/ButtonBusyExample.vue'
import ButtonFlexRowExample from '~/components/examples/button/ButtonFlexRowExample.vue'
import DocsMarkdown from '~/components/content/DocsMarkdown.vue'
import ButtonBasicExample from '~/components/examples/button/ButtonBasicExample.vue'
import ButtonVariantsExample from '~/components/examples/button/ButtonVariantsExample.vue'
import ButtonSizesExample from '~/components/examples/button/ButtonSizesExample.vue'
import ButtonTextEffectExample from '~/components/examples/button/ButtonTextEffectExample.vue'
import ButtonThrottleExample from '~/components/examples/button/ButtonThrottleExample.vue'
import { provideExamples } from '~/components/examples/button/state'
import source from '~~/content/components/button.md?raw'
import { buttonApi } from '#shared/docs/button'

definePageMeta({ layout: 'docs' })
provideExamples()
const components = {
  'button-busy-example': ButtonBusyExample,
  'button-swap-example': ButtonSwapExample,
  'button-flex-row-example': ButtonFlexRowExample,
  'button-basic-example': ButtonBasicExample,
  'button-variants-example': ButtonVariantsExample,
  'button-sizes-example': ButtonSizesExample,
  'button-text-effect-example': ButtonTextEffectExample,
  'button-throttle-example': ButtonThrottleExample,
}
</script>

<template>
  <DocsMarkdown document-id="button" :source="source" :tables="buttonApi" :components="components" />
</template>
