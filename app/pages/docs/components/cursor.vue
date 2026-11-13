<script setup lang="ts">
import DocsMarkdown from '~/components/content/DocsMarkdown.vue'
import CursorBasicExample from '~/components/examples/cursor/CursorBasicExample.vue'
import CursorStatesExample from '~/components/examples/cursor/CursorStatesExample.vue'
import CursorAppearanceExample from '~/components/examples/cursor/CursorAppearanceExample.vue'
import CursorNativeExample from '~/components/examples/cursor/CursorNativeExample.vue'
import CursorScopeExample from '~/components/examples/cursor/CursorScopeExample.vue'
import source from '~~/content/components/cursor.md?raw'
import { cursorApi } from '#shared/docs/cursor'

definePageMeta({ layout: 'docs' })
const components = {
  'cursor-basic-example': CursorBasicExample,
  'cursor-states-example': CursorStatesExample,
  'cursor-appearance-example': CursorAppearanceExample,
  'cursor-native-example': CursorNativeExample,
  'cursor-scope-example': CursorScopeExample,
}
</script>

<template>
  <DocsMarkdown document-id="cursor" :source="source" :tables="cursorApi" :components="components" />
</template>
