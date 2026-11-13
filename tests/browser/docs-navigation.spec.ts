import { expect, test, type Page } from '@playwright/test'

type NavigationIndicatorElement = HTMLElement & {
  __vueParentComponent: {
    parent: {
      setupState: {
        nuxtApp: { isHydrating: boolean }
        pageTransitionHooks: { onAfterEnter?: unknown; onEnterCancelled?: unknown }
      }
    }
  }
}

function collectRuntimeErrors(page: Page) {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', message => {
    if (message.type() === 'error' || /Duplicate keys|Unhandled error|recursive updates|hydration/i.test(message.text())) {
      errors.push(message.text())
    }
  })
  return errors
}

async function waitForDocs(page: Page, slug: string, title: string) {
  await expect(page).toHaveURL(new RegExp(`/docs/components/${slug}$`))
  await expect(page.locator('.doc-page h1')).toHaveText([title])
  await expect(page.locator('.docs-nav-list a[aria-current="page"]')).toHaveCount(1)
  await expect(page.locator('.docs-nav-list a[aria-current="page"]')).toHaveAttribute('href', `/docs/components/${slug}`)
  await expect.poll(() => page.evaluate(() => {
    const headings = [...document.querySelectorAll('.doc-page h1[id], .doc-page h2[id], .doc-page h3[id], .doc-page section[id]')]
    const toc = [...document.querySelectorAll<HTMLAnchorElement>('.docs-toc-list a')]
    return toc.map(link => decodeURIComponent(link.hash.slice(1))).join(',') === headings.map(heading => heading.id).join(',')
  })).toBe(true)
}

