import { expect, test } from '@playwright/test'
import { componentDocsTests, navigateToDocs } from './component-docs'

const open = componentDocsTests({ slug: 'drop-down', title: 'BingDropDown', ready: '#basic .bing-dropdown', previews: 6, tables: 6,
  sections: ['overview', 'basic', 'context-menu', 'items', 'controlled', 'caret', 'selection', 'props', 'item-props', 'slots-events', 'slots', 'events', 'expose', 'api-types'] })

test('DropDown：虚拟锚点、边界翻转和内部滚动', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await open(page)
  const stage = page.locator('#caret .caret-stage')
  await stage.scrollIntoViewIfNeeded()
  const bounds = (await stage.boundingBox())!
  await stage.click({ position: { x: 32, y: bounds.height - 32 } })
  const menu = page.getByRole('menu', { name: '虚拟锚点菜单' })
  await expect(menu).toBeVisible()
  await expect(menu).toHaveClass(/is-placement-top/)
  await expect(menu).toHaveCSS('position', 'fixed')
  await expect.poll(async () => (await menu.boundingBox())!.y).toBeGreaterThanOrEqual(bounds.y)
  await expect.poll(async () => { const rect = (await menu.boundingBox())!; return rect.y + rect.height }).toBeLessThanOrEqual(bounds.y + bounds.height - 32 + 1)
  await menu.getByRole('menuitem', { name: /块命令 16/ }).click()
  await expect(page.locator('#caret [role="status"]')).toHaveText('块命令 16')
})

test('DropDown：主菜单键盘、右键上下文和实例方法', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await open(page)
  const trigger = page.getByRole('button', { name: '打开菜单', exact: true })
  await trigger.focus()
  await page.keyboard.press('ArrowDown')
  await expect(page.getByRole('menuitem', { name: /^新建页面/ })).toBeFocused()
  await expect.poll(async () => {
    const anchor = (await page.getByRole('button', { name: '关闭菜单', exact: true }).boundingBox())!
    const menu = (await page.getByRole('menu', { name: '文档操作', exact: true }).boundingBox())!
    return Math.abs(menu.x + menu.width - anchor.x - anchor.width)
  }).toBeLessThan(1)
  await page.keyboard.press('Escape')
  await expect(page.getByRole('menu')).toHaveCount(0)
  await expect(trigger).toBeFocused()
  await page.getByRole('button', { name: /^品牌资源/ }).click({ button: 'right' })
  await expect(page.getByRole('menuitem', { name: /^删除/ })).toBeDisabled()
  await page.getByRole('button', { name: /^首页封面图/ }).click({ button: 'right' })
  await page.getByRole('menuitem', { name: /^删除/ }).click()
  await expect(page.locator('#context-menu .dropdown-feedback')).toContainText('删除：首页封面图（仅本地演示）')
  await expect(page.locator('#context-menu .dropdown-context-summary')).toContainText('未选择资源')
  await page.locator('#controlled').getByRole('button', { name: '打开', exact: true }).click()
  await expect(page.getByRole('menuitem', { name: /^发布当前版本/ })).toBeFocused()
  await page.locator('#controlled').getByRole('button', { name: '聚焦第一项', exact: true }).click()
  await expect(page.getByRole('menuitem', { name: /^发布当前版本/ })).toBeFocused()
  await page.locator('#controlled').getByRole('button', { name: '切换', exact: true }).click()
  await expect(page.getByRole('menu')).toHaveCount(0)
})

test('DropDown：悬停配置与缓存页面停用清理', async ({ page }) => {
  await open(page)
  await page.getByRole('radiogroup', { name: '下拉菜单触发方式', exact: true }).getByRole('radio', { name: /^hover/ }).locator('..').click()
  await page.getByRole('button', { name: '打开菜单', exact: true }).hover()
  await expect(page.getByRole('menu', { name: '文档操作', exact: true })).toBeVisible()
  await page.keyboard.press('Escape')
  await page.getByRole('button', { name: '资源操作', exact: true }).click()
  await page.getByRole('menuitem', { name: '分享', exact: true }).hover()
  await expect(page.getByRole('menuitem', { name: /^复制链接/ })).toBeVisible()
  await navigateToDocs(page, 'button')
  await expect(page.locator('.doc-page h1')).toHaveText('BingButton')
  await expect(page.locator('.bing-dropdown__panel, .bing-dropdown-item__submenu')).toHaveCount(0)
  await navigateToDocs(page, 'drop-down')
  await expect(page.locator('.doc-page h1')).toHaveText('BingDropDown')
  await expect(page.getByRole('radio', { name: /^hover/ })).toBeChecked()
  await page.getByRole('button', { name: '打开菜单', exact: true }).hover()
  await expect(page.getByRole('menu', { name: '文档操作', exact: true })).toBeVisible()
})
