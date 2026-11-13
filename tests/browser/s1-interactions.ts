import { expect, type Page } from '@playwright/test'

export async function exerciseRemoteTable(page: Page) {
  const table = page.locator('.bing-table').filter({ has: page.getByRole('region', { name: '远程文档列表', exact: true }) })
  const titles = table.locator('tbody .bing-table__row td:first-child')
  await expect(titles).toHaveText(['REQ-2', 'REQ-1'])
  await table.getByRole('button', { name: '文档编号', exact: true }).click()
  await expect(titles).toHaveText(['REQ-1', 'REQ-10'])
  await table.getByRole('button', { name: '下一页', exact: true }).click()
  await expect(titles).toHaveText(['REQ-2', 'REQ-20'])
  await expect(page.getByRole('status').filter({ hasText: '模拟请求' })).toContainText('模拟请求：2')
  await table.getByRole('button', { name: '下一页', exact: true }).click()
  await expect(titles).toHaveText(['REQ-3'])
  await expect(table.locator('.bing-table__row--filler')).toHaveCount(0)
  await table.getByRole('button', { name: '文档编号', exact: true }).click()
  await expect(titles).toHaveText(['REQ-3', 'REQ-20'])
  await table.getByRole('button', { name: '文档编号', exact: true }).click()
  await expect(titles).toHaveText(['REQ-2', 'REQ-1'])
  await expect(table.locator('.bing-table__header-cell.is-sorting')).toHaveCount(0)
}

export async function exerciseSharedColumns(page: Page) {
  await expect(page.locator('.bing-table')).toHaveCount(1)
  await page.getByRole('button', { name: '所有分组的列设置', exact: true }).click()
  await page.getByRole('checkbox', { name: '显示列：负责人', exact: true }).locator('..').click()
  await expect(page.locator('.bing-table__head')).not.toContainText('负责人')
  const priority = page.locator('.bing-table__column-option').filter({ hasText: '优先级' })
  await priority.getByRole('button', { name: '固定到左侧', exact: true }).click()
  await page.keyboard.press('Escape')
  await page.getByRole('button', { name: '展开待处理', exact: true }).click()
  for (const table of await page.locator('.bing-table').all()) {
    await expect(table.locator('.bing-table__header-cell').first()).toContainText('优先级')
    await expect(table.locator('.bing-table__head')).not.toContainText('负责人')
  }
  await page.getByRole('button', { name: '收起待处理', exact: true }).click()
  await page.getByRole('button', { name: '收起进行中', exact: true }).click()
  await expect(page.locator('.bing-table')).toHaveCount(0)
  await page.getByRole('button', { name: '所有分组的列设置', exact: true }).click()
  await page.getByRole('button', { name: '重置', exact: true }).click()
  await expect(page.getByRole('checkbox', { name: '显示列：负责人', exact: true })).toBeChecked()
}

export async function exerciseSplitPane(page: Page) {
  const separator = page.getByRole('separator', { name: '调整侧栏宽度', exact: true })
  await expect(separator).toBeVisible()
  await separator.focus()
  await page.keyboard.press('Home')
  expect(Number(await separator.getAttribute('aria-valuenow'))).toBe(Number(await separator.getAttribute('aria-valuemin')))
  await page.keyboard.press('End')
  expect(Number(await separator.getAttribute('aria-valuenow'))).toBe(Number(await separator.getAttribute('aria-valuemax')))
  await page.keyboard.press('Enter')
  const status = page.getByRole('status').filter({ hasText: '偏好宽度' })
  await expect(status).toContainText('偏好宽度：240px')
  await page.getByRole('button', { name: '切换容器宽度', exact: true }).click()
  await expect.poll(async () => Number(await separator.getAttribute('aria-valuenow'))).toBeLessThan(240)
  await expect(status).toContainText('偏好宽度：240px')
  await page.getByRole('button', { name: '切换容器宽度', exact: true }).click()
  await expect.poll(async () => Number(await separator.getAttribute('aria-valuenow'))).toBe(240)
}

export async function exerciseSlider(page: Page) {
  const slider = page.getByRole('slider').first()
  const status = page.getByRole('status').filter({ hasText: '提交次数' })
  await slider.focus()
  await page.keyboard.down('ArrowRight')
  await page.keyboard.down('ArrowRight')
  await expect(slider).toHaveValue('920')
  await expect(status).toContainText('提交次数：0')
  await page.keyboard.up('ArrowRight')
  await expect(status).toContainText('已提交：920px；提交次数：1')
  await slider.press('End')
  await expect(slider).toHaveValue('1800')
  await expect(slider).toHaveAttribute('aria-valuetext', '正文宽度 1800 像素')
  await page.getByRole('checkbox', { name: '禁用滑块', exact: true }).locator('..').click()
  await expect(slider).toBeDisabled()
}

export async function exerciseDialogFrame(page: Page) {
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.getByRole('button', { name: '打开项目设置', exact: true }).click()
  const dialog = page.getByRole('dialog', { name: '项目设置', exact: true })
  await expect.poll(async () => Math.round((await dialog.boundingBox())!.width)).toBe(900)
  await expect.poll(async () => Math.round((await dialog.boundingBox())!.height)).toBe(600)
  const tabs = dialog.getByRole('tablist', { name: '设置分类', exact: true })
  const before = await tabs.boundingBox()
  await dialog.locator('.bing-dialog__body-scroll .bing-scrollbar__viewport').evaluate(el => { el.scrollTop = 300 })
  await expect.poll(() => dialog.locator('.bing-dialog__body-scroll .bing-scrollbar__viewport').evaluate(el => el.scrollTop)).toBeGreaterThan(100)
  expect(Math.abs((await tabs.boundingBox())!.y - before!.y)).toBeLessThan(1)
  await page.setViewportSize({ width: 390, height: 620 })
  await expect.poll(async () => Math.round((await dialog.boundingBox())!.height)).toBe(600)
  const mobile = (await dialog.boundingBox())!
  expect(mobile.y).toBeGreaterThanOrEqual(0)
  expect(mobile.y + mobile.height).toBeLessThanOrEqual(620)
  await dialog.locator('.bing-dialog__close').click()
  await expect(dialog).toHaveCount(0)
}
