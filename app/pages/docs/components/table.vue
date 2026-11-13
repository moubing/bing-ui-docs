<script setup lang="ts">
import DocsMarkdown from '~/components/content/DocsMarkdown.vue'
import TableControlsExample from '~/components/examples/table/TableControlsExample.vue'
import TableBasicExample from '~/components/examples/table/TableBasicExample.vue'
import TableTreeExample from '~/components/examples/table/TableTreeExample.vue'
import TableColumnsExample from '~/components/examples/table/TableColumnsExample.vue'
import TableVirtualExample from '~/components/examples/table/TableVirtualExample.vue'
import TableMethodsExample from '~/components/examples/table/TableMethodsExample.vue'
import TableRemoteExample from '~/components/examples/table/TableRemoteExample.vue'
import TableKeyboardExample from '~/components/examples/table/TableKeyboardExample.vue'
import TableCascadeExample from '~/components/examples/table/TableCascadeExample.vue'
import TableRemoteSelectionExample from '~/components/examples/table/TableRemoteSelectionExample.vue'
import TableActiveExample from '~/components/examples/table/TableActiveExample.vue'
import TableVariableExample from '~/components/examples/table/TableVariableExample.vue'
import TableErrorExample from '~/components/examples/table/TableErrorExample.vue'
import TableSkeletonExample from '~/components/examples/table/TableSkeletonExample.vue'
import TableFocusExample from '~/components/examples/table/TableFocusExample.vue'
import TableThemeExample from '~/components/examples/table/TableThemeExample.vue'
import { provideExamples } from '~/components/examples/table/state'
import source from '~~/content/components/table.md?raw'
import { tableApi } from '#shared/docs/table'

definePageMeta({ layout: 'docs' })
provideExamples()
const components = {
  'table-controls-example': TableControlsExample,
  'table-basic-example': TableBasicExample,
  'table-tree-example': TableTreeExample,
  'table-columns-example': TableColumnsExample,
  'table-virtual-example': TableVirtualExample,
  'table-methods-example': TableMethodsExample,
  'table-remote-example': TableRemoteExample,
  'table-keyboard-example': TableKeyboardExample,
  'table-cascade-example': TableCascadeExample,
  'table-remote-selection-example': TableRemoteSelectionExample,
  'table-active-example': TableActiveExample,
  'table-variable-example': TableVariableExample,
  'table-error-example': TableErrorExample,
  'table-skeleton-example': TableSkeletonExample,
  'table-focus-example': TableFocusExample,
  'table-theme-example': TableThemeExample,
}
</script>

<template>
  <DocsMarkdown document-id="table" :source="source" :tables="tableApi" :components="components" />
</template>
