<script setup lang="ts">
import DocsMarkdown from '~/components/content/DocsMarkdown.vue'
import DeckTransitionBasicExample from '~/components/examples/deck-transition/DeckTransitionBasicExample.vue'
import DeckTransitionPlaygroundExample from '~/components/examples/deck-transition/DeckTransitionPlaygroundExample.vue'
import DeckTransitionControlsExample from '~/components/examples/deck-transition/DeckTransitionControlsExample.vue'
import { provideExamples } from '~/components/examples/deck-transition/state'
import source from '~~/content/components/deck-transition.md?raw'
import { deckTransitionApi } from '#shared/docs/deck-transition'

definePageMeta({ layout: 'docs' })
provideExamples()
const components = {
  'deck-transition-basic-example': DeckTransitionBasicExample,
  'deck-transition-playground-example': DeckTransitionPlaygroundExample,
  'deck-transition-controls-example': DeckTransitionControlsExample,
}
</script>

<template>
  <DocsMarkdown document-id="deck-transition" :source="source" :tables="deckTransitionApi" :components="components" />
</template>