async function samplePageMotion(page: Page, slug: string) {
  return page.evaluate(async (targetSlug) => {
    const content = document.querySelector<HTMLElement>('.docs-content')!
    const link = document.querySelector<HTMLAnchorElement>(`.docs-nav-list a[href="/docs/components/${targetSlug}"]`)!
    const samples: { documents: { path: string; opacity: number; y: number; blur: number }[]; tocIds: string[] }[] = []
    link.click()
    // 采样完整离场和入场，避免仅验证新页淡入而遗漏旧页突然消失。
    for (let frame = 0; frame < 60; frame++) {
      await new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
      const documents = [...content.querySelectorAll<HTMLElement>('[data-docs-route]')].map(element => {
        const style = getComputedStyle(element)
        return {
          path: element.dataset.docsRoute!,
          opacity: Number(style.opacity),
          y: style.transform === 'none' ? 0 : new DOMMatrixReadOnly(style.transform).m42,
          blur: Number.parseFloat(style.filter.match(/blur\(([-.\d]+)/)?.[1] || '0'),
        }
      })
      const tocIds = [...document.querySelectorAll<HTMLAnchorElement>('.docs-toc-list a')].map(element => element.hash)
      samples.push({ documents, tocIds })
    }
    return samples
  }, slug)
}

async function waitForNavigationReady(page: Page) {
  await page.waitForFunction(() => {
    const indicator = document.querySelector('.nuxt-loading-indicator') as NavigationIndicatorElement | null
    return indicator?.__vueParentComponent?.parent.setupState.nuxtApp.isHydrating === false
  })
}

async function omitTransitionCompletionCallbacks(page: Page) {
  await waitForNavigationReady(page)
  await page.evaluate(() => {
    const indicator = document.querySelector('.nuxt-loading-indicator') as NavigationIndicatorElement
    // 故障注入只丢弃业务回调，Vue 的原生动画和样式清理照常执行。
    indicator.__vueParentComponent.parent.setupState.pageTransitionHooks.onAfterEnter = undefined
    indicator.__vueParentComponent.parent.setupState.pageTransitionHooks.onEnterCancelled = undefined
  })
}

test('文档导航：连点夹带轻微上移时不进入原生拖拽，仍可切页和操作', async ({ page }) => {
  const errors = collectRuntimeErrors(page)
  let documentNavigations = 0
  page.on('request', request => {
    if (request.isNavigationRequest() && request.frame() === page.mainFrame()) documentNavigations++
  })
  await page.setViewportSize({ width: 1800, height: 1100 })
  await page.goto('/docs/components/cursor')
  await waitForNavigationReady(page)
  await page.evaluate(() => document.fonts.ready)
  await page.evaluate(() => {
    const observedWindow = Object.assign(window, { __docsNavigationDrags: [] as string[] })
    document.addEventListener('dragstart', event => {
      const link = (event.target as Element).closest<HTMLAnchorElement>('.docs-nav-list a')
      if (!link) return
      // 等冒泡结束，记录真正进入浏览器原生拖拽的事件。
      queueMicrotask(() => {
        if (!event.defaultPrevented) observedWindow.__docsNavigationDrags.push(link.pathname)
      })
    }, { capture: true })
  })

  const slugs = ['drop-down', 'dialog', 'deck-transition', 'date-picker', 'cursor', 'color-picker']
  const boxes = await Promise.all(slugs.map(slug => page.locator(`.docs-nav-list a[href="/docs/components/${slug}"]`).boundingBox()))
  for (const box of boxes) {
    expect(box).not.toBeNull()
    // 模拟快速向上连点时，鼠标尚未松开就已移动；普通 mouse.click 覆盖不到这条路径。
    const x = box!.x + 40
    const y = box!.y + box!.height / 2
    await page.mouse.move(x, y + 5)
    await page.mouse.down()
    await page.mouse.move(x, y - 5, { steps: 2 })
    await page.mouse.up()
  }
  expect(await page.evaluate(() => (window as unknown as { __docsNavigationDrags: string[] }).__docsNavigationDrags)).toEqual([])
  await waitForDocs(page, 'color-picker', 'BingColorPicker')

  await page.locator('.docs-nav-list a[href="/docs/components/button"]').click()
  await waitForDocs(page, 'button', 'BingButton')
  await page.locator('#button-label').fill('轻微拖动后仍可操作')
  await expect(page.locator('#playground .doc-example__preview button')).toContainText('轻微拖动后仍可操作')
  // 首次打开和连续切页共用一个文档，开发依赖预编译也不能触发整页重载。
  expect(documentNavigations).toBe(1)
  expect(errors).toEqual([])
})

test('文档导航：从下往上极速连点保持手动滚动位置，停止后仍可操作', async ({ page }) => {
  const errors = collectRuntimeErrors(page)
  await page.setViewportSize({ width: 1800, height: 1100 })
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'no-preference' })
  await page.goto('/docs/components/file-preview')
  await waitForNavigationReady(page)
  await page.evaluate(() => document.fonts.ready)
  const navigation = page.getByRole('region', { name: '文档导航', exact: true })

  for (const gap of [0, 15, 30]) {
    for (const [top, slugs, lastTitle] of [
      [520, ['sortable-list', 'select', 'scrollbar', 'resizable', 'radio-group', 'radio', 'input', 'image-preview', 'image', 'icon', 'form-item', 'form', 'file-preview'], 'BingFilePreview'],
      [200, ['file-preview', 'drop-down', 'dialog', 'deck-transition', 'date-picker', 'cursor', 'color-picker'], 'BingColorPicker'],
    ] as const) {
      // 只在每组开始前手动滚动一次，提前读取坐标，连点时不自动定位链接或等待导航。
      await navigation.evaluate((element, top) => { element.scrollTop = top }, top)
      const scrollTop = await navigation.evaluate(element => element.scrollTop)
      const boxes = await Promise.all(slugs.map(slug => page.locator(`.docs-nav-list a[href="/docs/components/${slug}"]`).boundingBox()))
      for (const box of boxes) {
        expect(box).not.toBeNull()
        await page.mouse.click(box!.x + 20, box!.y + box!.height / 2)
        if (gap) await new Promise(resolve => setTimeout(resolve, gap))
        expect(await navigation.evaluate(element => element.scrollTop)).toBe(scrollTop)
      }
      await waitForDocs(page, slugs[slugs.length - 1]!, lastTitle)
      expect(await navigation.evaluate(element => element.scrollTop)).toBe(scrollTop)
    }
  }

  await page.locator('.docs-nav-list a[href="/docs/components/button"]').click()
  await waitForDocs(page, 'button', 'BingButton')
  await page.locator('#button-label').fill('从下往上连点后仍可操作')
  await expect(page.locator('#playground .doc-example__preview button')).toContainText('从下往上连点后仍可操作')
  // 真实拖选能覆盖整页鼠标被遮挡或文字选择被锁住的情况。
  await page.locator('.doc-page h1').scrollIntoViewIfNeeded()
  const heading = await page.locator('.doc-page h1').boundingBox()
  expect(heading).not.toBeNull()
  await page.mouse.move(heading!.x + 2, heading!.y + heading!.height / 2)
  await page.mouse.down()
  await page.mouse.move(heading!.x + 180, heading!.y + heading!.height / 2, { steps: 6 })
  await page.mouse.up()
  await expect.poll(() => page.evaluate(() => window.getSelection()?.toString() ?? '')).toContain('Bing')
  expect(errors).toEqual([])
})

