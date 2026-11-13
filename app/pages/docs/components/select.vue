<script setup lang="ts">
import DocsMarkdown from '~/components/content/DocsMarkdown.vue'
import SelectBasicExample from '~/components/examples/select/SelectBasicExample.vue'
import SelectMultipleExample from '~/components/examples/select/SelectMultipleExample.vue'
import SelectDetailExample from '~/components/examples/select/SelectDetailExample.vue'
import SelectVirtualExample from '~/components/examples/select/SelectVirtualExample.vue'
import SelectPanelExample from '~/components/examples/select/SelectPanelExample.vue'
import SelectSizesExample from '~/components/examples/select/SelectSizesExample.vue'
import SelectEventsExample from '~/components/examples/select/SelectEventsExample.vue'
import { provideExamples } from '~/components/examples/select/state'
import source from '~~/content/components/select.md?raw'
import { selectApi } from '#shared/docs/select'

definePageMeta({ layout: 'docs' })
provideExamples()
const components = {
  'select-basic-example': SelectBasicExample,
  'select-multiple-example': SelectMultipleExample,
  'select-detail-example': SelectDetailExample,
  'select-virtual-example': SelectVirtualExample,
  'select-panel-example': SelectPanelExample,
  'select-sizes-example': SelectSizesExample,
  'select-events-example': SelectEventsExample,
}
</script>

<template>
  <DocsMarkdown document-id="select" :source="source" :tables="selectApi" :components="components" />
</template>
