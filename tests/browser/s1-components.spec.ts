import { expect, test } from '@playwright/test'
import { componentDocsTests, navigateToDocs } from './component-docs'
import { exerciseSharedColumns, exerciseSplitPane, exerciseSlider } from './s1-interactions'

test.describe('独立列设置文档', () => {
  const open = componentDocsTests({ slug: 'table-column-controls', title: 'BingTableColumnControls',
    ready: '#shared .bing-table', previews: 1, tables: 4,
    sections: ['overview', 'shared', 'props', 'events', 'expose', 'types'] })
  test('多个分组共享模型，全部折叠仍可配置，切页清理浮层', async ({ page }) => {
    await open(page)
    await exerciseSharedColumns(page)
    await navigateToDocs(page, 'button')
    await expect(page.locator('.bing-table__column-panel-shell')).toHaveCount(0)
  })
})
test.describe('分栏文档', () => {
  const open = componentDocsTests({ slug: 'split-pane', title: 'BingSplitPane', ready: '#basic .bing-split-pane',
    previews: 1, tables: 5, sections: ['overview', 'basic', 'props', 'slots', 'events', 'expose', 'types'] })
  test('键盘与容器变化保持偏好', async ({ page }) => { await open(page); await exerciseSplitPane(page) })
})
test.describe('滑块文档', () => {
  const open = componentDocsTests({ slug: 'slider', title: 'BingSlider', ready: '#basic .bing-slider',
    previews: 4, tables: 4, sections: ['overview', 'basic', 'range', 'vertical', 'controlled', 'props', 'events', 'expose', 'types'] })
  test('连续更新与最终提交分开', async ({ page }) => { await open(page); await exerciseSlider(page) })
})
