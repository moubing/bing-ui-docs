import type { InjectionKey, Ref } from 'vue'
import type { DocsApiTables } from '#shared/docs/types'

export const docsApiKey: InjectionKey<Readonly<Ref<DocsApiTables>>> = Symbol('docs-api-tables')
