import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { buildAiArtifacts, componentSlugs } from './lib/ai-docs.ts'
import { assertLibraryRelease, assertLiveRelease } from './lib/release-verification.ts'
import { docsVersion } from '../shared/docs/migration.ts'

const args = process.argv.slice(2)
const options: Record<string, string> = {}
try {
  for (let index = 0; index < args.length; index += 2) {
    const key = args[index]!
    const value = args[index + 1]
    if (!['--library-dir', '--site'].includes(key) || !value || value.startsWith('--') || options[key]) {
      throw new Error('用法：pnpm docs:check-release [--library-dir <组件库绝对路径>] [--site <线上 origin>]，至少指定一项。')
    }
    options[key] = value
  }
  if (!args.length) throw new Error('用法：pnpm docs:check-release [--library-dir <组件库绝对路径>] [--site <线上 origin>]，至少指定一项。')
  const artifacts = await buildAiArtifacts()
  if (options['--library-dir']) {
    const directory = resolve(options['--library-dir'])
    const [packageText, readme, changelog] = await Promise.all(['package.json', 'README.md', 'CHANGELOG.md'].map(path => readFile(resolve(directory, path), 'utf8')))
    const library = JSON.parse(packageText!)
    if (library.name !== docsVersion.packageName) throw new Error('目标目录不是 Bing UI 组件库')
    assertLibraryRelease(library.version, readme!, changelog!, componentSlugs.length)
    console.log(`组件库 README / package.json / CHANGELOG 已核对：${library.version}，${componentSlugs.length} 个组件文档页。`)
  }
  if (options['--site']) {
    const site = new URL(options['--site'])
    if (!['http:', 'https:'].includes(site.protocol) || site.username || site.password || site.pathname !== '/' || site.search || site.hash) {
      throw new Error('--site 只接受不含凭证、路径、查询或片段的 HTTP(S) origin')
    }
    const paths = ['/ai/manifest.json', '/llms.txt', '/ai/guides/upgrade.md', '/', '/docs', '/docs/upgrade']
    const remote = Object.fromEntries(await Promise.all(paths.map(async path => {
      const response = await fetch(new URL(path, site), { cache: 'no-store', signal: AbortSignal.timeout(20_000) })
      if (!response.ok) throw new Error(`线上读取失败：${path} HTTP ${response.status}`)
      return [path, await response.text()]
    })))
    assertLiveRelease(remote, artifacts)
    console.log(JSON.stringify({ site: site.origin, ...docsVersion, verifiedAt: new Date().toISOString(), checked: paths }, null, 2))
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
}
