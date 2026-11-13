export type DocsApiTable = {
  headers: readonly string[]
  codeColumns: number
  rows: readonly (readonly string[])[]
}

export type DocsApiTables = Record<string, DocsApiTable>
