import { expect, type Locator, type Page } from '@playwright/test'

/** 网页预览与 AI 导出共用同一份示例；网页传入章节作为 root，导出页直接传 page。 */
type Root = Page | Locator

export function dropZone(root: Root, name: string) {
  return root.locator(`.bing-drop-zone[aria-label="${name}"]`)
}

async function center(locator: Locator) {
  await locator.scrollIntoViewIfNeeded()
  const box = await locator.boundingBox()
  if (!box) throw new Error('缺少拖动位置')
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 }
}

/** 真实鼠标拖动：越过阈值后分步移到目标，可在松手前检查中间状态。 */
export async function startDrag(page: Page, source: Locator, target: Locator | { x: number; y: number }) {
  const from = await center(source)
  await page.mouse.move(from.x, from.y)
  await page.mouse.down()
  await page.mouse.move(from.x + 10, from.y + 10, { steps: 3 })
  await moveTo(page, target)
}

export async function moveTo(page: Page, target: Locator | { x: number; y: number }) {
  const to = 'x' in target ? target : await center(target)
  await page.mouse.move(to.x, to.y, { steps: 12 })
}

export async function drag(page: Page, source: Locator, target: Locator | { x: number; y: number }) {
  await startDrag(page, source, target)
  await page.mouse.up()
}

function card(zone: Locator, text: string) {
  return zone.locator('.card', { hasText: text })
}

export async function exerciseDragDropBasic(page: Page, root: Root) {
  const queued = dropZone(root, '待处理')
  const doing = dropZone(root, '进行中')
  const status = root.locator('.log[role=status]')
  // 起点贴近视口边缘会触发自动滚动，先把看板放到视口中部。
  await doing.evaluate(node => node.scrollIntoView({ block: 'center' }))

  await startDrag(page, card(queued, 'REQ-12'), doing)
  await expect(page.locator('.bing-drag-overlay')).toContainText('导出筛选结果为表格')
  await expect(queued).toHaveAttribute('data-bing-drop-state', 'source')
  await expect(doing).toHaveAttribute('data-bing-drop-state', 'over')
  await expect(doing).toContainText('松手移到这里')
  await page.mouse.up()
  await expect(card(doing, 'REQ-12')).toHaveCount(1)
  await expect(status).toHaveText('拖动：REQ-12 移到进行中')
  await expect(doing).toHaveAttribute('data-bing-drop-state', 'idle')

  // 松手在区域外：条目归位，不触发 drop。
  const box = (await queued.boundingBox())!
  await drag(page, card(queued, 'REQ-15'), { x: box.x + box.width / 2, y: box.y + box.height + 40 })
  await expect(card(queued, 'REQ-15')).toHaveCount(1)
  await expect(status).toHaveText('拖动：REQ-12 移到进行中')

  // 单击链接仍然打开，不会开始拖动。
  await queued.getByRole('link', { name: /REQ-15/ }).click()
  await expect(status).toHaveText('打开 REQ-15')

  // 键盘可用的菜单入口。
  await doing.getByRole('button', { name: 'REQ-9 操作', exact: true }).press('Enter')
  await page.getByRole('menuitem', { name: '移到测试中' }).press('Enter')
  await expect(card(dropZone(root, '测试中'), 'REQ-9')).toHaveCount(1)
  await expect(status).toHaveText('菜单：REQ-9 移到测试中')
}

export async function exerciseDragDropRules(page: Page, root: Root) {
  const doing = dropZone(root, '进行中')
  const testing = dropZone(root, '测试中')
  const done = dropZone(root, '已完成')
  const trash = dropZone(root, '删除')
  const events = root.getByRole('list', { name: '事件记录' })
  // 卡片中部是备注输入框，按住标题拖动。
  const grip = (zone: Locator, text: string) => card(zone, text).locator('strong')
  await doing.evaluate(node => node.scrollIntoView({ block: 'center' }))

  // 不被接受的区域显示 disabled，松手视为落在区域外；删除区只在拖动时出现。
  await expect(trash).toHaveCount(0)
  await startDrag(page, grip(doing, 'BUG-4'), done)
  await expect(done).toHaveAttribute('data-bing-drop-state', 'disabled')
  await expect(done).toContainText('只接受测试中的条目')
  await expect(trash).toBeVisible()
  await page.mouse.up()
  await expect(events.locator('li').last()).toHaveText('drag-end 落点 区域外')
  await expect(card(doing, 'BUG-4')).toHaveCount(1)
  await expect(trash).toHaveCount(0)

  await drag(page, grip(testing, 'REQ-3'), done)
  await expect(events).toContainText('drop REQ-3：testing → done')
  await expect(done).toContainText('REQ-3 已完成')

  // 锁定条目和输入框内按下都不会开始拖动。
  const before = await events.textContent()
  await drag(page, grip(testing, 'REQ-7'), doing)
  await drag(page, doing.getByRole('textbox', { name: 'BUG-4 备注' }), testing)
  await expect(events).toHaveText(before!)

  // Escape 取消。
  await startDrag(page, grip(doing, 'BUG-4'), testing)
  await page.keyboard.press('Escape')
  await page.mouse.up()
  await expect(events.locator('li').last()).toHaveText('drag-end 已取消')
  await expect(card(doing, 'BUG-4')).toHaveCount(1)

  // 放回原区域：默认不触发 drop，勾选后触发。
  await drag(page, grip(doing, 'BUG-4'), doing.locator('h3'))
  await expect(events.locator('li').last()).toHaveText('drag-end 落点 doing')
  await expect(events).not.toContainText('drop BUG-4')
  await root.getByText('放回原区域也触发 drop', { exact: true }).click()
  await drag(page, grip(doing, 'BUG-4'), doing.locator('h3'))
  await expect(events).toContainText('drop BUG-4：doing → doing')

  // 拖到拖动时才出现的删除区。
  await startDrag(page, grip(doing, 'BUG-4'), testing)
  await moveTo(page, trash)
  await expect(trash).toContainText('松手删除')
  await page.mouse.up()
  await expect(root.locator('.card', { hasText: 'BUG-4' })).toHaveCount(0)
}
