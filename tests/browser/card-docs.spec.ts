import { expect, test } from '@playwright/test'
import { componentDocsTests } from './component-docs'

const open = componentDocsTests({ slug: 'card', title: 'BingCard', ready: '#playground .bing-card.has-entered .bing-card__surface', previews: 6, tables: 3,
  sections: ['overview', 'playground', 'variants', 'entrance', 'flip', 'slots', 'props', 'slots-events', 'slot-list', 'events'],
  prepare: async page => {
    const card = page.locator('#playground .bing-card')
    await card.scrollIntoViewIfNeeded()
    await expect(card).toHaveClass(/has-entered/)
    await expect(card.locator('.bing-card__surface')).toHaveCSS('opacity', '1')
  },
})

test('Card：标题配置、翻面事件与入场重建', async ({ page }) => {
  await open(page)
  await page.getByRole('textbox', { name: '标题', exact: true }).fill('新的卡片标题')
  await expect(page.locator('#playground .bing-card__title')).toHaveText('新的卡片标题')
  await page.getByRole('radio', { name: /^accent / }).locator('..').click()
  await expect(page.locator('#playground .bing-card')).toHaveClass(/bing-card--accent/)
  const flip = page.locator('#flip .bing-card')
  await flip.scrollIntoViewIfNeeded()
  await expect(flip).toHaveClass(/has-entered/)
  // 点击要等待入场运动稳定，否则组件在入场期间不会翻面。
  await flip.locator('.bing-card__body').click()
  await expect(page.locator('#flip .card-feedback')).toContainText('当前面：back')
  await expect(flip).toHaveClass(/is-flipped/)
  const count = page.locator('#entrance .card-feedback')
  await count.scrollIntoViewIfNeeded()
  await expect(count).toContainText(/进入次数：[1-9]/)
  const before = Number((await count.innerText()).match(/\d+/)![0])
  await page.getByRole('textbox', { name: '时长', exact: true }).fill('0.4')
  await expect.poll(async () => Number((await count.innerText()).match(/\d+/)![0])).toBeGreaterThan(before)
})
