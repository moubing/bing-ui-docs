import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
})

test('Slider 范围约束、刻度、竖向键盘与双击恢复', async ({ page }) => {
  await page.goto('/?component=slider&example=range')
  const lower = page.getByRole('slider', { name: '预算下限', exact: true })
  await lower.press('End')
  await expect(lower).toHaveValue('60')
  await expect(page.getByRole('status')).toContainText('[60,70]')
  await page.getByRole('button', { name: '舒适', exact: true }).click()
  await expect(page.getByRole('slider', { name: '离散档位', exact: true })).toHaveValue('25')
  await page.goto('/?component=slider&example=vertical')
  const volume = page.getByRole('slider', { name: '竖向音量', exact: true })
  await volume.press('ArrowUp')
  await expect(volume).toHaveValue('41')
  await page.locator('.bing-slider__thumb').first().dblclick()
  await expect(volume).toHaveValue('40')
  await expect(volume).toHaveAttribute('aria-orientation', 'vertical')
})

test('Slider 受控拒绝保留拖动预览，松手回弹且不提交', async ({ page }) => {
  await page.goto('/?component=slider&example=controlled')
  await page.getByRole('checkbox', { name: '接受更新', exact: true }).locator('..').click()
  const slider = page.getByRole('slider', { name: '受控正文宽度', exact: true })
  const thumb = page.locator('.bing-slider__thumb')
  const rect = (await thumb.boundingBox())!
  await page.mouse.move(rect.x + rect.width / 2, rect.y + rect.height / 2)
  await page.mouse.down()
  await page.mouse.move(rect.x + 130, rect.y + rect.height / 2, { steps: 12 })
  await expect(slider).not.toHaveValue('880')
  await expect(page.getByRole('status')).toContainText('已接受 880px；提交 0 次')
  await page.mouse.up()
  await expect(slider).toHaveValue('880')
  await expect(page.getByRole('status')).toContainText('提交 0 次')
})

test('Input 密码显隐保留选区，计数与加载可用', async ({ page }) => {
  await page.goto('/?component=input&example=editing')
  const password = page.getByLabel('密码显隐示例', { exact: true })
  await password.focus()
  await password.evaluate((input: HTMLInputElement) => input.setSelectionRange(2, 6))
  await page.getByRole('button', { name: '显示密码', exact: true }).click()
  await expect(password).toHaveAttribute('type', 'text')
  expect(await password.evaluate((input: HTMLInputElement) => [input.selectionStart, input.selectionEnd])).toEqual([2, 6])
  await page.getByLabel('计数示例', { exact: true }).fill('已审核')
  await expect(page.locator('.bing-input__count')).toContainText('3')
  await page.getByRole('checkbox', { name: '模拟加载状态', exact: true }).locator('..').click()
  await expect(page.getByLabel('加载搜索示例', { exact: true })).toHaveAttribute('aria-busy', 'true')
})

test('Slider 触屏轨道松手提交，纵向手势保留页面滚动', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, viewport: { width: 390, height: 260 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' })
  try {
    const page = await context.newPage()
    await page.goto('/?component=slider&example=controlled')
    const slider = page.getByRole('slider', { name: '受控正文宽度', exact: true })
    await expect(slider).toHaveValue('880')
    const box = (await page.locator('.bing-slider').boundingBox())!
    const cdp = await context.newCDPSession(page)
    const point = { x: box.x + box.width * .75, y: box.y + box.height / 2 }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [point] })
    await expect(slider).toHaveValue('880')
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
    await expect(slider).not.toHaveValue('880')
    const accepted = await slider.inputValue()
    await expect(page.getByRole('status')).toContainText('提交 1 次')
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [point] })
    for (const delta of [20, 40, 60]) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: point.x, y: point.y - delta }] })
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
    await expect(slider).toHaveValue(accepted)
    await expect(page.getByRole('status')).toContainText('提交 1 次')
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(0)
  } finally { await context.close() }
})

