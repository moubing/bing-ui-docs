<script setup lang="ts">
import DocsMarkdown from '~/components/content/DocsMarkdown.vue'
import TabsBasicExample from '~/components/examples/tabs/TabsBasicExample.vue'
import TabsVariantsExample from '~/components/examples/tabs/TabsVariantsExample.vue'
import TabsItemSlotExample from '~/components/examples/tabs/TabsItemSlotExample.vue'
import TabsKeyboardExample from '~/components/examples/tabs/TabsKeyboardExample.vue'
import { provideTabsExamples } from '~/components/examples/tabs/state'
import source from '~~/content/components/tabs.md?raw'
import { tabsApi } from '#shared/docs/tabs'

definePageMeta({ layout: 'docs' })
provideTabsExamples()
const components = {
  'tabs-basic-example': TabsBasicExample,
  'tabs-variants-example': TabsVariantsExample,
  'tabs-item-slot-example': TabsItemSlotExample,
  'tabs-keyboard-example': TabsKeyboardExample,
}
</script>

<template>
  <DocsMarkdown document-id="tabs" :source="source" :tables="tabsApi" :components="components" />
</template>
