import { expect, test, type Locator } from '@playwright/test'

async function textLayout(target: Locator) {
  return target.evaluate(root => {
    const bounds = root.getBoundingClientRect()
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
    const lines = new Map<number, string>()

    while (walker.nextNode()) {
      const node = walker.currentNode as Text
      for (let index = 0; index < node.length; index++) {
        const character = node.data[index]!
        if (/\s/.test(character)) continue
        const range = document.createRange()
        range.setStart(node, index)
        range.setEnd(node, index + 1)
        const line = Math.round(range.getBoundingClientRect().top - bounds.top)
        lines.set(line, (lines.get(line) ?? '') + character)
      }
    }

    return { height: bounds.height, lines: [...lines.values()] }
  })
}

test('首页标题：刷新前后换行一致，跳字标点不落单', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', message => {
    if (/hydration/i.test(message.text())) errors.push(message.text())
  })
  await page.emulateMedia({ reducedMotion: 'no-preference' })

  let releaseScripts!: () => void
  const scriptsReady = new Promise<void>(resolve => { releaseScripts = resolve })
  await page.route('**/*', async route => {
    if (route.request().resourceType() === 'script') await scriptsReady
    await route.continue()
  })

  const widths = [1800, 1440, 1280, 390, 320]
  const initial = new Map<number, { title: Awaited<ReturnType<typeof textLayout>>, motion: Awaited<ReturnType<typeof textLayout>> }>()
  const title = page.locator('.home-title__statement')
  const motion = page.locator('.stage-scene--motion h2')

  try {
    // 延迟客户端脚本，直接测量用户刷新后首先看到的服务端文字。
    await page.goto('/', { waitUntil: 'commit' })
    await title.waitFor()
    // 排除整张卡片的透视和入场位移，只比较文字实际占据的行。
    await page.addStyleTag({ content: '.home-stage, .home-reveal { transform: none !important; translate: none !important; }' })
    await page.evaluate(() => document.fonts.ready)
    for (const width of widths) {
      await page.setViewportSize({ width, height: 1100 })
      initial.set(width, { title: await textLayout(title), motion: await textLayout(motion) })
    }
    await page.setViewportSize({ width: 1800, height: 1100 })
  } finally {
    releaseScripts()
  }

  await expect(motion.locator('[data-jump-ready]')).toBeAttached()
  await page.waitForFunction(() => {
    const root = document.querySelector('#__nuxt') as HTMLElement & { __vue_app__?: { $nuxt?: { isHydrating: boolean } } }
    return root?.__vue_app__?.$nuxt?.isHydrating === false
  })
  await page.evaluate(() => document.fonts.ready)
  await expect(page.locator('.home-title')).toHaveCSS('opacity', '1')
  const animatedText = motion.locator('.bing-animated-text')
  const jumpLayer = motion.locator('.bing-animated-text__jump-layer')

  for (const width of widths) {
    await page.setViewportSize({ width, height: 1100 })
    const before = initial.get(width)!
    expect(await textLayout(title), `主标题 ${width}px`).toEqual(before.title)
    expect(await textLayout(jumpLayer), `跳字标题 ${width}px`).toEqual(before.motion)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    expect((await textLayout(jumpLayer)).lines.every(line => !/^[，。]/.test(line))).toBe(true)
  }

  await page.setViewportSize({ width: 1800, height: 1100 })
  await animatedText.hover()
  await expect(animatedText).toHaveAttribute('data-jump-playing', 'true')
  await expect.poll(() => jumpLayer.locator('.bing-animated-text__char').evaluateAll(chars =>
    chars.some(char => new DOMMatrixReadOnly(getComputedStyle(char).transform).m42 < -1),
  )).toBe(true)
  await expect(animatedText).not.toHaveAttribute('data-jump-playing', 'true')
  expect(await textLayout(jumpLayer)).toEqual(initial.get(1800)!.motion)

  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(animatedText).not.toHaveAttribute('data-jump-ready', 'true')
  expect(await textLayout(motion.locator('.bing-animated-text__content'))).toEqual(initial.get(1800)!.motion)
  expect(errors).toEqual([])
})
