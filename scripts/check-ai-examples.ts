import { mkdir, mkdtemp, readdir, readFile, rmdir, unlink, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import { componentDefinitions, componentSlugs, extractVueExamples, projectRoot, type ComponentSlug } from './lib/ai-docs.ts'
import { uiCandidate } from './lib/ui-candidate.ts'

const args = process.argv.slice(2)
if (args.length > 1 || (args[0] && args[0] !== 'upgrade' && !componentSlugs.includes(args[0] as ComponentSlug))) {
  throw new Error('用法：pnpm typecheck:ai-examples [组件名|upgrade]；省略时检查全部已登记组件及升级指南。')
}
const selectedSlugs = args[0] === 'upgrade' ? [] : args[0] ? [args[0] as ComponentSlug] : componentSlugs
const candidate = uiCandidate()
const sources: { name: string; source: string; origin: string }[] = []
if (!args[0] || args[0] === 'upgrade') {
  const markdown = await readFile(join(projectRoot, 'public/ai/guides/upgrade.md'), 'utf8')
  const examples = await extractVueExamples(markdown)
  if (!examples.length) throw new Error('升级指南缺少当前写法的完整 Vue 示例')
  sources.push(...examples.map((source, index) => ({
    name: `upgrade--${index + 1}.vue`, source, origin: `content/guides/upgrade.md（当前写法 ${index + 1}）`,
  })))
}
for (const slug of selectedSlugs) {
  const names = Object.values(componentDefinitions[slug].examples)
  const count = names.length
  const markdown = await readFile(join(projectRoot, 'public/ai/components/' + slug + '.md'), 'utf8')
  const examples = await extractVueExamples(markdown)
  if (examples.length !== count) throw new Error(slug + ' 导出必须包含 ' + count + ' 个完整 Vue 示例')
  sources.push(...examples.map((source, index) => ({
    name: slug + '--' + names[index] + '.vue', source, origin: 'examples/' + slug + '/' + names[index] + '.vue',
  })))
}
const fixtureNames = (await readdir(join(projectRoot, 'tests/fixtures/ai-docs'))).filter(name => /^(?:[\w-]+-)?understanding\.vue$/.test(name)).sort()
for (const name of fixtureNames) {
  const slug = name === 'understanding.vue' ? 'form' : name.replace(/-understanding\.vue$/, '')
  if (!selectedSlugs.includes(slug as ComponentSlug)) continue
  sources.push({ name: 'reading--' + name, source: await readFile(join(projectRoot, 'tests/fixtures/ai-docs', name), 'utf8'), origin: 'tests/fixtures/ai-docs/' + name })
}

await mkdir(join(projectRoot, '.cache'), { recursive: true })
const directory = await mkdtemp(join(projectRoot, '.cache/ai-docs-types-'))
const files: string[] = []
try {
  for (const { name, source } of sources) {
    const file = join(directory, name)
    files.push(file)
    await writeFile(file, source)
  }
  const config = join(directory, 'tsconfig.json')
  files.push(config)
  await writeFile(config, JSON.stringify({
    compilerOptions: {
      target: 'ESNext', module: 'ESNext', moduleResolution: 'Bundler',
      strict: true, noEmit: true, skipLibCheck: true, types: ['vite/client'],
      // 候选声明在另一个仓库，必须和示例使用同一份 Vue peer 类型，模拟安装发布包后的解析。
      ...(candidate ? { paths: { '@moubing/bing-ui': [candidate.types], vue: [join(projectRoot, 'node_modules/vue/dist/vue.d.ts')] } } : {}),
    },
    vueCompilerOptions: { strictTemplates: true },
    include: ['./*.vue'],
  }))
  const result = spawnSync(process.execPath, [
    join(projectRoot, 'node_modules/vue-tsc/bin/vue-tsc.js'), '--project', config,
  ], { cwd: projectRoot, encoding: 'utf8' })
  if (result.error) throw result.error
  if (result.status !== 0) {
    let diagnostics = result.stdout + result.stderr
    for (const { name, origin } of sources) {
      diagnostics = diagnostics.replaceAll('.cache/' + directory.split(/[\\/]/).at(-1) + '/' + name, origin)
    }
    throw new Error(diagnostics)
  }
  console.log((args[0] === 'upgrade' ? '升级指南' : selectedSlugs.length + ' 个组件的导出示例及理解用例' + (!args[0] ? '与升级指南' : '')) + '（共 ' + sources.length + ' 个 SFC）通过严格类型检查，无文档站别名或自动导入。')
} finally {
  // 只清理本次创建的文件和空目录，不递归删除其他工作区内容。
  await Promise.all(files.map(file => unlink(file).catch((error: NodeJS.ErrnoException) => {
    if (error.code !== 'ENOENT') throw error
  })))
  await rmdir(directory)
}
