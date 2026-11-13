<script setup lang="ts">
import DocsMarkdown from '~/components/content/DocsMarkdown.vue'
import CardBasicExample from '~/components/examples/card/CardBasicExample.vue'
import CardVariantsExample from '~/components/examples/card/CardVariantsExample.vue'
import CardEntranceExample from '~/components/examples/card/CardEntranceExample.vue'
import CardPresetsExample from '~/components/examples/card/CardPresetsExample.vue'
import CardFlipExample from '~/components/examples/card/CardFlipExample.vue'
import CardSlotsExample from '~/components/examples/card/CardSlotsExample.vue'
import { provideExamples } from '~/components/examples/card/state'
import source from '~~/content/components/card.md?raw'
import { cardApi } from '#shared/docs/card'

definePageMeta({ layout: 'docs' })
provideExamples()
const components = {
  'card-basic-example': CardBasicExample,
  'card-variants-example': CardVariantsExample,
  'card-entrance-example': CardEntranceExample,
  'card-presets-example': CardPresetsExample,
  'card-flip-example': CardFlipExample,
  'card-slots-example': CardSlotsExample,
}
</script>

<template>
  <DocsMarkdown document-id="card" :source="source" :tables="cardApi" :components="components" />
</template>
