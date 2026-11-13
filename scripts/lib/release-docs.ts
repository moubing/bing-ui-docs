import { parseMarkdown, type Node } from 'comark'
import { docsVersion } from '../../shared/docs/migration.ts'
import { assertReleaseReview, releaseReview, renderUpgradeGuide, upgradeGuideTitle } from '../../shared/docs/release.ts'

export function renderReadme(source: string, componentCount: number, exampleCount: number): string {
  const blocks: Record<string, string> = {
    version: `文档站本身也使用 Bing UI 构建。当前运行依赖固定为 **\`${docsVersion.packageName}@${docsVersion.packageVersion}\`**，文档修订为 **${docsVersion.docsRevision}**。`,
    coverage: `当前注册表包含 **${componentCount} 个组件页面、${exampleCount} 个组件独立示例**，首页另有一份预览与复制共用的完整卡片示例。统计按文档页面计数，子组件和工具函数不另计；数量来自 [组件注册表](scripts/lib/doc-registry.ts)。组件验证与全站导读验收分别记录在 [版本清单](public/ai/manifest.json)，发布核对见 [发布记录](docs/release-validation.md)。`,
  }
  let result = source.replaceAll('\r\n', '\n')
  for (const [name, value] of Object.entries(blocks)) {
    const start = `<!-- docs:${name}:start -->`
    const end = `<!-- docs:${name}:end -->`
    if (result.split(start).length !== 2 || result.split(end).length !== 2 || result.indexOf(start) > result.indexOf(end)) {
      throw new Error(`README 缺少唯一的 ${name} 生成区块`)
    }
    const from = result.indexOf(start) + start.length
    result = result.slice(0, from) + '\n' + value + '\n' + result.slice(result.indexOf(end))
  }
  return result
}

export function assertGuideCurrent(source: string): void {
  assertReleaseReview()
  // 元数据必须来自共享数据源；仅检查当前安装区域，允许历史章节保留旧版本。
  for (const key of ['title', 'packageVersion', 'docsRevision', 'fromVersion', 'checkedAt', 'changelogUrl']) {
    if (!source.includes(`{{release.${key}}}`)) throw new Error('升级指南缺少共享元数据：' + key)
  }
  const rendered = renderUpgradeGuide(source)
  if (!rendered.includes('# ' + upgradeGuideTitle + ' {#overview}')) throw new Error('升级指南标题已过期')
  const install = rendered.match(/:::section\{id="install"[^\n]*\n([\s\S]*?)\n:::/)?.[1]
  const versions = [...(install ?? '').matchAll(/@moubing\/bing-ui@([\d.]+)/g)].map(match => match[1])
  if (!versions.length || versions.some(version => version !== docsVersion.packageVersion)) {
    throw new Error('升级指南推荐安装版本与目标版本不一致')
  }
}

export function assertEntryVersions(sources: Record<string, string>): void {
  for (const [path, source] of Object.entries(sources)) {
    if (/\d+\.\d+\.\d+ 升级指南/.test(source)) throw new Error(path + ' 的升级入口仍使用历史版本标题')
    if (!path.endsWith('index.vue')) continue
    const commands = [...source.matchAll(/(?:pnpm add|npm install|yarn add) @moubing\/bing-ui(@[^\s`'"]+)?/g)]
    if (!commands.length || commands.some(command => command[1] !== '@${docsVersion.packageVersion}')) {
      throw new Error(path + ' 的当前安装命令必须使用 docsVersion.packageVersion')
    }
  }
}

export async function assertGuideLinks(source: string, read: (path: string) => Promise<string>): Promise<void> {
  const parsed = await parseMarkdown(source, { headingIds: false, autoUnwrap: false })
  const links = new Set<string>()
  const ids = new Set<string>()
  function visit(nodes: Node[]) {
    for (const node of nodes) {
      if (typeof node === 'string') continue
      if (node[1].id) {
        const id = String(node[1].id)
        if (ids.has(id)) throw new Error('升级指南存在重复锚点：' + id)
        ids.add(id)
      }
      if (node[0] === 'a' && typeof node[1].href === 'string') links.add(node[1].href)
      visit(node.slice(2) as Node[])
    }
  }
  visit(parsed.nodes)
  for (const id of ['overview', 'install', 'package', 'config', 'cursor', 'table-scrollbar', 'visual', 'button-input', 'form', 'overlays', 'verify']) {
    if (!ids.has(id)) throw new Error('升级指南遗漏历史锚点：' + id)
  }
  const documents = new Map<string, string>()
  for (const href of links) {
    if (!href.startsWith('/docs')) continue
    const [route, hash] = href.split('#')
    const path = route === '/docs/upgrade' ? 'content/guides/upgrade.md'
      : route === '/docs' ? 'app/pages/docs/index.vue'
        : /^\/docs\/components\/[a-z-]+$/.test(route!) ? 'content/components/' + route!.split('/').at(-1) + '.md' : null
    if (!path) throw new Error('升级指南包含未知文档链接：' + href)
    if (!documents.has(path)) documents.set(path, route === '/docs/upgrade' ? source : await read(path))
    if (hash && !new RegExp(`(?:id="${hash}"|\\{#${hash}\\})`).test(documents.get(path)!)) {
      throw new Error('升级指南链接锚点不存在：' + href)
    }
  }
}

export function siteReviewManifest(input = releaseReview) {
  const { pages, ...review } = input
  return {
    ...review,
    scope: '全站导读验收独立于组件覆盖；导出不自动通过验证，线上部署需另外读取核对。',
    pages: Object.fromEntries(Object.entries(pages).map(([key, page]) => [key, {
      label: page.label, path: page.path,
      status: page.verified ? 'verified' : 'pending',
      verifiedVersion: page.verified ? input.packageVersion : null,
      verifiedRevision: page.verified ? input.docsRevision : null,
    }])),
  }
}