for (const [first, second, secondTitle] of [
  ['scrollbar', 'sortable-list', 'BingSortableList'],
  ['form', 'file-preview', 'BingFilePreview'],
] as const) {
  test(`文档导航：${first} 与 ${second} 连点后，即使完成回调缺失也能继续操作`, async ({ page }) => {
    const errors = collectRuntimeErrors(page)
    await page.setViewportSize({ width: 1800, height: 1100 })
    await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'no-preference' })
    await page.goto(`/docs/components/${first}`)
    await expect(page.locator('.doc-example__preview')).not.toHaveCount(0)
    await omitTransitionCompletionCallbacks(page)
    // 目录不再自动居中，测试开始前手动让这组深层链接进入可见区域。
    await page.locator(`.docs-nav-list a[href="/docs/components/${first}"]`).scrollIntoViewIfNeeded()
    await page.locator(`.docs-nav-list a[href="/docs/components/${second}"]`).scrollIntoViewIfNeeded()

    for (const gap of [20, 80, 140, 220]) {
      // 直接发送鼠标事件，避免 click 的导航等待掩盖连续点击。
      for (const slug of [second, first, second, first, second]) {
        const box = await page.locator(`.docs-nav-list a[href="/docs/components/${slug}"]`).boundingBox()
        expect(box).not.toBeNull()
        await page.mouse.click(box!.x + 20, box!.y + box!.height / 2)
        await new Promise(resolve => setTimeout(resolve, gap))
      }
      await waitForDocs(page, second, secondTitle)
      await expect(page.locator(`[data-docs-route="/docs/components/${second}"]`)).toHaveCSS('transform', 'none')
    }

    await page.locator('.docs-nav-list a[href="/docs/components/button"]').click()
    await waitForDocs(page, 'button', 'BingButton')
    await page.locator('#button-label').fill('完成回调缺失后仍可操作')
    await expect(page.locator('#playground .doc-example__preview button')).toContainText('完成回调缺失后仍可操作')
    expect(errors).toEqual([])
  })
}

test('文档导航：恢复等待时仍等完整动画结束，不以固定超时打断过渡', async ({ page }) => {
  await page.setViewportSize({ width: 1800, height: 1100 })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/docs/components/form')
  await expect(page.locator('.doc-example__preview')).not.toHaveCount(0)
  await waitForNavigationReady(page)
  await page.locator('.docs-nav-list a[href="/docs/components/file-preview"]').click()
  await waitForDocs(page, 'file-preview', 'BingFilePreview')
  await expect(page.locator('[data-docs-route="/docs/components/file-preview"]')).toHaveCSS('transform', 'none')
  await omitTransitionCompletionCallbacks(page)
  await page.addStyleTag({ content: '.docs-page-enter-active, .docs-page-leave-active { transition-duration: 700ms; }' })
  await page.locator('.docs-nav-list a[href="/docs/components/form"]').evaluate(link => (link as HTMLAnchorElement).click())
  await page.waitForFunction(() => Boolean(document.querySelector('.docs-page-leave-active')))
  await page.locator('.docs-nav-list a[href="/docs/components/scrollbar"]').evaluate(link => (link as HTMLAnchorElement).click())
  await new Promise(resolve => setTimeout(resolve, 800))
  await expect(page).toHaveURL(/\/docs\/components\/form$/)
  await waitForDocs(page, 'scrollbar', 'BingScrollbar')
  await expect(page.locator('[data-docs-route="/docs/components/scrollbar"]')).toHaveCSS('transform', 'none')
})

test('文档导航：缓存页的旧完成回调不能提前放行新一轮过渡', async ({ page }) => {
  await page.setViewportSize({ width: 1800, height: 1100 })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/docs/components/form')
  await expect(page.locator('.doc-example__preview')).not.toHaveCount(0)
  await waitForNavigationReady(page)
  const cachedForm = await page.locator('[data-docs-route="/docs/components/form"]').elementHandle()
  await page.locator('.docs-nav-list a[href="/docs/components/file-preview"]').click()
  await waitForDocs(page, 'file-preview', 'BingFilePreview')
  await expect(page.locator('[data-docs-route="/docs/components/file-preview"]')).toHaveCSS('transform', 'none')
  await page.addStyleTag({ content: '.docs-page-enter-active, .docs-page-leave-active { transition-duration: 700ms; }' })
  await page.locator('.docs-nav-list a[href="/docs/components/form"]').evaluate(link => (link as HTMLAnchorElement).click())
  await page.waitForFunction(() => Boolean(document.querySelector('.docs-page-leave-active')))
  // 模拟旧一轮缓存页的回调延迟到新一轮导航：路径相同，但新页还没有完成入场。
  await cachedForm!.evaluate(element => {
    const indicator = document.querySelector('.nuxt-loading-indicator') as NavigationIndicatorElement
    const onAfterEnter = indicator.__vueParentComponent.parent.setupState.pageTransitionHooks.onAfterEnter as (element: Element) => void
    onAfterEnter(element)
  })
  await page.locator('.docs-nav-list a[href="/docs/components/scrollbar"]').evaluate(link => (link as HTMLAnchorElement).click())
  await new Promise(resolve => setTimeout(resolve, 800))
  await expect(page).toHaveURL(/\/docs\/components\/form$/)
  await waitForDocs(page, 'scrollbar', 'BingScrollbar')
  await expect(page.locator('[data-docs-route="/docs/components/scrollbar"]')).toHaveCSS('transform', 'none')
})

