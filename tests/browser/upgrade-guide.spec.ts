import { expect, test } from '@playwright/test'
import { docsVersion } from '../../shared/docs/migration.ts'
import { releaseReview, upgradeGuideTitle } from '../../shared/docs/release.ts'
import { buildAiArtifacts, extractVueExamples } from '../../scripts/lib/ai-docs.ts'
import { assertLiveRelease } from '../../scripts/lib/release-verification.ts'

for (const [theme, width] of [['light', 1440], ['dark', 390]] as const) {
  test(`升级指南 ${theme} ${width}：当前版本、旧锚点、目录与窄屏阅读`, async ({ page, request }, info) => {
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('console', message => {
      if (/hydration|failed to resolve component/i.test(message.text())) errors.push(message.text())
    })
    await page.setViewportSize({ width, height: 1000 })
    await page.addInitScript(value => localStorage.setItem('bing-ui-docs-theme', value), theme)
    // 静态 Nginx 会为目录补斜线；标题、查询参数和锚点也必须兼容。
    await page.goto('/docs/upgrade/?source=deep-link#install')
    await expect(page).toHaveTitle(upgradeGuideTitle + ' · Bing UI')
    await expect(page.locator('.doc-page h1')).toHaveText(upgradeGuideTitle)
    await expect(page.locator('#install')).toContainText(`pnpm add @moubing/bing-ui@${docsVersion.packageVersion}`)
    await expect(page.locator('#verify')).toContainText(`@moubing/bing-ui@${docsVersion.packageVersion}`)
    await expect(page.locator('.doc-page')).toContainText(releaseReview.checkedAt)
    await expect(page.locator('.doc-page a').filter({ hasText: /^CHANGELOG$/ })).toHaveAttribute('href', releaseReview.changelogUrl)
    await expect(page.locator('.doc-page')).not.toContainText('{{release.')
    await page.evaluate(() => document.fonts.ready)
    await page.screenshot({ path: info.outputPath(`upgrade-overview-${width}.png`), animations: 'disabled' })

    const ids = await page.locator('.doc-page [id]').evaluateAll(nodes => nodes.map(node => node.id))
    expect(new Set(ids).size).toBe(ids.length)
    if (width > 1000) {
      await expect(page.locator('.docs-toc a[href="#input-018"]')).toBeVisible()
      await page.locator('.docs-toc a[href="#input-018"]').click()
    } else {
      await page.locator('#release-index a[href="/docs/upgrade#input-018"]').click()
    }
    await expect(page.locator('#input-018 h2')).toBeInViewport()
    await expect(page.locator('#input-018')).toContainText('number | null')
    await page.screenshot({ path: info.outputPath(`upgrade-input-${width}.png`), animations: 'disabled' })
    expect(await page.locator('.doc-page').evaluate(node => node.scrollWidth <= node.clientWidth + 1)).toBe(true)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)

    await page.goto('/docs/upgrade#button-input')
    await expect(page.locator('#button-input h2')).toBeInViewport()
    await expect(page.locator('#button-input')).toContainText('此约定已被 0.18.0 覆盖，不适用于当前版本')
    await page.locator('#button-input a[href="/docs/upgrade#input-018"]').click()
    await expect(page.locator('#input-018 h2')).toBeInViewport()
    await page.locator('#input-018 a[href="/docs/components/input#number"]').click()
    await expect(page.locator('#number h2')).toBeInViewport()
    await expect(page.locator('.doc-page h1')).toHaveText('BingInput')
    const guide = await request.get('/ai/guides/upgrade.md')
    expect(guide.ok()).toBe(true)
    expect(await guide.text()).toContain(`@moubing/bing-ui@${docsVersion.packageVersion}`)
    expect(errors).toEqual([])
  })
}

test('升级指南：当前迁移代码的复制内容与 AI 导出一致', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  const artifacts = await buildAiArtifacts()
  const examples = await extractVueExamples(artifacts['public/ai/guides/upgrade.md']!)
  await page.goto('/docs/upgrade')
  await page.waitForFunction(() => {
    const root = document.querySelector('#__nuxt') as HTMLElement & { __vue_app__?: { $nuxt?: { isHydrating: boolean } } }
    return root?.__vue_app__?.$nuxt?.isHydrating === false
  })
  for (const [index, section] of ['input-018', 'textarea-018', 'table-018', 'dialog-016'].entries()) {
    await page.locator(`#${section} .bing-code-block`).last().getByRole('button', { name: '复制代码', exact: true }).click()
    await expect.poll(async () => (await page.evaluate(() => navigator.clipboard.readText())).replaceAll('\r\n', '\n')).toBe(examples[index])
  }
})

test('发布读取：页面正文、安装命令与 AI 产物能通过同一部署核对', async ({ request }) => {
  const expected = await buildAiArtifacts()
  const paths = ['/ai/manifest.json', '/llms.txt', '/ai/guides/upgrade.md', '/', '/docs', '/docs/upgrade']
  const responses = Object.fromEntries(await Promise.all(paths.map(async path => {
    const response = await request.get(path)
    expect(response.ok()).toBe(true)
    return [path, await response.text()]
  })))
  expect(() => assertLiveRelease(responses, expected)).not.toThrow()
})
