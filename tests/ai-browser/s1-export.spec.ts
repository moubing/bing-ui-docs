import { expect, test } from '@playwright/test'
import { exerciseRemoteTable, exerciseSharedColumns, exerciseSplitPane, exerciseSlider, exerciseDialogFrame } from '../browser/s1-interactions'

for (const [slug, example, exercise] of [
  ['table', 'remote', exerciseRemoteTable],
  ['table-column-controls', 'shared', exerciseSharedColumns],
  ['split-pane', 'basic', exerciseSplitPane],
  ['slider', 'basic', exerciseSlider],
  ['dialog', 'frame', exerciseDialogFrame],
] as const) {
  test(`${slug}：从 AI 导出运行完整新能力示例`, async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    await page.goto(`/?component=${slug}&example=${example}`)
    await exercise(page)
    expect(errors).toEqual([])
  })
}
