<script setup lang="ts">
import DocsMarkdown from '~/components/content/DocsMarkdown.vue'
import AppSwitcherTransitionBasicExample from '~/components/examples/app-switcher-transition/AppSwitcherTransitionBasicExample.vue'
import AppSwitcherTransitionControlsExample from '~/components/examples/app-switcher-transition/AppSwitcherTransitionControlsExample.vue'
import AppSwitcherTransitionSlotsExample from '~/components/examples/app-switcher-transition/AppSwitcherTransitionSlotsExample.vue'
import { provideExamples } from '~/components/examples/app-switcher-transition/state'
import source from '~~/content/components/app-switcher-transition.md?raw'
import { appSwitcherTransitionApi } from '#shared/docs/app-switcher-transition'

definePageMeta({ layout: 'docs' })
provideExamples()
const components = {
  'app-switcher-transition-basic-example': AppSwitcherTransitionBasicExample,
  'app-switcher-transition-controls-example': AppSwitcherTransitionControlsExample,
  'app-switcher-transition-slots-example': AppSwitcherTransitionSlotsExample,
}
</script>

<template>
  <DocsMarkdown document-id="app-switcher-transition" :source="source" :tables="appSwitcherTransitionApi" :components="components" />
</template>
