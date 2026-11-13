import { expect, test } from '@playwright/test'
import { componentDocsTests, navigateToDocs } from './component-docs'

test.beforeEach(async ({ page }) => { await page.emulateMedia({ reducedMotion: 'reduce' }) })
const open = componentDocsTests({ slug: 'tree-select', title: 'BingTreeSelect', ready: '#basic .bing-tree-select', previews: 5, tables: 6,
  sections: ['overview', 'basic', 'cascade', 'custom-node', 'virtual', 'keyboard', 'panel-position', 'props', 'node-shape', 'slots', 'events', 'types', 'smooth-options'] })

test('TreeSelect：搜索参数与代码同步、单选事件', async ({ page }) => {
  await open(page)
  await page.getByRole('radiogroup', { name: '搜索策略', exact: true }).getByRole('radio', { name: /^false/ }).locator('..').click()
  await expect(page.locator('#basic .bing-code-block')).toContainText('"searchable": false')
  await page.getByRole('combobox', { name: '选择组件节点', exact: true }).click()
  await expect(page.locator('.bing-tree-select__panel').getByRole('combobox')).toHaveCount(0)
  await page.getByRole('treeitem').filter({ has: page.getByText('BingInput', { exact: true }) }).click()
  await expect(page.locator('#basic .tree-select-feedback')).toContainText('"input"')
  await page.getByRole('checkbox', { name: '禁用选择器', exact: true }).locator('..').click()
  await expect(page.getByRole('combobox', { name: '选择组件节点', exact: true })).toBeDisabled()
})

test('TreeSelect：切换严格选择同步完整代码和初始模型', async ({ page }) => {
  await open(page)
  await page.getByRole('checkbox', { name: 'checkStrictly 独立选择', exact: true }).locator('..').click()
  await expect(page.locator('#cascade .bing-code-block')).toContainText('"checkStrictly": true')
  await expect(page.locator('#cascade .tree-select-feedback')).toContainText('["library","button","select"]')
  await page.getByRole('combobox', { name: '选择组件范围', exact: true }).click()
  await page.getByRole('treeitem').filter({ has: page.getByText('组件库', { exact: true }) }).click()
  await expect(page.locator('#cascade .tree-select-feedback')).toContainText('["button","select"]')
})

test('TreeSelect：默认虚拟行高与自定义高度同步代码', async ({ page }) => {
  await open(page)
  const height = page.getByRole('textbox', { name: '虚拟行高', exact: true })
  const trigger = page.getByRole('combobox', { name: '大量层级节点', exact: true })
  await expect(height).toHaveValue('')
  await trigger.click()
  await expect(page.getByRole('treeitem').first()).toHaveCSS('height', '32px')
  await page.locator('.bing-tree-select__panel').getByRole('combobox').press('Escape')
  await height.fill('44')
  await expect(page.locator('#virtual .bing-code-block__code')).toContainText('"virtualItemHeight": 44')
  await trigger.click()
  await expect(page.getByRole('treeitem').first()).toHaveCSS('height', '44px')
})

test('TreeSelect：窄屏面板、状态保留与浮层卸载', async ({ page }, info) => {
  await page.setViewportSize({ width: 390, height: 1000 }); await open(page)
  const trigger = page.getByRole('combobox', { name: '选择组件节点', exact: true })
  await trigger.click()
  const panel = page.locator('.bing-tree-select__panel')
  const box = await panel.boundingBox(); expect(box!.x).toBeGreaterThanOrEqual(12); expect(box!.x + box!.width).toBeLessThanOrEqual(378)
  await panel.screenshot({ path: info.outputPath('tree-select-light-390.png'), animations: 'disabled', style: '#nuxt-devtools-container { display: none !important; }' })
  const old = await trigger.elementHandle()
  await navigateToDocs(page, 'button')
  await expect(page.locator('.doc-page h1')).toHaveText('BingButton'); await expect(panel).toHaveCount(0)
  expect(await old!.evaluate(element => element.isConnected)).toBe(false)
  await navigateToDocs(page, 'tree-select')
  await expect(trigger).toContainText('BingTreeSelect')
})

test('TreeSelect：窄屏级联全集的反馈文本可换行', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 1000 }); await open(page)
  await page.getByRole('combobox', { name: '选择组件范围', exact: true }).click()
  await page.getByRole('treeitem').filter({ has: page.getByText('组件库', { exact: true }) }).click()
  await page.locator('.bing-tree-select__panel').getByRole('combobox').press('Escape')
  await expect(page.locator('#cascade .tree-select-feedback')).toContainText('["library","basic","button","tag","icon","form","input","select","tree-select"]')
  expect(await page.locator('#cascade .tree-select-feedback span').evaluateAll(nodes => nodes.every(node => node.scrollWidth <= node.clientWidth + 1))).toBe(true)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})
