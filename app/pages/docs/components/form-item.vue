<script setup lang="ts">
import DocsMarkdown from '~/components/content/DocsMarkdown.vue'
import FormItemMessageExample from '~/components/examples/form-item/FormItemMessageExample.vue'
import FormItemSpanExample from '~/components/examples/form-item/FormItemSpanExample.vue'
import FormItemSlotExample from '~/components/examples/form-item/FormItemSlotExample.vue'
import source from '~~/content/components/form-item.md?raw'
import { formItemApi } from '#shared/docs/form-item'

definePageMeta({ layout: 'docs' })

const components = {
  'form-item-message-example': FormItemMessageExample,
  'form-item-span-example': FormItemSpanExample,
  'form-item-slot-example': FormItemSlotExample,
}
</script>

<template>
  <DocsMarkdown document-id="form-item" :source="source" :tables="formItemApi" :components="components" />
</template>
