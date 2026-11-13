import { expect, test } from '@playwright/test'
import { componentDocsTests } from './component-docs'
import { verifyZoomedWheel } from './scrollbar-smooth-check'

const open = componentDocsTests({ slug: 'scrollbar', title: 'BingScrollbar', ready: '#basic .bing-scrollbar.has-overflow', previews: 5, tables: 5,
  sections: ['overview', 'basic', 'horizontal', 'smooth-scroll', 'expose', 'custom-viewport', 'props', 'smooth-options', 'events', 'expose-api', 'slots'] })

test('Scrollbar：页面缩放后的首格鼠标滚轮仍有惯性', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await open(page)
  await verifyZoomedWheel(page.getByRole('region', { name: '平滑滚动示例', exact: true }))
})

test('Scrollbar：窄屏自定义 textarea 保留编辑与只读语义', async ({ page }, info) => {
  await page.setViewportSize({ width: 390, height: 900 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await open(page)
  const editor = page.getByRole('textbox', { name: '自定义日志编辑器', exact: true })
  await page.getByRole('button', { name: '滚动到 180', exact: true }).click()
  await expect.poll(() => editor.evaluate(node => node.scrollTop)).toBe(180)
  await page.getByRole('checkbox', { name: '只读编辑器', exact: true }).locator('..').click()
  await expect(editor).toHaveAttribute('readonly')
  await page.locator('#custom-viewport .doc-example').screenshot({ path: info.outputPath('scrollbar-viewport-390.png'), animations: 'disabled', style: '#nuxt-devtools-container { display: none !important; }' })
})

test('Scrollbar：滚动反馈、禁用、实例定位和追加内容', async ({ page }) => {
  await open(page)
  const viewport = page.getByRole('region', { name: '组件列表', exact: true })
  await viewport.hover()
  await page.mouse.wheel(0, 120)
  await expect.poll(() => viewport.evaluate(node => node.scrollTop)).toBeGreaterThan(0)
  await expect(page.locator('#basic .scrollbar-feedback')).toContainText('scrollTop:')
  await page.getByRole('checkbox', { name: '禁用滚动', exact: true }).locator('..').click()
  await expect(viewport).toHaveCSS('overflow-y', 'hidden')
  await expect(viewport).not.toHaveAttribute('tabindex')
  const logs = page.getByRole('region', { name: '日志列表', exact: true })
  await page.locator('#expose').getByRole('button', { name: '下移 120', exact: true }).click()
  await expect.poll(() => logs.evaluate(node => node.scrollTop)).toBe(120)
  await page.locator('#expose').getByRole('button', { name: '顶部', exact: true }).click()
  await expect.poll(() => logs.evaluate(node => node.scrollTop)).toBe(0)
  await page.getByRole('button', { name: '追加并更新', exact: true }).click()
  await expect(logs.locator('.scrollbar-log-row')).toHaveCount(46)
  await expect(page.getByRole('region', { name: '平滑滚动示例', exact: true })).toBeAttached()
  await expect(page.getByRole('region', { name: '原生滚动示例', exact: true })).toBeAttached()
})
