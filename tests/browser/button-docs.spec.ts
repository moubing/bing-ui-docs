import { expect, test } from '@playwright/test'
import { componentDocsTests } from './component-docs'

const open = componentDocsTests({ slug: 'button', title: 'BingButton', ready: '#playground .doc-example__preview button', previews: 8, tables: 3,
  sections: ['overview', 'playground', 'variants', 'busy-feedback', 'sizes', 'text-effect', 'states', 'text-swap', 'flex-row', 'props', 'slots-events', 'slots', 'events'] })

test('Button：动态文案、加载禁用、文字效果与节流反馈', async ({ page }) => {
  await open(page)
  const preview = page.locator('#playground .doc-example__preview button')
  await page.locator('#button-label').fill('测试 "文案"')
  await expect(preview).toHaveText('测试 "文案"')
  await page.getByRole('checkbox', { name: '加载中', exact: true }).locator('..').click()
  await expect(preview).toBeDisabled()
  await expect(preview).toHaveAttribute('aria-busy', 'true')
  await expect(page.locator('#playground .bing-code-block__code')).toContainText('"loading": true')
  await page.getByRole('checkbox', { name: '加载中', exact: true }).locator('..').click()
  await page.getByRole('checkbox', { name: '禁用', exact: true }).locator('..').click()
  await expect(preview).toBeDisabled()
  await page.getByRole('radiogroup', { name: '按钮文字效果', exact: true }).getByRole('radio', { name: /^shine/ }).locator('..').click()
  await expect(page.locator('#text-effect .doc-example__preview button')).toHaveClass(/bing-button--text-shine/)
  await expect(page.locator('#text-effect .bing-code-block__code')).toContainText('"customShine": false')
  await page.getByRole('checkbox', { name: '自定义扫光配色', exact: true }).locator('..').click()
  await expect(page.locator('#text-effect .bing-code-block__code')).toContainText('"customShine": true')
  const throttle = page.getByRole('button', { name: '连续点击试试', exact: true })
  await throttle.dblclick({ delay: 50 })
  await expect(page.locator('#states .button-feedback')).toContainText('有效点击：1')
  await expect(page.locator('#states .button-feedback')).toContainText('被节流：1')
  await expect(page.getByText('第 1 次有效点击已通过节流校验。', { exact: true })).toBeVisible()
})
