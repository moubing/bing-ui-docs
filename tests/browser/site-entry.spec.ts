import { expect, test, type Page } from '@playwright/test'
import { readFile } from 'node:fs/promises'
import { componentMigrations, docsVersion } from '../../shared/docs/migration.ts'
import { sortableKeys } from './sortable-actions'

const installCommand = `pnpm add @moubing/bing-ui@${docsVersion.packageVersion} gsap@^3.15.0`
const errors = new WeakMap<Page, string[]>()
test.beforeEach(async ({ page }) => {
  const messages: string[] = []
  errors.set(page, messages)
  page.on('pageerror', error => messages.push(error.message))
  page.on('console', message => {
    if (/hydration|failed to resolve component/i.test(message.text())) messages.push(message.text())
  })
  await page.emulateMedia({ reducedMotion: 'reduce' })
})
test.afterEach(({ page }) => expect(errors.get(page)).toEqual([]))

async function openHome(page: Page) {
  await page.goto('/')
  await expect(page.locator('.home-stage .bing-card.has-entered').first()).toBeVisible()
}

for (const width of [1440, 390]) {
  for (const theme of ['light', 'dark']) {
    test(`首页 ${width} ${theme}：新版入口、主题和布局`, async ({ page }, info) => {
      await page.setViewportSize({ width, height: 1000 })
      await page.addInitScript(value => localStorage.setItem('bing-ui-docs-theme', value), theme)
      await openHome(page)
      await expect(page.locator('html')).toHaveAttribute('data-bing-theme', theme)
      await expect(page.locator('.home-version')).toHaveText(`v${docsVersion.packageVersion}`)
      await expect(page.locator('.home-facts dt').first()).toHaveText(String(Object.keys(componentMigrations).length))
      await expect(page.locator('.component-rail a[href="/docs/components/cursor"]')).toHaveCount(1)
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
      await page.evaluate(() => document.fonts.ready)
      await page.screenshot({ path: info.outputPath(`home-hero-${theme}-${width}.png`), animations: 'disabled', style: '#nuxt-devtools-container { display: none !important; }' })
      if (width === 390) {
        await page.getByRole('tab', { name: 'Controls', exact: true }).click()
        await expect(page.getByRole('button', { name: '选择演示强调色', exact: true })).toBeVisible()
      }
      for (const section of ['.home-stage', '.build-workbench', '.home-cta']) {
        const target = page.locator(section)
        const height = await target.evaluate(node => node.getBoundingClientRect().height)
        await page.setViewportSize({ width, height: Math.max(1000, Math.ceil(height + 200)) })
        await target.scrollIntoViewIfNeeded()
        await target.screenshot({ path: info.outputPath(`${section.slice(1)}-${theme}-${width}.png`), animations: 'disabled', style: '#nuxt-devtools-container { display: none !important; }' })
        expect(await target.evaluate(node => node.scrollWidth <= node.clientWidth + 1), section).toBe(true)
      }
    })
  }
}

test('首页：安装与完整卡片代码复制、键盘翻面、配色和排序', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await openHome(page)
  await page.getByRole('button', { name: '复制安装命令', exact: true }).click()
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(installCommand)
  await page.getByRole('tab', { name: 'Controls', exact: true }).click()
  await page.getByRole('button', { name: '选择演示强调色', exact: true }).click()
  await page.getByRole('button', { name: '选择 蓝色', exact: true }).click()
  await page.keyboard.press('Escape')
  await expect(page.locator('.controls-heading code')).toHaveText('#38BDF8')
  await expect(page.locator('.home-visual-column')).toHaveCSS('--bing-accent-contrast', '#000000')
  await page.getByRole('tab', { name: 'Compose', exact: true }).click()
  const list = page.getByRole('list', { name: '界面图层排序演示' })
  await list.getByRole('button').first().press('End')
  await expect.poll(() => sortableKeys(list)).toEqual(['content', 'feedback', 'motion'])
  const card = page.getByRole('group', { name: /^交互卡片/ })
  await card.scrollIntoViewIfNeeded()
  await expect(card).toHaveClass(/has-entered/)
  await card.press('Enter')
  await expect(card).toHaveClass(/is-flipped/)
  await expect(card).toHaveAttribute('aria-label', /当前为反面/)
  const viewport = page.getByRole('region', { name: '首页内容', exact: true })
  const scrollBefore = await viewport.evaluate(node => node.scrollTop)
  await card.press('Space')
  await expect(card).not.toHaveClass(/is-flipped/)
  expect(await viewport.evaluate(node => node.scrollTop)).toBe(scrollBefore)
  await page.locator('.code-panel').getByRole('button', { name: '复制代码', exact: true }).click()
  const source = await readFile(new URL('../../examples/home/showcase.vue', import.meta.url), 'utf8')
  await expect.poll(async () => (await page.evaluate(() => navigator.clipboard.readText())).replaceAll('\r\n', '\n')).toBe(source.trim().replaceAll('\r\n', '\n'))
  await page.getByRole('button', { name: '触发反馈', exact: true }).click()
  await expect(page.getByText('交互已就绪', { exact: true })).toBeVisible()
})

