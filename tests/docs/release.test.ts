import assert from 'node:assert/strict'
import { test } from 'node:test'
import { readFile } from 'node:fs/promises'
import { buildAiArtifacts, componentSlugs, extractVueExamples } from '../../scripts/lib/ai-docs.ts'
import { assertEntryVersions, assertGuideCurrent, assertGuideLinks, renderReadme, siteReviewManifest } from '../../scripts/lib/release-docs.ts'
import { assertLibraryRelease, assertLiveRelease } from '../../scripts/lib/release-verification.ts'
import { docsVersion } from '../../shared/docs/migration.ts'
import { assertReleaseReview, releaseReview, renderUpgradeGuide } from '../../shared/docs/release.ts'

const read = (path: string) => readFile(new URL('../../' + path, import.meta.url), 'utf8')
const source = await read('content/guides/upgrade.md')

test('只升级清单而漏核对全站导读时阻止导出，不自动更新人工验收', () => {
  assert.throws(() => assertReleaseReview({ ...releaseReview, packageVersion: '0.18.4' }), /全站发布核对/)
  assert.throws(() => assertReleaseReview({ ...releaseReview, docsRevision: 'r1' }), /全站发布核对/)
  assert.throws(() => assertReleaseReview({ ...releaseReview, migration: 'none', summary: '新增一个属性' }), /无需迁移/)
  assert.doesNotThrow(() => assertReleaseReview({ ...releaseReview, migration: 'none', summary: '仅新增可选能力，无需迁移' }))
  const states = structuredClone(releaseReview.pages)
  siteReviewManifest()
  assert.deepEqual(releaseReview.pages, states)
  for (const [key, page] of Object.entries(siteReviewManifest().pages)) {
    assert.equal(page.status, states[key as keyof typeof states].verified ? 'verified' : 'pending')
    assert.equal(page.verifiedRevision, page.status === 'verified' ? docsVersion.docsRevision : null)
  }
  const pending = structuredClone(releaseReview)
  pending.pages.upgrade.verified = false
  assert.equal(siteReviewManifest(pending).pages.upgrade!.status, 'pending')
  assert.equal(siteReviewManifest(pending).pages.upgrade!.verifiedVersion, null)
  assert.equal(pending.pages.upgrade.verified, false)
})

