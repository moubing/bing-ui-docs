<script setup lang="ts">
import DialogGuardExample from '~/components/examples/dialog/DialogGuardExample.vue'
import DocsMarkdown from '~/components/content/DocsMarkdown.vue'
import DialogBasicExample from '~/components/examples/dialog/DialogBasicExample.vue'
import DialogFooterExample from '~/components/examples/dialog/DialogFooterExample.vue'
import DialogAmbienceExample from '~/components/examples/dialog/DialogAmbienceExample.vue'
import DialogBehaviorExample from '~/components/examples/dialog/DialogBehaviorExample.vue'
import DialogNestedExample from '~/components/examples/dialog/DialogNestedExample.vue'
import DialogFrameExample from '~/components/examples/dialog/DialogFrameExample.vue'
import { provideExamples } from '~/components/examples/dialog/state'
import source from '~~/content/components/dialog.md?raw'
import { dialogApi } from '#shared/docs/dialog'

definePageMeta({ layout: 'docs' })
provideExamples()
const components = {
  'dialog-guard-example': DialogGuardExample,
  'dialog-basic-example': DialogBasicExample,
  'dialog-footer-example': DialogFooterExample,
  'dialog-ambience-example': DialogAmbienceExample,
  'dialog-behavior-example': DialogBehaviorExample,
  'dialog-nested-example': DialogNestedExample,
  'dialog-frame-example': DialogFrameExample,
}
</script>

<template>
  <DocsMarkdown document-id="dialog" :source="source" :tables="dialogApi" :components="components" />
</template>
