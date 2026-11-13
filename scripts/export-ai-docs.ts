import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { buildAiArtifacts, componentSlugs, projectRoot, selectArtifacts, type ComponentSlug } from './lib/ai-docs.ts'

const args = process.argv.slice(2)
const allowed = new Set<string>([...componentSlugs, '--check'])
const selected = args.filter(arg => arg !== '--check')
if (args.some(arg => !allowed.has(arg)) || new Set(args).size !== args.length || selected.length > 1) {
  console.error('用法：pnpm docs:export [组件名] 或 pnpm docs:check [组件名]；省略时处理全部。已接入：' + componentSlugs.join('、'))
  process.exitCode = 1
} else {
  try {
    const check = args.includes('--check')
    const expected = await buildAiArtifacts()
    const current = Object.fromEntries(await Promise.all(Object.keys(expected).map(async (relative) => [
      relative,
      await readFile(resolve(projectRoot, relative), 'utf8').catch((error: NodeJS.ErrnoException) => {
        if (error.code === 'ENOENT') return undefined
        throw error
      }),
    ]))) as Record<string, string | undefined>
    const component = selected[0] as ComponentSlug | undefined
    const artifacts = selectArtifacts(expected, current, component)
    const stale: string[] = []
    // 先完成解析和所有引用检查，再写入生成结果。
    for (const [relative, content] of Object.entries(artifacts)) {
      const path = resolve(projectRoot, relative)
      if (current[relative] === content) continue
      if (check) {
        stale.push(relative)
      } else {
        await mkdir(dirname(path), { recursive: true })
        await writeFile(path, content, 'utf8')
      }
    }
    if (stale.length) throw new Error('生成文件缺失或过期，请运行 pnpm docs:export' + (component ? ' ' + component : '') + '：\n' + stale.join('\n'))
    const scope = component ?? componentSlugs.join('、')
    console.log(check
      ? scope + ' 导出检查通过：组件、升级指南、README、入口和版本清单与源文件一致。'
      : '已生成 ' + scope + ' 文档，并同步升级指南、README 版本统计、AI 入口和版本清单。')
  } catch (error) {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  }
}