test('Input 前缀拖动、Esc 撤销和单次 change', async ({ page }) => {
  await page.goto('/?component=input&example=controlled')
  const input = page.getByRole('spinbutton', { name: '前缀拖动调值', exact: true })
  const prefix = page.locator('.bing-input__prefix')
  const box = (await prefix.boundingBox())!
  async function drag() {
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
    await page.mouse.down()
    await page.mouse.move(box.x + box.width / 2 + 16, box.y + box.height / 2, { steps: 8 })
  }
  await drag()
  await expect(input).not.toHaveValue('40')
  await page.keyboard.press('Escape')
  await page.mouse.up()
  await expect(input).toHaveValue('40')
  await expect(page.getByRole('status')).toContainText('change：0')
  await drag()
  await page.mouse.up()
  await expect(input).toHaveValue('60')
  await expect(page.getByRole('status')).toContainText('change：1')
})

test('Input 数字 Enter 规整、空值 null 和受控拒绝', async ({ page }) => {
  await page.goto('/?component=input&example=controlled')
  const input = page.getByRole('spinbutton', { name: '前缀拖动调值', exact: true })
  await input.fill('43')
  await input.press('Enter')
  await expect(input).toHaveValue('45')
  await expect(page.getByRole('status')).toContainText('Enter：45')
  await page.getByRole('button', { name: '清空输入', exact: true }).click()
  await expect(page.getByRole('status')).toContainText('已接受：null')
  await input.fill('40')
  await input.press('Enter')
  await page.getByRole('checkbox', { name: '接受数字更新', exact: true }).locator('..').click()
  await input.fill('65')
  await input.press('Enter')
  await expect(input).toHaveValue('40')
})

test('Textarea 快捷提交隔离 IME，清除可撤销，换行触发高度通知', async ({ page }) => {
  await page.goto('/?component=textarea&example=submit')
  const note = page.getByRole('textbox', { name: '快捷提交标注', exact: true })
  await note.fill('标注')
  await note.dispatchEvent('compositionstart')
  await note.press('Enter')
  await expect(page.getByRole('status')).not.toContainText('提交：标注')
  await note.dispatchEvent('compositionend', { data: '标注' })
  await note.press('Enter')
  await expect(page.getByRole('status')).toContainText('提交：标注')
  const saved = await note.inputValue()
  await page.getByRole('button', { name: '清空文本', exact: true }).click()
  await expect(note).toHaveValue('')
  await note.press('Control+z')
  await expect(note).toHaveValue(saved)
  const height = (await note.boundingBox())!.height
  await note.press('End')
  await note.press('Shift+Enter')
  await note.press('Shift+Enter')
  await expect.poll(async () => (await note.boundingBox())!.height).toBeGreaterThan(height)
  const long = page.getByRole('textbox', { name: '长说明快捷提交', exact: true })
  await long.fill('完整说明')
  await long.press('Control+Enter')
  await expect(page.getByRole('status')).toContainText('提交：完整说明')
})

test('Table F2 编辑、Tab 控件循环、Esc 返回单元格', async ({ page }) => {
  await page.goto('/?component=table&example=keyboard')
  await page.getByRole('button', { name: '定位第一条备注', exact: true }).click()
  const cell = page.locator('tbody tr').first().locator('td[data-column-key="note"]')
  await expect(cell).toBeFocused()
  await cell.press('F2')
  const input = page.getByRole('textbox', { name: '设计稿备注', exact: true })
  await expect(input).toBeFocused()
  await input.fill('复核完成')
  await input.press('Tab')
  await expect(cell.getByRole('button', { name: '清空', exact: true })).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(cell).toBeFocused()
  await cell.press('ArrowDown')
  await expect(page.locator('tbody tr').nth(1).locator('td[data-column-key="note"]')).toBeFocused()
})

