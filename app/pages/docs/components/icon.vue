<script setup lang="ts">
import DocsMarkdown from '~/components/content/DocsMarkdown.vue'
import IconBasicExample from '~/components/examples/icon/IconBasicExample.vue'
import IconSizesExample from '~/components/examples/icon/IconSizesExample.vue'
import IconTonesExample from '~/components/examples/icon/IconTonesExample.vue'
import IconAccessibilityExample from '~/components/examples/icon/IconAccessibilityExample.vue'
import { provideExamples } from '~/components/examples/icon/state'
import source from '~~/content/components/icon.md?raw'
import { iconApi } from '#shared/docs/icon'

definePageMeta({ layout: 'docs' })
provideExamples()
const components = {
  'icon-basic-example': IconBasicExample,
  'icon-sizes-example': IconSizesExample,
  'icon-tones-example': IconTonesExample,
  'icon-accessibility-example': IconAccessibilityExample,
}
</script>

<template>
  <DocsMarkdown document-id="icon" :source="source" :tables="iconApi" :components="components" />
</template>
