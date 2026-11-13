import { expect, test } from '@playwright/test'
import { componentMigrations, componentTitle, docsVersion, getMigrationStatus, versionNotice } from '../../shared/docs/migration.ts'

for (const [theme, width] of [['light', 1440], ['dark', 390]] as const) {
  test(`版本迁移 ${theme} ${width}：网页提示、页面切换与 AI 清单一致`, async ({ page, request }, info) => {
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('console', message => {
      if (/hydration|failed to resolve component/i.test(message.text())) errors.push(message.text())
    })
    await page.setViewportSize({ width, height: 1000 })
    await page.addInitScript(value => localStorage.setItem('bing-ui-docs-theme', value), theme)
    const response = await request.get('/ai/manifest.json')
    expect(response.ok()).toBe(true)
    const manifest = await response.json()
    expect(manifest.packageVersion).toBe(docsVersion.packageVersion)
    for (const slug of ['button', 'image', 'cursor'] as const) {
      await page.goto('/docs/components/' + slug)
      await expect(page.locator('.doc-page h1')).toHaveText(componentTitle(slug))
      await expect(page.locator(slug === 'cursor' ? '#basic .cursor-basic-zone' : '.doc-example__preview .bing-' + slug).first()).toBeVisible()
      const status = getMigrationStatus(componentMigrations[slug])
      const notice = page.locator('[data-docs-migration]')
      expect(manifest.components[slug].status).toBe(status)
      if (status === 'verified') {
        await expect(notice).toHaveCount(0)
        expect(manifest.coverage).toContain(slug)
      } else {
        await expect(notice).toHaveAttribute('data-docs-migration', status)
        await expect(notice).toContainText(versionNotice(componentMigrations[slug]))
        expect(manifest.coverage).not.toContain(slug)
        expect(manifest.pendingCoverage).toContain(slug)
      }
      await expect(page.locator('html')).toHaveAttribute('data-bing-theme', theme)
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
      await page.evaluate(() => document.fonts.ready)
      // 窄屏导航在正文前方，截图必须实际滚动到待核对的内容。
      const screenshotTarget = status === 'verified' ? page.locator('.doc-page h1') : notice
      await screenshotTarget.evaluate(node => node.scrollIntoView({ block: 'center', behavior: 'instant' }))
      await expect(screenshotTarget).toBeInViewport()
      await page.screenshot({ path: info.outputPath(`${slug}-${theme}-${width}-migration.png`), animations: 'disabled', style: '#nuxt-devtools-container { display: none !important; }' })
    }
    expect(errors).toEqual([])
  })
}