test('快速开始：包管理器、Nuxt 接入、升级指南和完整组件目录', async ({ page, context }, info) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.setViewportSize({ width: 390, height: 1000 })
  await page.goto('/docs')
  await page.waitForFunction(() => {
    const root = document.querySelector('#__nuxt') as HTMLElement & { __vue_app__?: { $nuxt?: { isHydrating: boolean } } }
    return root?.__vue_app__?.$nuxt?.isHydrating === false
  })
  await expect(page.locator('.doc-page h1')).toHaveText('快速开始')
  await page.getByRole('tab', { name: 'npm', exact: true }).click()
  await expect(page.getByRole('tab', { name: 'npm', exact: true })).toHaveAttribute('aria-selected', 'true')
  await page.locator('.docs-code-group').getByRole('button', { name: '复制代码', exact: true }).click()
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(installCommand.replace('pnpm add', 'npm install'))
  await page.getByRole('tab', { name: 'yarn', exact: true }).click()
  await expect(page.locator('.docs-code-group')).toContainText(installCommand.replace('pnpm add', 'yarn add'))
  const nuxt = page.locator('.bing-code-block').filter({ has: page.getByText('nuxt.config.ts', { exact: true }) })
  await nuxt.getByRole('button', { name: '复制代码', exact: true }).click()
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain("css: ['@moubing/bing-ui/style.css']")
  await page.getByRole('button', { name: '切换为深色主题', exact: true }).click()
  await expect(page.locator('html')).toHaveAttribute('data-bing-theme', 'dark')
  await page.locator('#overview').scrollIntoViewIfNeeded()
  await page.screenshot({ path: info.outputPath('quick-start-dark-390.png'), animations: 'disabled', style: '#nuxt-devtools-container { display: none !important; }' })
  await page.locator('.doc-page a[href="/docs/upgrade"]').click()
  await expect(page.locator('.doc-page h1')).toHaveText('版本升级指南')
  expect(await page.locator('.doc-page section[id]').evaluateAll(nodes => nodes.map(node => node.id))).toEqual(expect.arrayContaining(['install', 'input-018', 'table-018', 'package', 'config', 'cursor', 'table-scrollbar', 'visual', 'button-input', 'form', 'overlays', 'verify']))
  await expect(page.locator('.doc-page')).not.toContainText('后续会在这里补充')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.screenshot({ path: info.outputPath('upgrade-dark-390.png'), animations: 'disabled', style: '#nuxt-devtools-container { display: none !important; }' })
  await page.getByRole('button', { name: '文档导航', exact: true }).click()
  await expect(page.locator('.docs-nav-list a[href^="/docs/components/"]')).toHaveCount(Object.keys(componentMigrations).length)
  await page.locator('.docs-nav-list a[href="/docs/components/cursor"]').click()
  await expect(page.locator('.doc-page h1')).toHaveText('BingCursor')
})

test('首页：system 主题、减少动态效果与路由离开恢复', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('bing-ui-docs-theme', 'system'))
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'no-preference' })
  await openHome(page)
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(250, 250, 250)')
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' })
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(16, 16, 18)')
  await expect(page.locator('.home-float--motion')).not.toHaveAttribute('style', /transform/)
  await page.getByRole('button', { name: /开始使用/ }).click()
  await expect(page.locator('.doc-page h1')).toHaveText('快速开始')
  await expect(page.locator('.home-page')).toHaveCount(0)
  await page.getByRole('link', { name: 'Bing UI 首页', exact: true }).click()
  await expect(page.locator('.home-stage .bing-card.has-entered').first()).toBeVisible()
  await expect(page.getByRole('button', { name: '复制安装命令', exact: true })).toBeVisible()
})
