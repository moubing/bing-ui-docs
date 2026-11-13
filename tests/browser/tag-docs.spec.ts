import { expect, test } from '@playwright/test'
import { componentDocsTests } from './component-docs'

const open = componentDocsTests({ slug: 'tag', title: 'BingTag', ready: '#playground .doc-example__preview .bing-tag', previews: 5, tables: 3,
  sections: ['overview', 'playground', 'tones-variants', 'sizes', 'closable', 'custom-slot', 'props', 'slots-events', 'slots', 'events'] })

test('Tag：关闭计数、动态文案、禁用和列表移除恢复', async ({ page }) => {
  await open(page)
  await page.getByRole('button', { name: '移除 Aurora', exact: true }).click()
  await expect(page.locator('#playground .tag-feedback')).toHaveText('关闭事件：1')
  await expect(page.locator('#playground .doc-example__preview .bing-tag')).toHaveCount(1)
  await page.locator('#tag-label').fill('筛选 "测试"')
  await expect(page.getByRole('button', { name: '移除 筛选 "测试"', exact: true })).toBeVisible()
  await page.getByRole('checkbox', { name: '禁用', exact: true }).locator('..').click()
  await expect(page.getByRole('button', { name: '移除 筛选 "测试"', exact: true })).toBeDisabled()
  await expect(page.locator('#playground .bing-code-block__code')).toContainText('"disabled": true')
  await page.getByRole('button', { name: '移除 文档', exact: true }).click()
  await expect(page.locator('#closable .bing-tag')).toHaveCount(3)
  await page.getByRole('button', { name: '恢复标签', exact: true }).click()
  await expect(page.locator('#closable .bing-tag')).toHaveCount(4)
})
