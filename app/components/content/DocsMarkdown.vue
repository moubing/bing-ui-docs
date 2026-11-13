<script setup lang="ts">
import { computed, provide, toRef, type Component } from 'vue'
import { parseMarkdown } from '@comark/nuxt/parse'
import type { DocsApiTables } from '#shared/docs/types'
import DocsApiTable from './DocsApiTable.vue'
import DocsCallout from '~/components/DocsCallout.vue'
import { docsApiKey } from './docs-api-context'
import { docsVersion, getComponentMigration, getMigrationStatus, versionNotice } from '#shared/docs/migration'

const props = defineProps<{
  documentId: string
  source: string
  tables: DocsApiTables
  components: Record<string, Component>
}>()

provide(docsApiKey, toRef(props, 'tables'))
const migration = computed(() => getComponentMigration(props.documentId))
const migrationStatus = computed(() => getMigrationStatus(migration.value))

const { data: document } = await useAsyncData(`component-doc:${props.documentId}`, async () => {
  // 目录沿用 section ID 和显式标题 ID；禁止额外生成标题锚点。
  return parseMarkdown(props.source, { autoUnwrap: false, headingIds: false })
}, { watch: [() => props.source] })
</script>

<template>
  <div class="docs-document" :data-docs-route="`/docs/components/${documentId}`">
    <DocsCallout
      v-if="migrationStatus !== 'verified'"
      type="note"
      :title="`${docsVersion.packageVersion} 文档更新中`"
      :data-docs-migration="migrationStatus"
      class="docs-version-notice"
    >
      <p>{{ versionNotice(migration) }}</p>
    </DocsCallout>
    <MarkdownDocument
      v-if="document"
      :value="document"
      :components="{ 'docs-api-table': DocsApiTable, 'docs-callout': DocsCallout, ...components }"
    />
  </div>
</template>

<style scoped>
.docs-version-notice {
  margin-bottom: 1.5rem;
}
</style>
