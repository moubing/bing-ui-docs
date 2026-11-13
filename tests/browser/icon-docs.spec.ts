import { expect, test } from '@playwright/test'
import { componentDocsTests } from './component-docs'

const open = componentDocsTests({ slug: 'icon', title: 'BingIcon', ready: '.icon-preview-frame .bing-icon', previews: 4, tables: 1,
  sections: ['overview', 'playground', 'sizes', 'tones', 'accessibility', 'props'] })

test('Icon：独立控制组、尺寸描边和名称变化', async ({ page }) => {
  await open(page)
  const icon = page.locator('.icon-preview-frame .bing-icon')
  await expect(icon).toHaveAttribute('aria-hidden', 'true')
  await page.getByRole('radio', { name: 'xl', exact: true }).locator('..').click()
  await expect(icon).toHaveCSS('width', '32px')
  await page.getByRole('radio', { name: '2.5', exact: true }).locator('..').click()
  await expect(icon).toHaveCSS('stroke-width', '2.5px')
  await expect(page.getByRole('radio', { name: 'xl', exact: true })).toBeChecked()
  await page.getByRole('checkbox', { name: '装饰性图标', exact: true }).locator('..').click()
  await expect(icon).toHaveAttribute('role', 'img')
  await expect(icon).toHaveAttribute('aria-label', '精选功能')
  await page.getByRole('textbox', { name: '可访问名称', exact: true }).fill('')
  await expect(icon).toHaveAttribute('aria-hidden', 'true')
  await expect(icon).not.toHaveAttribute('role')
})
