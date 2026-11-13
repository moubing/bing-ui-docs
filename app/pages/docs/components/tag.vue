<script setup lang="ts">
import DocsMarkdown from '~/components/content/DocsMarkdown.vue'
import TagBasicExample from '~/components/examples/tag/TagBasicExample.vue'
import TagTonesExample from '~/components/examples/tag/TagTonesExample.vue'
import TagSizesExample from '~/components/examples/tag/TagSizesExample.vue'
import TagClosableExample from '~/components/examples/tag/TagClosableExample.vue'
import TagSlotExample from '~/components/examples/tag/TagSlotExample.vue'
import { provideExamples } from '~/components/examples/tag/state'
import source from '~~/content/components/tag.md?raw'
import { tagApi } from '#shared/docs/tag'

definePageMeta({ layout: 'docs' })
provideExamples()
const components = {
  'tag-basic-example': TagBasicExample,
  'tag-tones-example': TagTonesExample,
  'tag-sizes-example': TagSizesExample,
  'tag-closable-example': TagClosableExample,
  'tag-slot-example': TagSlotExample,
}
</script>

<template>
  <DocsMarkdown document-id="tag" :source="source" :tables="tagApi" :components="components" />
</template>
