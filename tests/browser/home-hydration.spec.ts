import { expect, test, type Page } from '@playwright/test'

type HomeProbe = {
  frames: number
  minOpacity: number
  hidden: boolean
  maxLayoutChange: number
  maxButtonGlyphChange: number
  buttonTextMismatch: boolean
  maxFloatHorizontalChange: number
  stopped: boolean
}

declare global {
  interface Window {
    homeHydrationProbe: HomeProbe
  }
}

async function waitForHydration(page: Page) {
  await page.waitForFunction(() => {
    const root = document.querySelector('#__nuxt') as HTMLElement & { __vue_app__?: { $nuxt?: { isHydrating: boolean } } }
    return root?.__vue_app__?.$nuxt?.isHydrating === false
  })
}

async function observeHome(page: Page) {
  await page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('.home-reveal, .home-stage, .motion-card .bing-card__surface'))
      .filter(element => getComputedStyle(element).display !== 'none' && element.getBoundingClientRect().width > 0)
    const bounds = elements.map(element => element.getBoundingClientRect())
    const floats = Array.from(document.querySelectorAll<HTMLElement>('.home-float'))
      .filter(element => element.getBoundingClientRect().width > 0)
    const floatBounds = floats.map(element => element.getBoundingClientRect())
    const button = document.querySelector('.home-actions-new .bing-button')!
    const readButtonGlyphs = () => {
      const content = button.querySelector('.bing-animated-text__content')!
      const visibleText = getComputedStyle(content).opacity === '0'
        ? button.querySelector('.bing-animated-text__jump-layer')!
        : content
      const glyphs: { character: string; x: number; y: number }[] = []
      for (const root of [visibleText, ...button.querySelectorAll('.bing-button__icon')]) {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
        while (walker.nextNode()) {
          const node = walker.currentNode as Text
          for (let index = 0; index < node.length; index++) {
            const character = node.data[index]!
            if (/\s/.test(character)) continue
            const range = document.createRange()
            range.setStart(node, index)
            range.setEnd(node, index + 1)
            const { x, y } = range.getBoundingClientRect()
            glyphs.push({ character, x, y })
          }
        }
      }
      return glyphs
    }
    const initialGlyphs = readButtonGlyphs()
    const probe: HomeProbe = {
      frames: 0, minOpacity: 1, hidden: false, maxLayoutChange: 0,
      maxButtonGlyphChange: 0, buttonTextMismatch: false, maxFloatHorizontalChange: 0, stopped: false,
    }
    window.homeHydrationProbe = probe

    const sample = () => {
      probe.frames++
      elements.forEach((element, index) => {
        const style = getComputedStyle(element)
        const current = element.getBoundingClientRect()
        const initial = bounds[index]!
        probe.minOpacity = Math.min(probe.minOpacity, Number(style.opacity))
        probe.hidden ||= !element.isConnected || style.visibility === 'hidden'
        probe.maxLayoutChange = Math.max(probe.maxLayoutChange,
          Math.abs(current.x - initial.x), Math.abs(current.y - initial.y),
          Math.abs(current.width - initial.width), Math.abs(current.height - initial.height))
      })
      const glyphs = readButtonGlyphs()
      probe.buttonTextMismatch ||= glyphs.length !== initialGlyphs.length
      glyphs.forEach((glyph, index) => {
        const initial = initialGlyphs[index]
        if (!initial || initial.character !== glyph.character) probe.buttonTextMismatch = true
        else probe.maxButtonGlyphChange = Math.max(probe.maxButtonGlyphChange,
          Math.abs(glyph.x - initial.x), Math.abs(glyph.y - initial.y))
      })
      floats.forEach((element, index) => {
        probe.maxFloatHorizontalChange = Math.max(probe.maxFloatHorizontalChange,
          Math.abs(element.getBoundingClientRect().x - floatBounds[index]!.x))
      })
      if (!probe.stopped) requestAnimationFrame(sample)
    }
    requestAnimationFrame(sample)
  })
}

for (const width of [1920, 1440, 390]) {
  test(`首页 ${width}px：延迟客户端接管后首屏持续可见且位置稳定`, async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('console', message => {
      if (/hydration/i.test(message.text())) errors.push(message.text())
    })
    await page.setViewportSize({ width, height: 1000 })
    await page.emulateMedia({ reducedMotion: 'no-preference' })

    let releaseScripts!: () => void
    const scriptsReady = new Promise<void>(resolve => { releaseScripts = resolve })
    await page.route('**/*', async route => {
      if (route.request().resourceType() === 'script') await scriptsReady
      await route.continue()
    })

    try {
      await page.goto('/', { waitUntil: 'commit' })
      await page.locator('.home-title').waitFor()
      await page.evaluate(() => document.fonts.ready)
      // 首次绘制的动画必须能在客户端脚本仍未加载时自行结束。
      await expect.poll(() => page.locator('.landing-hero').evaluate(root =>
        root.getAnimations({ subtree: true }).filter(animation => animation.playState === 'running').length,
      )).toBe(0)
      await observeHome(page)
    } finally {
      releaseScripts()
    }

    await waitForHydration(page)
    // 覆盖客户端接管及此前超过一秒的整屏入场时间，逐帧捕获短暂闪烁。
    await page.waitForTimeout(1500)
    const probe = await page.evaluate(() => {
      window.homeHydrationProbe.stopped = true
      return window.homeHydrationProbe
    })
    expect(probe.frames).toBeGreaterThan(2)
    expect(probe.minOpacity, '已显示的首屏不能在接管后再次淡出').toBe(1)
    expect(probe.hidden).toBe(false)
    expect(probe.maxLayoutChange, '首屏不应在接管后位移或缩放').toBeLessThan(1)
    expect(probe.buttonTextMismatch).toBe(false)
    expect.soft(probe.maxButtonGlyphChange, '开始使用的文字和箭头不能在拆字初始化时偏移').toBeLessThan(1)
    expect.soft(probe.maxFloatHorizontalChange, '浮标允许小角度旋转，不应丢失横向定位').toBeLessThan(2)
    expect(errors).toEqual([])
  })
}

test('首页：禁用 JavaScript 时直接呈现完整演示卡片', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false, reducedMotion: 'reduce', viewport: { width: 1440, height: 1000 } })
  try {
    const page = await context.newPage()
    await page.goto('/')
    await expect(page.locator('.motion-grid .bing-card')).toHaveCount(2)
    await expect(page.getByText('Responsive', { exact: true })).toBeVisible()
    await expect(page.getByText('Purposeful', { exact: true })).toBeVisible()
    await expect(page.locator('.motion-grid')).not.toContainText('Motion preview')
    await expect(page.locator('.home-title')).toHaveCSS('opacity', '1')
    expect(await page.locator('.landing-hero').evaluate(root => root.getAnimations({ subtree: true }).length)).toBe(0)
  } finally {
    await context.close()
  }
})