test('Table 级联选择跳过禁用行，活动行独立于批量选择', async ({ page }) => {
  await page.goto('/?component=table&example=cascade')
  await page.getByRole('checkbox', { name: '选择行 project', exact: true }).locator('..').click()
  await expect(page.getByRole('status').filter({ hasText: '叶子键' })).toContainText('design, code')
  await expect(page.getByRole('checkbox', { name: '选择行 locked', exact: true })).not.toBeChecked()
  await page.goto('/?component=table&example=active')
  const last = page.locator('tbody tr').last()
  await last.locator('td[data-column-key="name"]').press('Enter')
  await expect(last).toHaveAttribute('aria-current', 'true')
  await expect(page.getByRole('status').filter({ hasText: '当前版本' })).toContainText('批量选择：v1, v2')
})

test('Table 远程全选、排除键、缓存行和筛选重置', async ({ page }) => {
  await page.goto('/?component=table&example=remote-selection')
  await page.getByRole('button', { name: '选择全部 30 条', exact: true }).click()
  const status = page.getByRole('status').filter({ hasText: 'allPages' })
  await expect(status).toContainText('allPages：true')
  await page.getByRole('button', { name: '下一页', exact: true }).click()
  await expect(page.getByRole('checkbox', { name: '选择行 4', exact: true })).toBeChecked()
  await page.getByRole('checkbox', { name: '选择行 4', exact: true }).locator('..').click()
  await expect(status).toContainText('excludedKeys：4')
  await page.getByRole('button', { name: '模拟切换筛选并清空选择', exact: true }).click()
  await expect(status).toContainText('allPages：false；excludedKeys：无；已缓存 0 行')
})

test('Table 错误重试、首次骨架与保留旧数据', async ({ page }) => {
  await page.goto('/?component=table&example=error')
  await expect(page.locator('.bing-table__error')).toContainText('示例请求失败')
  await page.getByRole('button', { name: '重试', exact: true }).click()
  await expect(page.locator('tbody').first()).toContainText('重试后加载成功')
  await expect(page.locator('.bing-table__error')).toHaveCount(0)
  await page.goto('/?component=table&example=skeleton')
  await expect(page.locator('.bing-table')).toHaveAttribute('aria-busy', 'true')
  await expect(page.locator('.bing-table__skeleton').first()).toBeVisible()
  await page.getByRole('button', { name: '完成加载', exact: true }).click()
  await expect(page.locator('.bing-table')).toHaveAttribute('aria-busy', 'false')
  await page.getByRole('button', { name: '再次刷新', exact: true }).click()
  await expect(page.locator('tbody')).toContainText('已接收的数据')
})

test('Table 变高虚拟末行可聚焦且 DOM 保持有限', async ({ page }) => {
  await page.goto('/?component=table&example=variable')
  await page.getByRole('button', { name: '定位最后一行', exact: true }).click()
  const last = page.locator('tbody tr').filter({ hasText: '记录 300' }).locator('td[data-column-key="description"]')
  await expect(last).toBeFocused()
  await expect(last).toBeInViewport()
  expect(await page.locator('.bing-table__row').count()).toBeLessThan(40)
})

for (const theme of ['light', 'dark'] as const) {
  test(`0.18 新示例在 390px / ${theme} 不溢出并保留操作宽度`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 390, height: 700 })
    for (const [component, example] of [['slider', 'range'], ['slider', 'vertical'], ['input', 'editing'], ['textarea', 'submit'], ['table', 'focus'], ['table', 'theme'], ['button', 'flex-row']]) {
      await page.goto(`/?component=${component}&example=${example}`)
      await page.locator('html').evaluate((el, value) => el.setAttribute('data-bing-theme', value), theme)
      await expect(page.locator('.bing-button, .bing-slider, .bing-input, .bing-textarea, .bing-table').first()).toBeVisible()
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1)
      if (component === 'button') {
        await expect(page.getByRole('button', { name: '搜索', exact: true })).toHaveCSS('flex-shrink', '0')
      }
      await page.screenshot({ path: testInfo.outputPath(`${component}-${example}-${theme}.png`), fullPage: true })
    }
  })
}
