import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { parseMarkdown, type Node, type ElementNode } from 'comark'
import { renderMarkdown } from 'comark/render'
import { renderExampleCode } from '../../shared/docs/example-code.ts'
import { renderUpgradeGuide } from '../../shared/docs/release.ts'
import { assertEntryVersions, assertGuideCurrent, assertGuideLinks, renderReadme, siteReviewManifest } from './release-docs.ts'
import { componentDefinitions, componentSlugs, type ComponentSlug } from './doc-registry.ts'
export { componentDefinitions, componentSlugs, type ComponentSlug } from './doc-registry.ts'
import type { DocsApiTable, DocsApiTables } from '../../shared/docs/types.ts'
import {
  componentMigrations, componentTitle, docsVersion, getComponentMigration, getMigrationStatus,
  migrationSlugs, versionNotice, type MigrationRegistry,
} from '../../shared/docs/migration.ts'
export { docsVersion } from '../../shared/docs/migration.ts'

export const projectRoot = fileURLToPath(new URL('../../', import.meta.url))

export type ExportContext = {
  tables: DocsApiTables
  examples: Record<string, string>
}

function markdownText(value: string): string {
  // 数据单元格是普通文本，防止 string[]、泛型、下划线等被当成 Markdown/Comark 语法。
  // 竖线由 Comark 的表格序列化器处理，避免重复转义。
  return value.replace(/([\\\x60*_[\]{}<>])/g, '\\$1')
}