test('当前推荐旧版本会失败，历史版本与旧 Input 边界仍保留', () => {
  assertGuideCurrent(source)
  assert.throws(() => assertGuideCurrent(source.replace('pnpm add @moubing/bing-ui@{{release.packageVersion}}', 'pnpm add @moubing/bing-ui@0.13.3')), /推荐安装版本/)
  assert.throws(() => assertGuideCurrent(source.replace('# {{release.title}}', '# 0.12.0 升级指南')), /共享元数据|标题/)
  const guide = renderUpgradeGuide(source)
  assert.match(guide, /0\.6\.0–0\.17\.x/)
  assert.match(guide, /此约定已被 0\.18\.0 覆盖，不适用于当前版本/)
  assert.match(guide, /当前适用 `@moubing\/bing-ui@0\.19\.0`/)
  assert.doesNotMatch(guide, /\{\{release\./)
  assert.throws(() => renderUpgradeGuide('{{release.unknown}}'), /未知升级指南元数据/)
})

test('升级指南保留旧链接，并拒绝重复锚点或失效的组件章节', async () => {
  const guide = renderUpgradeGuide(source)
  await assertGuideLinks(guide, read)
  await assert.rejects(assertGuideLinks(guide.replace('id="button-input"', 'id="forgotten"'), read), /遗漏历史锚点/)
  await assert.rejects(assertGuideLinks(guide.replace('id="input-018"', 'id="overview"'), read), /重复锚点/)
  await assert.rejects(assertGuideLinks(guide.replace('/docs/components/input#number', '/docs/components/input#missing'), read), /链接锚点不存在/)
})

test('首页或快速开始重新写死版本、导航保留旧标题时也会失败', async () => {
  const path = 'app/pages/docs/index.vue'
  const entry = await read(path)
  assertEntryVersions({ [path]: entry })
  assert.throws(() => assertEntryVersions({ [path]: entry.replaceAll('@${docsVersion.packageVersion}', '@0.13.3') }), /当前安装命令/)
  assert.throws(() => assertEntryVersions({ [path]: entry.replace('{{ upgradeGuideTitle }}', '0.12.0 升级指南') }), /历史版本标题/)
})

test('README 版本和数量从注册表生成，AI 指南保留四份当前迁移示例', async () => {
  const readme = await read('README.md')
  const result = renderReadme(readme.replace('@moubing/bing-ui@0.19.0', '@moubing/bing-ui@0.12.1'), componentSlugs.length, 194)
  assert.match(result, /@moubing\/bing-ui@0\.19\.0/)
  assert.doesNotMatch(result, /@moubing\/bing-ui@0\.12\.1/)
  assert.match(renderReadme(readme, 41, 195), /41 个组件页面、195 个组件独立示例/)
  assert.throws(() => renderReadme(readme.replace('<!-- docs:version:end -->', ''), 40, 194), /README 缺少唯一/)
  const artifacts = await buildAiArtifacts()
  const examples = await extractVueExamples(artifacts['public/ai/guides/upgrade.md']!)
  assert.equal(examples.length, 4)
  assert.ok(examples.every(example => example.includes("from '@moubing/bing-ui'")))
  const manifest = JSON.parse(artifacts['public/ai/manifest.json']!)
  assert.equal(manifest.siteReview.docsRevision, docsVersion.docsRevision)
  assert.ok(manifest.guides.upgrade.contentSha256)
})

test('跨仓库检查拒绝旧 README、错误统计与遗漏 CHANGELOG', () => {
  const readme = `当前仓库版本为 **${docsVersion.packageVersion}**。40 个组件文档页。pnpm add @moubing/bing-ui@${docsVersion.packageVersion}`
  const changelog = '\n## ' + docsVersion.packageVersion + '\n'
  assertLibraryRelease(docsVersion.packageVersion, readme, changelog, 40)
  assert.throws(() => assertLibraryRelease(docsVersion.packageVersion, readme.replace('**0.19.0**', '**0.12.1**'), changelog, 40), /README 与文档目标不一致/)
  assert.throws(() => assertLibraryRelease(docsVersion.packageVersion, readme.replace('40 个', '38 个'), changelog, 40), /统计/)
  assert.throws(() => assertLibraryRelease(docsVersion.packageVersion, readme, '\n## 0.18.4\n', 40), /CHANGELOG/)
})

test('部署核对拒绝清单新但网页旧的组合，也拒绝仅在脚本里出现新安装版本', async () => {
  const artifacts = await buildAiArtifacts()
  const install = `<pre>pnpm add @moubing/bing-ui@${docsVersion.packageVersion}</pre>`
  const remote = {
    '/ai/manifest.json': artifacts['public/ai/manifest.json']!,
    '/llms.txt': artifacts['public/llms.txt']!,
    '/ai/guides/upgrade.md': artifacts['public/ai/guides/upgrade.md']!,
    '/': install,
    '/docs': install,
    '/docs/upgrade': `<h1>版本升级指南</h1>${install}<p>${releaseReview.checkedAt} 当前适用 @moubing/bing-ui@${docsVersion.packageVersion}，修订 ${docsVersion.docsRevision}</p>`
      + ['input-018', 'textarea-018', 'table-018', 'slider-018', 'dialog-016', 'pickers-017', 'patches-019', 'button-input'].map(id => `<section id="${id}"></section>`).join(''),
  }
  assertLiveRelease(remote, artifacts)
  assert.throws(() => assertLiveRelease({ ...remote, '/docs/upgrade': '<h1>0.12.0 升级指南</h1>' + install }, artifacts), /标题/)
  assert.throws(() => assertLiveRelease({ ...remote, '/docs': '<script>' + install + '</script>' }, artifacts), /推荐安装版本/)
  assert.throws(() => assertLiveRelease({ ...remote, '/ai/manifest.json': '{}' }, artifacts), /线上文件/)
})
