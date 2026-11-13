import { expect, test } from '@playwright/test'
import { componentDocsTests } from './component-docs'
import { verifyContinuousRatioDrag } from '../resizable-drag'

const open = componentDocsTests({ slug: 'resizable', title: 'BingResizable', ready: '#basic .bing-resizable__handle', previews: 5, tables: 6,
  sections: ['overview', 'basic', 'modes', 'constraints', 'expose', 'controlled', 'props', 'directions', 'slots', 'events', 'expose-api', 'types'] })

test('Resizable：键盘、默认值重置、全部手柄与禁用', async ({ page }) => {
  await open(page)
  const panel = page.getByRole('group', { name: '可调整尺寸面板', exact: true })
  const right = panel.getByRole('button', { name: '调整右边尺寸', exact: true })
  await right.focus()
  await right.press('ArrowRight')
  await expect(panel).toHaveCSS('width', '328px')
  await expect(page.locator('#basic .resizable-feedback')).toContainText('结束：right')
  await page.getByRole('textbox', { name: '初始宽度', exact: true }).fill('360')
  await expect(panel).toHaveCSS('width', '328px')
  await page.getByRole('button', { name: '应用初始尺寸', exact: true }).click()
  await expect(panel).toHaveCSS('width', '360px')
  await page.getByRole('checkbox', { name: '显示全部手柄', exact: true }).locator('..').click()
  await expect(panel.getByRole('button')).toHaveCount(8)
  await page.getByRole('checkbox', { name: '锁定宽高比', exact: true }).locator('..').click()
  await expect(panel.getByRole('button', { name: '调整右下角尺寸', exact: true })).toBeVisible()
  await page.getByRole('checkbox', { name: '禁用调整', exact: true }).locator('..').click()
  await expect(right).toBeDisabled()
})

test('Resizable 窄屏：画布独立横向滚动，右侧手柄仍可操作', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 1000 })
  await open(page)
  const canvas = page.locator('#basic .resizable-canvas-scroll')
  expect(await canvas.evaluate(node => node.scrollWidth > node.clientWidth)).toBe(true)
  const right = page.locator('#basic .bing-resizable__handle--right')
  await right.scrollIntoViewIfNeeded()
  await expect(right).toBeInViewport()
  await right.focus()
  await right.press('ArrowRight')
  await expect(page.locator('#basic .bing-resizable')).toHaveCSS('width', '328px')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})

test('Resizable：比例角手柄连续拖动和松手吸附', async ({ page }) => {
  await open(page)
  await verifyContinuousRatioDrag(page, page.getByRole('group', { name: '比例锁定并限制在父容器内', exact: true }))
})