function inlineCode(node: Node): string {
  const textContent = (value: Node): string => typeof value === 'string'
    ? value : value.slice(2).map(child => textContent(child as Node)).join('')
  const content = textContent(node)
  const longest = Math.max(0, ...Array.from(content.matchAll(/`+/g), match => match[0].length))
  const fence = '`'.repeat(longest + 1)
  // 避免内容首尾的反引号与边界相连；CommonMark 会移除补上的一对空格。
  const padding = /^`|`$/.test(content) || (/^ .* $/.test(content) && /\S/.test(content)) ? ' ' : ''
  return fence + padding + content + padding + fence
}

function tableNode(table: DocsApiTable): ElementNode {
  if (!table.headers.length || table.codeColumns < 0 || table.codeColumns > table.headers.length) {
    throw new Error('API 表头或代码列配置无效')
  }
  if (table.rows.some(row => row.length !== table.headers.length)) {
    throw new Error('API 表格的单元格数量与表头不一致')
  }
  return ['table', {},
    ['thead', {}, ['tr', {}, ...table.headers.map((header): Node => ['th', {}, markdownText(header)])]],
    ['tbody', {}, ...table.rows.map((row): Node =>
      ['tr', {}, ...row.map((cell, index): Node =>
        ['td', {}, ...(index < table.codeColumns ? [['code', {}, cell] as Node] : [markdownText(cell)])],
      )],
    )],
  ]
}

export async function expandDocument(source: string, context: ExportContext): Promise<string> {
  const document = await parseMarkdown(source, { headingIds: false, autoUnwrap: false })
  const usedTables = new Set<string>()
  const usedExamples = new Set<string>()
  const standardTags = new Set([
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'code', 'pre', 'strong', 'em', 'del',
    'ul', 'ol', 'li', 'blockquote', 'hr', 'br', 'a', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
  ])

  function expand(nodes: Node[]): Node[] {
    return nodes.flatMap((node): Node[] => {
      if (typeof node === 'string') return [node]
      const [tag, attrs, ...children] = node
      if (tag === null) return []
      if (tag === 'article' || tag === 'section') return expand(children)
      if (tag === 'p' && attrs.class === 'doc-eyebrow') return []
      if (tag === 'docs-callout') {
        const titles: Record<string, string> = { note: '备注', info: '信息', tip: '提示', warning: '注意', danger: '危险' }
        const type = String(attrs.type ?? 'note')
        if (!Object.hasOwn(titles, type)) throw new Error('未知提示类型：' + type)
        const title = String(attrs.title || titles[type])
        return [['blockquote', {}, ['p', {}, ['strong', {}, markdownText(title)]], ...expand(children)]]
      }
      if (tag === 'docs-api-table') {
        const name = String(attrs.name ?? '')
        const table = Object.hasOwn(context.tables, name) ? context.tables[name] : undefined
        if (!table) throw new Error('未找到 API 表：' + name)
        if (children.length) throw new Error('API 表引用不能包含未处理的子内容')
        usedTables.add(name)
        return [tableNode(table)]
      }
      if (Object.hasOwn(context.examples, tag)) {
        const code = context.examples[tag]!.replaceAll('\r\n', '\n').trim()
        if (!code) throw new Error('示例代码为空：' + tag)
        usedExamples.add(tag)
        // 示例插槽里的说明同样属于文档，保留在代码前面。
        return [...expand(children), ['pre', { language: 'vue' }, ['code', {}, code]]]
      }
      if (!standardTags.has(tag)) throw new Error('尚未支持导出的节点：' + tag)
      const cleanAttrs: Record<string, unknown> = {}
      // 只保留普通 Markdown 有意义的属性，去掉网页 class、id 和 Comark 元数据。
      for (const key of ['href', 'title', 'start', 'language', 'align']) {
        if (attrs[key] !== undefined) cleanAttrs[key] = attrs[key]
      }
      if (typeof cleanAttrs.href === 'string' && cleanAttrs.href.startsWith('#')) {
        throw new Error('内部锚点需先配置导出映射：' + cleanAttrs.href)
      }
      return [[tag, cleanAttrs, ...expand(children)]]
    })
  }

  const nodes = expand(document.nodes)
  for (const name of Object.keys(context.tables)) {
    if (!usedTables.has(name)) throw new Error('正文遗漏 API 表：' + name)
  }
  for (const name of Object.keys(context.examples)) {
    if (!usedExamples.has(name)) throw new Error('正文遗漏示例：' + name)
  }
  return (await renderMarkdown({ nodes }, { components: { code: inlineCode } })).trim() + '\n'
}

export async function extractVueExamples(markdown: string): Promise<string[]> {
  const document = await parseMarkdown(markdown, { headingIds: false, autoUnwrap: false })
  const examples: string[] = []
  function textContent(node: Node): string {
    return typeof node === 'string' ? node : node.slice(2).map(child => textContent(child as Node)).join('')
  }
  function visit(nodes: Node[]) {
    for (const node of nodes) {
      if (typeof node === 'string') continue
      if (node[0] === 'pre' && node[1].language === 'vue') {
        examples.push(node.slice(2).map(child => textContent(child as Node)).join(''))
      } else {
        visit(node.slice(2) as Node[])
      }
    }
  }
  visit(document.nodes)
  return examples
}

export function assertPackageVersion(actual: string): void {
  if (actual !== docsVersion.packageVersion) {
    throw new Error('已安装 Bing UI ' + actual + '，但文档目标版本为 ' + docsVersion.packageVersion + '；请先安装目标版本，组件验证状态另行记录')
  }
}

export async function buildAiArtifacts(migrations: MigrationRegistry = componentMigrations): Promise<Record<string, string>> {
  const read = (relative: string) => readFile(new URL('../../' + relative, import.meta.url), 'utf8')
  const packageText = await read('node_modules/@moubing/bing-ui/package.json')
  assertPackageVersion((JSON.parse(packageText) as { version: string }).version)
  const declaredPackage = JSON.parse(await read('package.json'))
  assertPackageVersion(declaredPackage.dependencies[docsVersion.packageName])
  assertEntryVersions(Object.fromEntries(await Promise.all([
    'app/pages/index.vue', 'app/pages/docs/index.vue', 'app/layouts/docs.vue',
  ].map(async path => [path, await read(path)]))))
  const guideSource = await read('content/guides/upgrade.md')
  assertGuideCurrent(guideSource)
  const guide = renderUpgradeGuide(guideSource)
  await assertGuideLinks(guide, read)
  const artifacts: Record<string, string> = {}
  const upgradeMarkdown = await expandDocument(guide, { tables: {}, examples: {} })
  artifacts['public/ai/guides/upgrade.md'] = upgradeMarkdown
  artifacts['README.md'] = renderReadme(await read('README.md'), componentSlugs.length,
    componentSlugs.reduce((count, slug) => count + Object.keys(componentDefinitions[slug].examples).length, 0))
  const components: Record<string, {
    title: string; path: string; contentSha256: string
    status: ReturnType<typeof getMigrationStatus>; verifiedVersion: string | null
    migration: MigrationRegistry[keyof MigrationRegistry]
  }> = {}
  for (const slug of componentSlugs) {
    const definition = componentDefinitions[slug]
    const migration = getComponentMigration(slug, migrations)
    const status = getMigrationStatus(migration)
    const [source, entries] = await Promise.all([
      read('content/components/' + slug + '.md'),
      Promise.all(Object.entries(definition.examples).map(async ([tag, filename]) => {
        const code = await read('examples/' + slug + '/' + filename + '.vue')
        return [tag, code.includes('@docs-options:start') ? renderExampleCode(code) : code] as const
      })),
    ])
    const body = await expandDocument(source, { tables: definition.tables, examples: Object.fromEntries(entries) })
    const heading = '# ' + definition.title + '\n'
    if (!body.startsWith(heading)) throw new Error(slug + ' 文档缺少预期标题')
    const preamble = [
      '# ' + definition.title,
      '',
      '> 目标组件包：' + docsVersion.packageName + (migration.unreleased ? ' 下一版（尚未发布）；正式基线：' : ' ') + docsVersion.packageVersion + '；文档修订：' + docsVersion.docsRevision + '。',
      '> ' + (status === 'verified' ? '已验证：' : '迁移中：') + versionNotice(migration),
      '',
      '此文件由正文、API 数据和完整示例自动生成，可直接阅读，不需要启动文档站。修改源文件后运行 pnpm docs:export ' + slug + '；请勿手工修改生成结果。',
      '',
      '运行示例需要已配置 Vue 3 单文件组件的项目，依赖 Vue 3.5 与 GSAP 3.15 系列，导入 zod 的示例另需安装 Zod 4（Bing UI 的可选 peer 依赖）；Bing UI 使用上方标注的版本。示例已导入组件和样式，不依赖 Nuxt 别名、文档站组件或组件自动注册。' + definition.count + ' Vue 代码块是独立示例，分别保存为一个 .vue 文件使用。TypeScript 项目需配置 CSS 导入类型声明，例如 Vite 项目的 vite/client。',
      '',
      definition.note,
      '',
    ].join('\n')
    const markdown = preamble + '\n' + body.slice(heading.length).trimStart()
    const path = 'components/' + slug + '.md'
    artifacts['public/ai/' + path] = markdown
    components[slug] = {
      title: definition.title, path, contentSha256: createHash('sha256').update(markdown).digest('hex'),
      status, verifiedVersion: status === 'verified' ? docsVersion.packageVersion : null, migration,
    }
  }
  const coverage = componentSlugs.filter(slug => components[slug]!.status === 'verified')
  const pendingCoverage = componentSlugs.filter(slug => components[slug]!.status !== 'verified')
  const plannedCoverage = migrationSlugs.filter(slug => !Object.hasOwn(componentDefinitions, slug))
  for (const slug of plannedCoverage) {
    if (getMigrationStatus(migrations[slug]) === 'verified') throw new Error(slug + ' 尚未登记文档，不能标为已验证')
  }
  const manifest = {
    ...docsVersion,
    status: pendingCoverage.length || plannedCoverage.length ? 'migrating' : 'experimental',
    coverage,
    pendingCoverage,
    plannedCoverage,
    components,
    siteReview: siteReviewManifest(),
    guides: { upgrade: { path: 'guides/upgrade.md', contentSha256: createHash('sha256').update(upgradeMarkdown).digest('hex') } },
    historicalVersions: [],
  }
  const index = [
    '# Bing UI 文档入口',
    '',
    '> 目标组件包：' + docsVersion.packageName + ' ' + docsVersion.packageVersion + '，文档修订 ' + docsVersion.docsRevision + '。已验证 ' + coverage.length + ' / ' + migrationSlugs.length + ' 个组件。',
    '',
    '先核对使用方实际安装的组件版本。迁移中的文档尚未完成目标版本验证，不作为新版已验证参考。当前没有历史版本快照。组件覆盖不代表全站导读或线上部署已验证；全站验收另见清单 siteReview，pending 表示待核对。',
    '',
    '- [版本与覆盖清单](ai/manifest.json)',
    '- [版本升级指南：兼容变化、无需迁移项与历史边界](ai/guides/upgrade.md)',
    '',
    '## 已验证组件',
    '',
    ...(coverage.length ? coverage.map(slug => '- [' + componentDefinitions[slug].title + '：' + componentDefinitions[slug].summary + '](ai/components/' + slug + '.md)') : ['暂无。']),
    ...(pendingCoverage.length ? [
      '', '## 迁移中（待验证）', '',
      ...pendingCoverage.map(slug => '- [' + componentDefinitions[slug].title + '：待验证](ai/components/' + slug + '.md)'),
    ] : []),
    ...(plannedCoverage.length ? [
      '', '## 待新增', '',
      ...plannedCoverage.map(slug => '- ' + componentTitle(slug) + '（阶段 ' + migrations[slug].phase + '）'),
    ] : []),
    '',
  ].join('\n')
  return {
    ...artifacts,
    'public/ai/manifest.json': JSON.stringify(manifest, null, 2) + '\n',
    'public/llms.txt': index,
  }
}

// 单组件命令不能把另一份过期文档的 SHA 写成新版本，也不能删掉另一组件的索引。
export function selectArtifacts(
  expected: Record<string, string>, current: Record<string, string | undefined>, component?: ComponentSlug,
): Record<string, string> {
  if (!component) return expected
  for (const slug of componentSlugs) {
    const path = 'public/ai/components/' + slug + '.md'
    if (slug !== component && current[path] !== expected[path]) {
      throw new Error(slug + ' 的生成文档缺失或过期，请先运行 pnpm docs:export 同步全部组件，再使用单组件命令')
    }
  }
  return Object.fromEntries(Object.entries(expected).filter(([path]) =>
    !path.startsWith('public/ai/components/') || path === 'public/ai/components/' + component + '.md',
  ))
}
