import { expect, test } from '@playwright/test'
import { componentDocsTests, navigateToDocs } from './component-docs'
import { checkCursorAppearance, checkCursorBasic, checkCursorNative, checkCursorScopes, expectImageCursor } from './cursor-interactions'

const open = componentDocsTests({ slug: 'cursor', title: 'BingCursor', ready: '#basic .cursor-basic-zone .bing-button', previews: 5, tables: 5,
  sections: ['overview', 'basic', 'states', 'appearance', 'native', 'scope', 'native-lifecycle', 'props', 'slots', 'events', 'attributes', 'types'] })

test('Cursor：局部识别、输入和原生退出', async ({ page }) => {
  await open(page)
  await checkCursorBasic(page, page.locator('#basic'))
  await page.getByRole('button', { name: '展开长正文', exact: true }).click()
  const editor = page.getByRole('textbox', { name: '可编辑正文', exact: true })
  await expect(editor.locator('p')).toHaveCount(101)
  const first = await editor.locator('p').first().elementHandle()
  await editor.locator('.image-control').first().hover()
  await expectImageCursor(editor.locator('.image-control').first(), 'zoom-in')
  await editor.evaluate(node => { node.scrollTop = 500 })
  expect(await first!.evaluate(node => node.isConnected)).toBe(true)
  await first?.dispose()
  await page.getByRole('button', { name: '收起长正文', exact: true }).click()
  await expect(editor.locator('p')).toHaveCount(1)
})

test('Cursor：全局与嵌套作用域、Teleport 和页面停用清理', async ({ page }) => {
  await open(page)
  await checkCursorScopes(page, page.locator('#scope'))
  await page.locator('#scope').getByRole('button', { name: '开启全局光标', exact: true }).click()
  await page.locator('#scope .outside-zone').hover()
  await expectImageCursor(page.locator('#scope .outside-zone'), 'default')
  await navigateToDocs(page, 'button')
  await expect(page.locator('.doc-page h1')).toHaveText('BingButton')
  await expect(page.locator('[data-bing-cursor-layer], [data-bing-cursor-native]')).toHaveCount(0)
  await expect(page.locator('style[data-bing-cursor-style]')).toHaveCount(0)
  await navigateToDocs(page, 'cursor')
  await expect(page.locator('#scope').getByRole('button', { name: '开启全局光标', exact: true })).toBeVisible()
})

test('Cursor：窄屏外观配置、系统回退与减少动态效果', async ({ page }, info) => {
  await page.setViewportSize({ width: 390, height: 1000 })
  await page.addInitScript(() => localStorage.setItem('bing-ui-docs-theme', 'dark'))
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await open(page)
  await checkCursorAppearance(page, page.locator('#appearance'))
  await checkCursorNative(page, page.locator('#native'))
  await page.locator('#appearance .appearance-target').hover()
  await page.screenshot({ path: info.outputPath('cursor-appearance-dark-390.png'), animations: 'disabled', style: '#nuxt-devtools-container { display: none !important; }' })
})

test('Cursor：状态网格与系统回退的主题和窄屏布局', async ({ page }, info) => {
  await open(page)
  for (const [theme, width] of [['light', 1440], ['dark', 390]] as const) {
    await page.setViewportSize({ width, height: 1000 })
    await page.getByRole('button', { name: theme === 'dark' ? '切换为深色主题' : '切换为浅色主题', exact: true }).click()
    await expect(page.locator('html')).toHaveAttribute('data-bing-theme', theme)
    for (const section of ['states', 'native']) {
      const preview = page.locator('#' + section + ' .doc-example')
      const height = await preview.evaluate(node => node.getBoundingClientRect().height)
      await page.setViewportSize({ width, height: Math.max(1000, Math.ceil(height + 400)) })
      await preview.evaluate(node => node.scrollIntoView({ block: 'start', behavior: 'instant' }))
      const target = page.locator(section === 'states' ? '#states [data-bing-cursor="pointer"]' : '#native .themed')
      await target.hover()
      await expectImageCursor(target, section === 'states' ? 'pointer' : 'crosshair')
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
      await preview.screenshot({ path: info.outputPath('cursor-' + section + '-' + theme + '-' + width + '.png'), animations: 'disabled', style: '#nuxt-devtools-container { display: none !important; }' })
    }
  }
})