for (const reducedMotion of ['no-preference', 'reduce'] as const) {
  test(`文档过渡：${reducedMotion} 保留完整离场、模糊和入场，目录无重复`, async ({ page }) => {
    await page.setViewportSize({ width: 1800, height: 1100 })
    await page.emulateMedia({ reducedMotion })
    await page.goto('/docs/components/button')
    await expect(page.locator('#button-label')).toBeVisible()
    await page.locator('.docs-nav-list a[href="/docs/components/checkbox-group"]').click()
    await waitForDocs(page, 'checkbox-group', 'BingCheckboxGroup')
    await expect(page.locator('[data-docs-route="/docs/components/checkbox-group"]')).toHaveCSS('transform', 'none')

    const samples = await samplePageMotion(page, 'button')
    await waitForDocs(page, 'button', 'BingButton')
    expect(samples.every(sample => new Set(sample.tocIds).size === sample.tocIds.length)).toBe(true)
    if (reducedMotion === 'reduce') {
      expect(samples.every(sample => sample.documents.every(document => document.y === 0 && document.blur === 0))).toBe(true)
    } else {
      const documents = samples.flatMap(sample => sample.documents)
      expect(documents.some(document => document.path.endsWith('/checkbox-group') && document.opacity > 0 && document.opacity < 1 && document.y < 0 && document.blur > 0)).toBe(true)
      expect(documents.some(document => document.path.endsWith('/button') && document.opacity > 0 && document.opacity < 1 && document.y > 0 && document.blur > 0)).toBe(true)
      const incoming = documents.filter(document => document.path.endsWith('/button'))
      expect(incoming.every((document, index) => index === 0 || document.opacity >= incoming[index - 1]!.opacity - 0.01)).toBe(true)
      const firstVisibleIncoming = samples.findIndex(sample => sample.documents.some(document => document.path.endsWith('/button') && document.opacity > 0.02))
      const lastVisibleOutgoing = samples.findLastIndex(sample => sample.documents.some(document => document.path.endsWith('/checkbox-group') && document.opacity > 0.02))
      expect(firstVisibleIncoming).toBeGreaterThan(lastVisibleOutgoing)
    }
    const document = page.locator('[data-docs-route="/docs/components/button"]')
    await expect(document).toHaveCSS('opacity', '1')
    await expect(document).toHaveCSS('transform', 'none')
    await expect(document).toHaveCSS('filter', 'none')
    await expect(document).not.toHaveAttribute('class', /docs-page-(enter|leave)/)
  })
}

test('文档过渡：播放中开启减少动态效果或离开布局，不遗留透明正文', async ({ page }) => {
  const errors = collectRuntimeErrors(page)
  await page.setViewportSize({ width: 1800, height: 1100 })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/docs/components/button')
  await expect(page.locator('#button-label')).toBeVisible()
  await page.locator('.docs-nav-list a[href="/docs/components/checkbox-group"]').click()
  await waitForDocs(page, 'checkbox-group', 'BingCheckboxGroup')
  await expect(page.locator('[data-docs-route="/docs/components/checkbox-group"]')).toHaveCSS('transform', 'none')

  await page.locator('.docs-nav-list a[href="/docs/components/button"]').evaluate(link => (link as HTMLAnchorElement).click())
  await page.waitForFunction(() => {
    const leaving = document.querySelector('.docs-page-leave-active')
    if (!leaving) return false
    const opacity = Number(getComputedStyle(leaving).opacity)
    return opacity > 0 && opacity < 1
  })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await waitForDocs(page, 'button', 'BingButton')
  await expect(page.locator('[data-docs-route="/docs/components/button"]')).toHaveCSS('opacity', '1')
  await expect(page.locator('[data-docs-route="/docs/components/button"]')).toHaveCSS('transform', 'none')

  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.locator('.docs-nav-list a[href="/docs/components/checkbox-group"]').evaluate(link => (link as HTMLAnchorElement).click())
  await page.getByRole('link', { name: 'Bing UI 首页', exact: true }).click()
  await expect(page.locator('.home-page')).toBeVisible()
  await page.getByRole('button', { name: /开始使用/ }).click()
  await expect(page.locator('.doc-page h1')).toHaveText('快速开始')
  await expect(page.locator('.docs-content')).toHaveCSS('opacity', '1')
  await expect(page.locator('.docs-content')).toHaveCSS('visibility', 'visible')
  expect(errors).toEqual([])
})

