import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import { join, posix } from 'node:path'
import { test } from 'node:test'
import { compileScript, compileTemplate, parse } from '@vue/compiler-sfc'
import { parseMarkdown, type Node } from 'comark'
import {
  assertPackageVersion, buildAiArtifacts, componentDefinitions, componentSlugs, expandDocument, extractVueExamples, projectRoot, selectArtifacts,
} from '../../scripts/lib/ai-docs.ts'
import { formApi } from '../../shared/docs/form.ts'
import { renderExampleCode, renderFormLayoutCode } from '../../shared/docs/example-code.ts'
import {
  componentMigrations, docsVersion, getComponentMigration, getMigrationStatus, migrationCheckLabels,
  migrationSlugs, type ComponentMigration, type MigrationCheck,
} from '../../shared/docs/migration.ts'

const artifacts = await buildAiArtifacts()

test('生成结果可重复，产物与来源一致，入口、清单和 SHA-256 覆盖所有已登记组件', async () => {
  assert.deepEqual(await buildAiArtifacts(), artifacts)
  for (const [path, content] of Object.entries(artifacts)) {
    assert.equal(await readFile(join(projectRoot, path), 'utf8'), content, path + ' 已过期')
  }
  const manifest = JSON.parse(artifacts['public/ai/manifest.json']!)
  assert.equal(manifest.packageVersion, docsVersion.packageVersion)
  assert.deepEqual(manifest.coverage, componentSlugs.filter(slug => getMigrationStatus(componentMigrations[slug]) === 'verified'))
  assert.deepEqual(manifest.pendingCoverage, componentSlugs.filter(slug => getMigrationStatus(componentMigrations[slug]) !== 'verified'))
  assert.deepEqual(manifest.plannedCoverage, migrationSlugs.filter(slug => !componentSlugs.includes(slug as typeof componentSlugs[number])))
  for (const slug of componentSlugs) {
    const entry = manifest.components[slug]
    const content = artifacts[posix.join('public/ai', entry.path)]!
    assert.ok(content)
    assert.equal(createHash('sha256').update(content).digest('hex'), entry.contentSha256)
    const verified = getMigrationStatus(componentMigrations[slug]) === 'verified'
    assert.equal(entry.verifiedVersion, verified ? docsVersion.packageVersion : null)
    assert.match(content, verified ? /> 已验证：/ : /> 迁移中：/)
  }
  for (const link of artifacts['public/llms.txt']!.matchAll(/\]\(([^)]+)\)/g)) {
    assert.ok(artifacts[posix.join('public', link[1]!)], '入口中的链接必须存在')
  }
})

