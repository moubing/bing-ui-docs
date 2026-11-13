import { expect, test, type Page } from '@playwright/test'

const errors = new WeakMap<Page, string[]>()
test('公开 Token API 示例：主题、语言选择和原文保持一致', async ({ page }) => {
  await page.goto('/?component=code-block&example=tokens')
  const result = page.getByLabel('Token 高亮结果')
  await expect(result.locator('span').first()).toBeVisible()
  const text = await result.textContent()
  const color = await result.locator('span').first().evaluate(node => getComputedStyle(node).color)
  await page.getByRole('button', { name: '高亮配色', exact: true }).click()
  await page.getByRole('option', { name: '暗色', exact: true }).click()
  await expect.poll(() => result.locator('span').first().evaluate(node => getComputedStyle(node).color)).not.toBe(color)
  await page.getByRole('button', { name: '高亮语言', exact: true }).click()
  await page.getByRole('option', { name: '纯文本', exact: true }).click()
  await expect.poll(() => result.locator('span[style*="color"]').count()).toBe(0)
  expect(await result.textContent()).toBe(text)
})
test.beforeEach(({ page }) => {
  const messages: string[] = []
  errors.set(page, messages)
  page.on('pageerror', error => messages.push(error.message))
})
test.afterEach(({ page }) => expect(errors.get(page)).toEqual([]))

test('CodeBlock 导出基础：原文复制、语言参数和高亮闭区间', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.goto('/?component=code-block&example=basic')
  await expect(page.locator('.bing-code-block')).toHaveClass(/is-ready/)
  await expect(page.locator('.is-highlighted')).toHaveCount(5)
  await page.getByRole('button', { name: '复制代码', exact: true }).click()
  await expect(page.getByRole('status')).toContainText('已复制 vue')
  const copied = (await page.evaluate(() => navigator.clipboard.readText())).replaceAll('\r\n', '\n')
  expect(copied).toContain('<script setup lang="ts">\nimport { ref }')
  expect(copied).toContain('</script>')
  expect(copied).not.toContain('\\u003c')
})

test('CodeBlock 导出高亮与换行：选择闭区间、内部滚动、隐藏复制和行号', async ({ page }) => {
  await page.goto('/?component=code-block&example=highlight')
  await expect(page.locator('.is-highlighted')).toHaveCount(6)
  await page.getByRole('button', { name: '选择闭区间起始行', exact: true }).click()
  await page.getByRole('option', { name: /^第 18 行/ }).click()
  await expect(page.getByRole('status')).toHaveText('高亮：[6,[18,18]]')
  await expect(page.locator('.is-highlighted')).toHaveCount(2)
  const viewport = page.locator('.bing-code-block .bing-scrollbar__viewport')
  expect(await viewport.evaluate(node => node.scrollHeight > node.clientHeight)).toBe(true)
  await viewport.hover()
  await page.mouse.wheel(0, 400)
  await expect.poll(() => viewport.evaluate(node => node.scrollTop)).toBeGreaterThan(0)
  await page.goto('/?component=code-block&example=wrap')
  await expect(page.locator('.bing-code-block')).toHaveClass(/is-wrapped/)
  await expect(page.locator('.bing-code-block__line-number')).toHaveCount(0)
  await expect(page.getByRole('button')).toHaveCount(0)
})

test('CodeBlock 导出调整尺寸：拖拽右侧手柄和键盘操作', async ({ page }) => {
  await page.goto('/?component=code-block&example=resizable')
  const root = page.locator('.bing-resizable')
  const handle = page.locator('.bing-resizable__handle--right')
  await expect(handle).toBeVisible()
  const before = (await root.boundingBox())!.width
  const box = (await handle.boundingBox())!
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.down()
  await page.mouse.move(box.x + box.width / 2 + 60, box.y + box.height / 2, { steps: 6 })
  await page.mouse.up()
  await expect.poll(async () => (await root.boundingBox())!.width).toBeGreaterThan(before + 30)
  const grown = (await root.boundingBox())!.width
  await handle.focus()
  await handle.press('ArrowLeft')
  await expect.poll(async () => (await root.boundingBox())!.width).toBeLessThan(grown)
})

test('CodeBlock 导出复制失败：Clipboard API 拒绝时直接回报错误', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => { throw new Error('测试拒绝') } } })
    document.execCommand = () => { throw new Error('不应调用兼容分支') }
  })
  await page.goto('/?component=code-block&example=basic')
  await page.getByRole('button', { name: '复制代码', exact: true }).click()
  await expect(page.getByRole('status')).toContainText('复制失败：测试拒绝')
})

test('CodeBlock 阅读应用：无效行号、失败回退、切换语言恢复和原文复制', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.goto('/?understanding=code-block')
  await expect(page.locator('.bing-code-block')).toHaveClass(/is-error/)
  await expect(page.locator('.is-highlighted')).toHaveCount(2)
  await expect(page.getByRole('status')).toContainText('发生过高亮错误：true')
  await expect(page.locator('.bing-code-block__code')).toContainText("const value = '<tag>'")
  await expect(page.locator('.bing-code-block tag')).toHaveCount(0)
  await page.getByRole('button', { name: '启用已知语言', exact: true }).click()
  await expect(page.locator('.bing-code-block')).toHaveClass(/is-ready/)
  await page.getByRole('button', { name: '复制代码', exact: true }).click()
  await expect(page.getByRole('status')).toContainText('复制：ts:true')
  expect((await page.evaluate(() => navigator.clipboard.readText())).replaceAll('\r\n', '\n')).toBe("const value = '<tag>'\nconsole.log(value)\n")
})
