/** 网页提示与 AI 导出共用，目标版本不等于已验证版本。 */
export const docsVersion = {
  packageName: '@moubing/bing-ui',
  packageVersion: '0.19.0',
  docsRevision: 'r3',
} as const

export const migrationCheckLabels = {
  content: 'API / 正文',
  preview: '网页预览',
  examples: '独立示例',
  ai: 'AI 导出',
  validation: '验证',
} as const

export type MigrationCheck = keyof typeof migrationCheckLabels
export type ComponentMigration = {
  /** 下一版源码文档，正式依赖尚未包含对应 API 或行为调整。 */
  unreleased?: boolean
  phase: number
  previousVerifiedVersion: string | null
  checks: Record<MigrationCheck, boolean>
}

function pending(phase: number, previousVerifiedVersion: string | null = '0.6.0'): ComponentMigration {
  return {
    phase,
    previousVerifiedVersion,
    checks: { content: false, preview: false, examples: false, ai: false, validation: false },
  }
}

function verified(phase: number, previousVerifiedVersion: string | null = '0.6.0'): ComponentMigration {
  return {
    ...pending(phase, previousVerifiedVersion),
    checks: { content: true, preview: true, examples: true, ai: true, validation: true },
  }
}

// 各项验收后分别更新 checks；仅生成文件不会自动标记 AI 用法已验证。
export const componentMigrations = {
  autocomplete: verified(8, '0.18.4'),
  button: verified(2, '0.18.4'),
  input: verified(2, '0.17.0'),
  select: verified(2, '0.16.0'),
  card: verified(2),
  icon: verified(3),
  textarea: verified(3, '0.17.0'),
  checkbox: verified(3, '0.15.0'),
  'checkbox-group': verified(3, '0.15.0'),
  radio: verified(3),
  'radio-group': verified(3),
  tag: verified(3),
  form: verified(3),
  'form-item': verified(3),
  'tree-select': verified(4, '0.16.0'),
  'date-picker': verified(4),
  'color-picker': verified(4),
  'config-provider': verified(10, null),
  'drop-down': verified(4, '0.18.2'),
  tooltip: verified(4, '0.15.0'),
  dialog: verified(9, '0.15.0'),
  toast: verified(4, '0.13.2'),
  scrollbar: verified(5, '0.11.1'),
  tabs: verified(5, '0.18.4'),
  resizable: verified(5, '0.12.4'),
  'sortable-list': verified(5),
  'drag-drop': verified(11, null),
  table: verified(9, '0.17.0'),
  'table-column-controls': verified(9, null),
  'split-pane': verified(9, null),
  slider: verified(9, '0.18.3'),
  image: verified(6),
  'image-preview': verified(6),
  'file-preview': verified(6),
  'code-block': verified(6, '0.13.3'),
  'animated-text': verified(6, '0.15.0'),
  'app-switcher-transition': verified(6),
  'carousel-transition': verified(6),
  'deck-transition': verified(6),
  cursor: verified(7, '0.11.0'),
} satisfies Record<string, ComponentMigration>

export type MigrationSlug = keyof typeof componentMigrations
export type MigrationRegistry = Record<MigrationSlug, ComponentMigration>
export const migrationSlugs = Object.keys(componentMigrations) as MigrationSlug[]

export function getComponentMigration(slug: string, registry: MigrationRegistry = componentMigrations): ComponentMigration {
  if (!Object.hasOwn(registry, slug)) throw new Error('组件缺少迁移记录：' + slug)
  return registry[slug as MigrationSlug]
}

export function getMigrationStatus(migration: ComponentMigration): 'pending' | 'in-progress' | 'verified' {
  const checks = Object.keys(migrationCheckLabels) as MigrationCheck[]
  if (!migration.unreleased && checks.every(key => migration.checks[key] === true)) return 'verified'
  return checks.some(key => migration.checks[key] === true) ? 'in-progress' : 'pending'
}

export function componentTitle(slug: string): string {
  return 'Bing' + slug.split('-').map(part => part[0]!.toUpperCase() + part.slice(1)).join('')
}

export function versionNotice(migration: ComponentMigration): string {
  if (migration.unreleased) return '本页包含尚未发布的下一版 API 或行为调整，当前正式包 ' + docsVersion.packageVersion + ' 尚未包含这些变化；发布后再更新依赖与正式验证状态。'
  if (getMigrationStatus(migration) === 'verified') {
    return '已完成 ' + docsVersion.packageVersion + ' 的文档与示例验证。'
  }
  const previous = migration.previousVerifiedVersion
  return '尚未完成 ' + docsVersion.packageVersion + ' 的用法验证。' + (previous
    ? '内容仍可能包含 ' + previous + ' 的默认值与限制说明，请勿作为新版已验证用法直接使用。'
    : '该组件的文档与示例正在准备中。')
}