for (const slug of componentSlugs) {
  const markdown = artifacts['public/ai/components/' + slug + '.md']!
  test(slug + '：表格包含所有 API 行，联合类型的竖线不会破坏列数', async () => {
    const doc = await parseMarkdown(markdown, { headingIds: false })
    const tables: Node[][] = []
    function visit(nodes: Node[]) {
      for (const node of nodes) {
        if (typeof node === 'string') continue
        if (node[0] === 'table') tables.push(node.slice(2) as Node[])
        else if (node[0] !== 'pre') visit(node.slice(2) as Node[])
      }
    }
    function text(node: Node): string {
      return typeof node === 'string' ? node : (node.slice(2) as Node[]).map(text).join('')
    }
    visit(doc.nodes)
    const expected = Object.values(componentDefinitions[slug].tables)
    // 正文还可以包含键盘操作等说明表；API 表按完整表头识别，仍逐行核对内容。
    const apiTables = tables.filter(sections => {
      const head = sections[0] as Exclude<Node, string>
      const headerRow = head[2] as Exclude<Node, string>
      const headers = (headerRow.slice(2) as Node[]).map(text)
      return expected.some(table => JSON.stringify(table.headers) === JSON.stringify(headers))
    })
    assert.equal(apiTables.length, expected.length)
    apiTables.forEach((sections, index) => {
      const head = sections[0] as Exclude<Node, string>
      const body = sections[1] as Exclude<Node, string>
      const headerRow = head[2] as Exclude<Node, string>
      assert.deepEqual((headerRow.slice(2) as Node[]).map(text), expected[index]!.headers)
      const rows = (body.slice(2) as Node[]).map(row =>
        ((row as Exclude<Node, string>).slice(2) as Node[]).map(text),
      )
      assert.deepEqual(rows, expected[index]!.rows)
    })
  })

  test(slug + '：导出 SFC 完整可编译，代码与共用示例一致，无网页占位', async () => {
    const examples = await extractVueExamples(markdown)
    const paths = Object.values(componentDefinitions[slug].examples)
    assert.equal(examples.length, paths.length)
    const sources = await Promise.all(paths.map(path => readFile(join(projectRoot, 'examples', slug, path + '.vue'), 'utf8')))
    assert.deepEqual(examples, sources.map(source => source.includes('@docs-options:start')
      ? renderExampleCode(source) : source.replaceAll('\r\n', '\n').trim()))
    for (const [index, source] of examples.entries()) {
      assert.ok(!source.includes('~/') && !source.includes('ClientOnly') && !source.includes('@docs-options'))
      const filename = 'ExportedExample' + index + '.vue'
      const parsed = parse(source, { filename })
      assert.deepEqual(parsed.errors, [])
      const script = compileScript(parsed.descriptor, { id: filename })
      const template = compileTemplate({
        id: filename, filename, source: parsed.descriptor.template!.content,
        compilerOptions: { bindingMetadata: script.bindings },
      })
      assert.deepEqual(template.errors, [])
    }
    const plain = markdown.replace(/^\x60\x60\x60vue\n[\s\S]*?^\x60\x60\x60/gm, '')
    assert.doesNotMatch(plain, /^:{2,}|<\/?(?:article|section)|\{#|\bArray<\.\.\.>/m)
  })
}

test('API 类型内的反引号与代码边界保持分离，连续反引号和首尾空格可往返', async () => {
  const values = ['`${number}px`', "'md' | `${number}px`", '``value``', ' padded ', 'a`b']
  const markdown = await expandDocument('::docs-api-table{name="types"}\n::', {
    tables: { types: { headers: ['类型'], codeColumns: 1, rows: values.map(value => [value]) } }, examples: {},
  })
  const result: string[] = []
  const text = (node: Node): string => typeof node === 'string' ? node : (node.slice(2) as Node[]).map(text).join('')
  function visit(nodes: Node[]) {
    for (const node of nodes) {
      if (typeof node === 'string') continue
      if (node[0] === 'code') result.push(text(node))
      else visit(node.slice(2) as Node[])
    }
  }
  visit((await parseMarkdown(markdown)).nodes)
  assert.deepEqual(result, values)
})

test('展开组件引用时保留插槽说明，无法识别的引用直接报错', async () => {
  const source = ':::section{class="doc-section"}\n## 示例\n\n::demo\n不能遗失的插槽说明。\n::\n:::'
  const result = await expandDocument(source, { tables: {}, examples: { demo: '<template><p>示例</p></template>' } })
  assert.ok(result.includes('不能遗失的插槽说明。'))
  assert.ok(!result.includes(':::'))
  await assert.rejects(expandDocument('::unknown-example\n::', { tables: {}, examples: {} }), /尚未支持导出的节点/)
  await assert.rejects(expandDocument('::docs-api-table{name="missing"}\n::', { tables: {}, examples: {} }), /未找到 API 表/)
  await assert.rejects(expandDocument('# 空页面', { tables: formApi, examples: {} }), /正文遗漏 API 表/)
})

test('安装版本必须与目标版本一致，与逐组件验证状态分开', () => {
  assert.doesNotThrow(() => assertPackageVersion(docsVersion.packageVersion))
  assert.throws(() => assertPackageVersion('0.5.3'), /目标版本为/)
  assert.throws(() => assertPackageVersion('0.7.1'), /目标版本为/)
})

test('迁移验收必须完成所有五项，未知组件与缺失检查项不能被当作已验证', () => {
  assert.throws(() => getComponentMigration('unknown'), /缺少迁移记录/)
  const done: ComponentMigration = {
    phase: 2, previousVerifiedVersion: '0.5.3',
    checks: { content: true, preview: true, examples: true, ai: true, validation: true },
  }
  assert.equal(getMigrationStatus(done), 'verified')
  assert.equal(getMigrationStatus({ ...done, unreleased: true }), 'in-progress')
  for (const key of Object.keys(migrationCheckLabels) as MigrationCheck[]) {
    assert.equal(getMigrationStatus({ ...done, checks: { ...done.checks, [key]: false } }), 'in-progress')
    const missing = structuredClone(done)
    delete (missing.checks as Partial<ComponentMigration['checks']>)[key]
    assert.notEqual(getMigrationStatus(missing), 'verified')
  }
})

test('混合迁移时只有完整验收的组件进入已验证覆盖，待新增组件不能假装已有文档', async () => {
  const mixed = structuredClone(componentMigrations)
  delete mixed.button.unreleased
  mixed.button.checks = { content: true, preview: true, examples: true, ai: true, validation: true }
  mixed.input.checks = { content: true, preview: true, examples: true, ai: true, validation: false }
  const generated = await buildAiArtifacts(mixed)
  const manifest = JSON.parse(generated['public/ai/manifest.json']!)
  assert.ok(manifest.coverage.includes('button'))
  assert.ok(!manifest.coverage.includes('input'))
  assert.ok(manifest.pendingCoverage.includes('input'))
  assert.equal(manifest.components.button.verifiedVersion, docsVersion.packageVersion)
  assert.equal(manifest.components.input.verifiedVersion, null)
  assert.equal(manifest.status, 'migrating')
  assert.ok(generated['public/ai/components/button.md']!.includes('> 已验证：已完成 ' + docsVersion.packageVersion))
  assert.ok(generated['public/ai/components/input.md']!.includes('> 迁移中：尚未完成 ' + docsVersion.packageVersion))
  const verifiedSection = generated['public/llms.txt']!.split('## 已验证组件')[1]!.split('## 迁移中')[0]!
  assert.match(verifiedSection, /BingButton/)
  assert.doesNotMatch(verifiedSection, /BingInput/)
  // 新增页面接入后，剩余未登记项仍沿用同一约束。
  for (const slug of manifest.plannedCoverage as (keyof typeof mixed)[]) {
    const invalid = structuredClone(mixed)
    invalid[slug].checks = { ...mixed.button.checks }
    await assert.rejects(buildAiArtifacts(invalid), /尚未登记文档，不能标为已验证/)
  }
  // 单组件验收只重写本组件、清单和入口，未完成组件保持原状态。
  const current = { ...generated, 'public/ai/components/button.md': '旧生成文件' }
  assert.equal(Object.keys(selectArtifacts(generated, current, 'button')).length, 5)
})

test('提示框导出为保留标题与正文的普通 Markdown 引用', async () => {
  const result = await expandDocument('::docs-callout{type="tip" title="关于 ?raw"}\n示例中的 `code` 是字符串。\n::', { tables: {}, examples: {} })
  assert.match(result, /> \*\*关于 \?raw\*\*/)
  assert.match(result, /> 示例中的 `code` 是字符串。/)
  assert.doesNotMatch(result, /docs-callout|::/)
  const defaultTitle = await expandDocument('::docs-callout{type="warning"}\n保留说明。\n::', { tables: {}, examples: {} })
  assert.match(defaultTitle, /\*\*注意\*\*/)
  await assert.rejects(expandDocument('::docs-callout{type="unknown"}\n内容\n::', { tables: {}, examples: {} }), /未知提示类型/)
})

test('单组件导出保留完整索引，拒绝为另一组件的缺失或过期文件写入错误清单', () => {
  for (const slug of componentSlugs) {
    const selected = selectArtifacts(artifacts, artifacts, slug)
    assert.deepEqual(Object.keys(selected).sort(), ['README.md', 'public/ai/guides/upgrade.md', 'public/ai/components/' + slug + '.md', 'public/ai/manifest.json', 'public/llms.txt'].sort())
    assert.equal(selected['public/ai/manifest.json'], artifacts['public/ai/manifest.json'])
    const other = 'public/ai/components/' + (slug === 'form' ? 'form-item' : 'form') + '.md'
    assert.throws(() => selectArtifacts(artifacts, { ...artifacts, [other]: undefined }, slug), /同步全部组件/)
    assert.throws(() => selectArtifacts(artifacts, { ...artifacts, [other]: '过期内容' }, slug), /同步全部组件/)
  }
})

test('CLI 拒绝未知组件、重复参数和同时指定多个组件', () => {
  for (const script of ['scripts/export-ai-docs.ts', 'scripts/check-ai-examples.ts']) {
    for (const args of [['unknown-component'], ['form-item', 'form'], ['form-item', 'form-item'], ['--check', '--check']]) {
      const result = spawnSync(process.execPath, [script, ...args], { cwd: projectRoot, encoding: 'utf8' })
      assert.equal(result.status, 1)
      assert.match(result.stderr, /用法/)
    }
  }
})

test('网页参数中的引号、反斜线与脚本结束符不会破坏导出示例', async () => {
  for (const path of ['form/layout', 'form-item/message']) {
    const template = await readFile(join(projectRoot, 'examples/' + path + '.vue'), 'utf8')
    const render = path === 'form/layout' ? renderFormLayoutCode : renderExampleCode
    const source = render(template, { labelWidth: '</script>"\\test' })
    const parsed = parse(source)
    assert.deepEqual(parsed.errors, [])
    assert.doesNotThrow(() => compileScript(parsed.descriptor, { id: 'escaped' }))
    assert.equal(source.match(/<\/script>/g)?.length, 1)
  }
})
