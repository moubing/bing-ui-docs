import assert from 'node:assert/strict'
import { writeFile } from 'node:fs/promises'
import { chromium, expect as baseExpect } from '@playwright/test'

const expect = baseExpect.configure({ timeout: 15_000 })

// 显式提供目标，避免普通本地测试访问生产。全程启用浏览器默认 TLS 校验。
const option = (name: string) => process.argv[process.argv.indexOf(name) + 1]
if (!process.argv.includes('--docs') || !process.argv.includes('--storybook')) {
  throw new Error('用法：node scripts/check-https-entry.ts --docs <HTTPS origin> --storybook <HTTPS origin> [--report <文件>]')
}
const docs = new URL(option('--docs')!).origin
const storybook = new URL(option('--storybook')!).origin
assert.equal(new URL(docs).protocol, 'https:')
assert.equal(new URL(storybook).protocol, 'https:')
const browser = await chromium.launch({ headless: true })
const problems: string[] = []
const checks: string[] = []
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
  await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: docs })
  context.on('page', page => {
    page.on('pageerror', error => problems.push(error.message))
    page.on('requestfailed', request => {
      const reason = request.failure()?.errorText
      if (reason !== 'net::ERR_ABORTED') problems.push(`${reason} ${request.url()}`)
    })
    page.on('response', response => {
      if (response.status() >= 400) problems.push(`${response.status()} ${response.url()}`)
    })
    page.on('request', request => {
      if (request.url().startsWith('http:') && !request.isNavigationRequest()) problems.push(`混合内容：${request.url()}`)
    })
    page.on('console', message => {
      if (/mixed content|hydration mismatch/i.test(message.text())) problems.push(message.text())
    })
  })
  const page = await context.newPage()
  const guide = '/docs/upgrade?source=https-check#input-018'
  await page.goto(docs.replace('https:', 'http:') + guide)
  await expect(page.locator('#input-018 h2')).toBeInViewport()
  // 预渲染页面在 hydration 时会短暂恢复规范路径；等待组件完成挂载。
  await expect(async () => {
    await page.getByRole('button', { name: '切换为深色主题', exact: true }).click()
    await expect(page.locator('html')).toHaveAttribute('data-bing-theme', 'dark', { timeout: 1000 })
  }).toPass({ timeout: 15_000 })
  await expect(page).toHaveURL(/\/docs\/upgrade\/?\?source=https-check#input-018$/)
  await page.reload()
  await expect(page.locator('#input-018 h2')).toBeInViewport()
  await expect.poll(() => new URL(page.url()).searchParams.get('source')).toBe('https-check')
  assert.equal(new URL(page.url()).hash, '#input-018')
  assert.equal(await page.evaluate(() => isSecureContext), true)
  checks.push('可信 TLS、HTTP 迁移、文档查询参数与锚点、深链刷新')

  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto(docs)
    await expect(page.locator('.home-stage .bing-card.has-entered').first()).toBeVisible()
    await expect(page.getByRole('link', { name: '演示 ↗', exact: true })).toHaveAttribute('href', storybook)
    await page.getByRole('button', { name: '复制安装命令', exact: true }).click()
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain('@moubing/bing-ui@')
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
  }
  await page.goto(`${docs}/docs/components/button`)
  await expect(page.locator('.doc-page h1')).toHaveText('BingButton')
  await page.reload()
  await expect(page.locator('.doc-page h1')).toHaveText('BingButton')
  checks.push('桌面与移动导航、安装复制、组件页刷新')

  const entry = '/?path=/story/design-组件总览--overview&globals=bingTheme:dark'
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto(storybook.replace('https:', 'http:') + entry)
  const frame = page.frameLocator('#storybook-preview-iframe')
  await expect(frame.getByRole('heading', { name: 'Bing UI 组件总览' })).toBeVisible()
  await expect(frame.locator('html')).toHaveAttribute('data-bing-theme', 'dark')
  await page.reload()
  await expect(frame.locator('html')).toHaveAttribute('data-bing-theme', 'dark')
  await frame.getByRole('button', { name: '新建组件', exact: true }).click()
  await expect(frame.locator('.action-feedback')).toHaveText('新建组件操作已触发')
  await expect(page.getByRole('link', { name: 'Bing UI · 使用文档 ↗', exact: true })).toHaveAttribute('href', docs + '/docs')
  await expect(frame.getByRole('link', { name: '使用文档 ↗', exact: true })).toHaveAttribute('href', docs + '/docs')
  await page.setViewportSize({ width: 390, height: 844 })
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
  checks.push('Storybook story 与主题参数、iframe、组件交互、双向导航与移动布局')

  for (const [origin, paths] of [[docs, ['/', '/ai/manifest.json', '/llms.txt', '/ai/guides/upgrade.md']], [storybook, ['/', '/index.json', '/iframe.html']]] as const) {
    for (const route of paths) {
      const response = await context.request.get(origin + route)
      assert.equal(response.status(), 200, origin + route)
      assert.match(response.headers()['cache-control'] ?? '', /no-cache/)
      assert.equal(response.headers()['set-cookie'], undefined)
    }
    const missing = await context.request.get(origin + '/assets/req58-missing.js')
    assert.equal(missing.status(), 404)
  }
  checks.push('HTML / AI 清单及时更新、静态响应无 Set-Cookie、缺失资源返回 404')
  assert.deepEqual(problems, [])
  checks.push('页面与 iframe 无脚本错误、混合内容和关键资源 404')
  const report = { checkedAt: new Date().toISOString(), docs, storybook, checks }
  if (process.argv.includes('--report')) await writeFile(option('--report')!, JSON.stringify(report, null, 2) + '\n')
  console.log(JSON.stringify(report, null, 2))
} catch (error) {
  if (problems.length) console.error(JSON.stringify({ problems }, null, 2))
  throw error
} finally {
  await browser.close()
}
