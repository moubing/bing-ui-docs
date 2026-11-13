<script setup lang="ts">
import DocsMarkdown from '~/components/content/DocsMarkdown.vue'
import SizeExample from '~/components/examples/config-provider/ConfigProviderSizeExample.vue'
import LayersExample from '~/components/examples/config-provider/ConfigProviderLayersExample.vue'
import MotionExample from '~/components/examples/config-provider/ConfigProviderMotionExample.vue'
import source from '~~/content/components/config-provider.md?raw'
import { configProviderApi } from '#shared/docs/config-provider'
definePageMeta({ layout: 'docs' })
const components = {
  'config-provider-size-example': SizeExample,
  'config-provider-layers-example': LayersExample,
  'config-provider-motion-example': MotionExample,
}
</script>

<template>
  <DocsMarkdown document-id="config-provider" :source="source" :tables="configProviderApi" :components="components" />
</template>
