<script setup lang="ts">
import DocsMarkdown from '~/components/content/DocsMarkdown.vue'
import FormLayoutExample from '~/components/examples/form/FormLayoutExample.vue'
import FormMethodsExample from '~/components/examples/form/FormMethodsExample.vue'
import FormAutoFocusExample from '~/components/examples/form/FormAutoFocusExample.vue'
import source from '~~/content/components/form.md?raw'
import { formApi } from '#shared/docs/form'

definePageMeta({ layout: 'docs' })

const components = {
  'form-layout-example': FormLayoutExample,
  'form-methods-example': FormMethodsExample,
  'form-auto-focus-example': FormAutoFocusExample,
}
</script>

<template>
  <DocsMarkdown document-id="form" :source="source" :tables="formApi" :components="components" />
</template>
