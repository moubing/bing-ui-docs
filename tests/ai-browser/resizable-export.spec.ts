import { expect, test, type Page, type Locator } from '@playwright/test'
import { verifyContinuousRatioDrag } from '../resizable-drag'

const errors = new WeakMap<Page, string[]>()
test.beforeEach(({ page }) => { const messages: string[] = []; errors.set(page, messages); page.on('pageerror', error => messages.push(error.message)) })
test.afterEach(({ page }) => expect(errors.get(page)).toEqual([]))
async function dragRight(page: Page, group: Locator, distance: number) {
  const handle = group.getByRole('button', { name: '调整右边尺寸', exact: true })
  await handle.scrollIntoViewIfNeeded()
  const box = (await handle.boundingBox())!
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.down()
  await page.mouse.move(box.x + box.width / 2 + distance, box.y + box.height / 2, { steps: 5 })
}

test('Resizable 导出基础：键盘步长、拖拽、Escape 提交与重置', async ({ page }) => {
  await page.goto('/?component=resizable&example=basic')
  const group = page.getByRole('group', { name: '可调整尺寸面板', exact: true })
  const right = group.getByRole('button', { name: '调整右边尺寸', exact: true })
  await right.focus()
  await right.press('Shift+ArrowRight')
  await expect(group).toHaveCSS('width', '352px')
  await expect(page.getByRole('status')).toContainText('结束：right；352 x 200；位置 34,28；keydown')
  await dragRight(page, group, 40)
  await expect(group).toHaveCSS('width', '392px')
  await page.keyboard.press('Escape')
  await page.mouse.up()
  await expect(group).toHaveCSS('width', '392px')
  await expect(group).not.toHaveClass(/is-resizing/)
  expect(await page.evaluate(() => document.documentElement.style.userSelect)).toBe('')
  await page.getByRole('button', { name: '恢复初始尺寸', exact: true }).click()
  await expect(group).toHaveCSS('width', '320px')
})

test('Resizable 导出模式：固定对边与中心镜像', async ({ page }) => {
  await page.goto('/?component=resizable&example=modes')
  const fixed = page.getByRole('group', { name: 'fixed 模式示例', exact: true })
  const mirror = page.getByRole('group', { name: 'mirror 模式示例', exact: true })
  await fixed.getByRole('button', { name: '调整右边尺寸', exact: true }).press('ArrowRight')
  await mirror.getByRole('button', { name: '调整右边尺寸', exact: true }).press('ArrowRight')
  await expect(fixed).toHaveCSS('width', '251px')
  await expect(fixed).toHaveCSS('left', '40px')
  await expect(mirror).toHaveCSS('width', '252px')
  await expect(mirror).toHaveCSS('left', '39px')
})

test('Resizable 导出约束：松手吸附和宽高比', async ({ page }) => {
  await page.goto('/?component=resizable&example=constraints')
  const group = page.getByRole('group', { name: '比例锁定面板', exact: true })
  await expect(group.getByRole('button')).toHaveCount(3)
  await dragRight(page, group, 53)
  await expect(group).toHaveCSS('width', '373px')
  await page.mouse.up()
  await expect(group).toHaveCSS('width', '372px')
  const box = (await group.boundingBox())!
  expect(box.width / box.height).toBeCloseTo(16 / 9, 2)
})

test('Resizable 导出约束：角手柄跨轴与反向微调连续', async ({ page }) => {
  await page.goto('/?component=resizable&example=constraints')
  await verifyContinuousRatioDrag(page, page.getByRole('group', { name: '比例锁定面板', exact: true }))
})

test('Resizable 导出方法和受控用法：读数、位置同步与重置', async ({ page }) => {
  await page.goto('/?component=resizable&example=methods')
  const group = page.getByRole('group', { name: '可读取尺寸的面板', exact: true })
  await group.getByRole('button', { name: '调整右边尺寸', exact: true }).press('ArrowRight')
  await page.getByRole('button', { name: '读取尺寸', exact: true }).click()
  await expect(page.getByRole('status')).toHaveText('301 x 170 / x 26, y 24')
  await page.getByRole('button', { name: '重置', exact: true }).click()
  await expect(page.getByRole('status')).toHaveText('300 x 170 / x 26, y 24')
  await page.goto('/?component=resizable&example=controlled')
  const controlled = page.getByRole('group', { name: '受控面板', exact: true })
  await controlled.getByRole('button', { name: '调整左边尺寸', exact: true }).press('ArrowLeft')
  await expect(page.getByRole('status')).toHaveText('{"size":{"width":290,"height":160},"position":{"x":30,"y":32}}')
  await page.getByRole('button', { name: '重置受控面板', exact: true }).click()
  await expect(page.getByRole('status')).toHaveText('{"size":{"width":280,"height":160},"position":{"x":40,"y":32}}')
})

test('Resizable 阅读应用：未同步的回退、真实事件顺序、约束冲突和默认值重置', async ({ page }) => {
  await page.goto('/?understanding=resizable')
  const controlled = page.getByRole('group', { name: '没有同步的受控面板', exact: true })
  await dragRight(page, controlled, 40)
  await expect(controlled).toHaveCSS('width', '320px')
  await page.mouse.up()
  await expect(controlled).toHaveCSS('width', '280px')
  const events = JSON.parse((await page.getByRole('status').textContent())!) as string[]
  expect(events[0]).toBe('start:pointerdown')
  expect(events.slice(1, 4)).toEqual(['size', 'position', 'resize:pointermove'])
  expect(events.slice(-3)).toEqual(['size', 'position', 'end:pointerup'])
  const ratio = page.getByRole('group', { name: '约束冲突面板', exact: true })
  await expect(ratio.getByRole('button', { name: '调整右下角尺寸', exact: true })).toBeVisible()
  await ratio.getByRole('button', { name: '调整右边尺寸', exact: true }).press('Shift+ArrowRight')
  await expect(ratio).toHaveCSS('width', '280px')
  await expect(ratio).toHaveCSS('height', '150px')
  const defaults = page.getByRole('group', { name: '默认值更新面板', exact: true })
  await defaults.getByRole('button', { name: '调整右边尺寸', exact: true }).press('ArrowRight')
  await page.getByRole('button', { name: '改变默认值', exact: true }).click()
  await expect(defaults).toHaveCSS('width', '281px')
  await page.getByRole('button', { name: '应用默认值', exact: true }).click()
  await expect(defaults).toHaveCSS('width', '360px')
})