test('文档导航：取消等待中的跳转后，当前页和后续导航仍然可用', async ({ page }) => {
  const errors = collectRuntimeErrors(page)
  await page.setViewportSize({ width: 1800, height: 1100 })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/docs/components/button')
  await expect(page.locator('#button-label')).toBeVisible()
  // 先访问两页，确保取消发生在缓存页的过渡中，而不是首次解析页面的阶段。
  await page.locator('.docs-nav-list a[href="/docs/components/checkbox-group"]').click()
  await waitForDocs(page, 'checkbox-group', 'BingCheckboxGroup')
  await page.locator('.docs-nav-list a[href="/docs/components/button"]').click()
  await waitForDocs(page, 'button', 'BingButton')
  await expect(page.locator('[data-docs-route="/docs/components/button"]')).toHaveCSS('transform', 'none')
  await page.locator('.docs-nav-list a[href="/docs/components/checkbox-group"]').evaluate(link => (link as HTMLAnchorElement).click())
  await page.waitForFunction(() => Boolean(document.querySelector('.docs-page-leave-active')), undefined, { timeout: 5000 })
  await page.evaluate(() => {
    document.querySelector<HTMLAnchorElement>('.docs-nav-list a[href="/docs/components/date-picker"]')!.click()
    // 再点当前路由会取消尚未提交的 DatePicker 跳转，不能留下未释放的等待。
    document.querySelector<HTMLAnchorElement>('.docs-nav-list a[href="/docs/components/checkbox-group"]')!.click()
  })
  await waitForDocs(page, 'checkbox-group', 'BingCheckboxGroup')
  await page.locator('.docs-nav-list a[href="/docs/components/button"]').click()
  await waitForDocs(page, 'button', 'BingButton')
  await page.locator('#button-label').fill('取消跳转后仍可操作')
  await expect(page.locator('#playground .doc-example__preview button')).toContainText('取消跳转后仍可操作')
  expect(errors).toEqual([])
})

for (const gap of [0, 100, 180]) {
  test(`文档导航：间隔 ${gap}ms 连续点击后路由、正文和目录一致且仍可操作`, async ({ page }) => {
    const errors = collectRuntimeErrors(page)
    await page.setViewportSize({ width: 1800, height: 1100 })
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.goto('/docs/components/checkbox-group')
    await expect(page.getByRole('group', { name: '功能开关选项', exact: true })).toBeVisible()

    // 鼠标事件不等待导航结束，覆盖旧页离场时再次点击和缓存页面反复进入。
    for (let round = 0; round < 3; round++) {
      for (const slug of ['button', 'checkbox', 'checkbox-group', 'color-picker', 'date-picker', 'checkbox-group', 'date-picker']) {
        const box = await page.locator(`.docs-nav-list a[href="/docs/components/${slug}"]`).boundingBox()
        expect(box).not.toBeNull()
        await page.mouse.click(box!.x + 20, box!.y + box!.height / 2)
        if (gap) await new Promise(resolve => setTimeout(resolve, gap))
      }
      await waitForDocs(page, 'date-picker', 'BingDatePicker')
    }

    // 停止连点后仍能切页、操作控件、跳转锚点，并通过历史记录返回。
    await page.locator('.docs-nav-list a[href="/docs/components/button"]').click()
    await waitForDocs(page, 'button', 'BingButton')
    await page.locator('#button-label').fill('连续切换后仍可操作')
    await expect(page.locator('#playground .doc-example__preview button')).toContainText('连续切换后仍可操作')
    await page.locator('.docs-toc a[href="#props"]').click()
    await expect(page.locator('#props h2')).toBeInViewport()
    await page.goBack()
    await waitForDocs(page, 'date-picker', 'BingDatePicker')
    await page.goForward()
    await expect(page).toHaveURL(/\/docs\/components\/button#props$/)
    await expect(page.locator('#props h2')).toBeInViewport()
    await expect(page.locator('#button-label')).toHaveValue('连续切换后仍可操作')
    expect(errors).toEqual([])
  })
}
