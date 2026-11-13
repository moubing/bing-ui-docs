import { expect, test, type Locator, type Page } from '@playwright/test'
import { readFile } from 'node:fs/promises'
import { extractVueExamples } from '../../scripts/lib/ai-docs.ts'

const screenshotStyle = '#nuxt-devtools-container, .nuxt-loading-indicator { display: none !important; }'
const pageErrors = new WeakMap<Page, string[]>()

async function setCheckbox(checkbox: Locator, checked: boolean) {
  if (await checkbox.isChecked() !== checked) await checkbox.locator('..').click()
  await expect(checkbox).toBeChecked({ checked })
}

async function openDoc(page: Page, slug: string, theme = 'light') {
  await page.addInitScript((value) => localStorage.setItem('bing-ui-docs-theme', value), theme)
  await page.goto(`/docs/components/${slug}`)
  await expect(page.locator('.doc-page h1')).toHaveText(slug === 'form' ? 'BingForm' : 'BingFormItem')
  await expect(page.locator('.doc-page .bing-form').first()).toBeVisible()
  await page.evaluate(() => document.fonts.ready)
}

test.beforeEach(async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (/hydration|failed to resolve component/i.test(message.text())) errors.push(message.text())
  })
  pageErrors.set(page, errors)
})

test.afterEach(async ({ page }) => {
  expect(pageErrors.get(page)).toEqual([])
})

for (const slug of ['form', 'form-item']) {
  for (const theme of ['light', 'dark']) {
    for (const width of [1440, 390]) {
      test(`${slug} ${theme} ${width}：正文、预览、目录与 API 排版`, async ({ page }, info) => {
        await page.setViewportSize({ width, height: 1000 })
        await openDoc(page, slug, theme)
        await expect(page.locator('html')).toHaveAttribute('data-bing-theme', theme)
        await expect(page.locator('.doc-example')).toHaveCount(3)
        await expect(page.locator('.doc-section > .bing-code-block')).toHaveCount(3)
        await expect(page.locator('.props-table')).toHaveCount(slug === 'form' ? 3 : 2)
        if (width < 600) {
          await page.goto(`/docs/components/${slug}#overview`)
          await expect(page.locator('#overview')).toBeInViewport()
        }
        await page.screenshot({
          path: info.outputPath(`${slug}-${theme}-${width}-overview.png`),
          animations: 'disabled',
          style: screenshotStyle,
        })
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
        const ids = await page.locator('.doc-page h1[id], .doc-page h2[id], .doc-page h3[id], .doc-page section[id]').evaluateAll(
          (elements) => elements.map((element) => element.id),
        )
        expect(ids).toEqual(slug === 'form'
          ? ['overview', 'layout-validation', 'methods', 'auto-focus', 'props', 'events-expose', 'events', 'expose']
          : ['overview', 'label-message', 'span-layout', 'slot-scope', 'props', 'slot-props'])
        const secondary = slug === 'form' ? 'methods' : 'span-layout'
        await page.goto(`/docs/components/${slug}#${secondary}`)
        await expect(page.locator(`#${secondary} h2`)).toBeInViewport()
        await page.screenshot({
          path: info.outputPath(`${slug}-${theme}-${width}-secondary.png`),
          animations: 'disabled',
          style: screenshotStyle,
        })
        await page.goto(`/docs/components/${slug}#props`)
        await expect(page.locator('#props h2')).toBeInViewport()
        await expect(page.locator('#props .props-table tbody tr').first()).toBeVisible()
        await page.screenshot({
          path: info.outputPath(`${slug}-${theme}-${width}-api.png`),
          animations: 'disabled',
          style: screenshotStyle,
        })
      })
    }
  }
}

test('Form：参数联动、禁用与动态代码', async ({ page }) => {
  await openDoc(page, 'form')
  const section = page.locator('#layout-validation')
  const form = section.locator('form')
  const code = section.locator('.bing-code-block__code')
  await page.getByRole('radiogroup', { name: '表单布局', exact: true }).getByRole('radio', { name: /^stack/ }).locator('..').click()
  await expect(form).toHaveClass(/bing-form--stack/)
  await expect(code).toContainText('"layout": "stack"')
  await page.getByRole('radiogroup', { name: '标签位置', exact: true }).getByRole('radio', { name: /^left/ }).locator('..').click()
  await expect(form).toHaveClass(/bing-form--label-left/)
  await page.getByRole('radiogroup', { name: '表单尺寸', exact: true }).getByRole('radio', { name: /^lg/ }).locator('..').click()
  await expect(form).toHaveClass(/bing-form--lg/)
  for (const [id, value, fragment] of [
    ['form-label-width', '140', '"labelWidth": "140px"'],
    ['form-columns-sm', '3', '"sm": 3'],
    ['form-columns-xl', '4', '"xl": 4'],
    ['form-row-gap', '20', '"row": "20px"'],
    ['form-column-gap', '24', '"column": "24px"'],
  ]) {
    await page.locator(`#${id}`).fill(value!)
    await expect(code).toContainText(fragment!)
  }
  await setCheckbox(page.getByRole('checkbox', { name: '禁用表单', exact: true }), true)
  await expect(form.getByPlaceholder('例如：组件文档站')).toBeDisabled()
  await expect(code).toContainText('"disabled": true')
  await setCheckbox(page.getByRole('checkbox', { name: '禁用表单', exact: true }), false)
  for (const name of ['auto 校验', 'change 校验', 'blur 校验', 'submit 校验']) {
    await setCheckbox(page.getByRole('checkbox', { name, exact: true }), false)
  }
  await expect(code).toContainText('manual')
  await form.getByRole('button', { name: '提交', exact: true }).click()
  await expect(section.locator('.form-demo-feedback')).toContainText('提交成功')
})

for (const [slug, sections] of [
  ['form', ['layout-validation', 'methods', 'auto-focus']],
  ['form-item', ['label-message', 'span-layout', 'slot-scope']],
] as const) {
  test(slug + '：网页复制的完整代码与 AI 文档一致', async ({ page, context }) => {
    const markdown = await readFile(new URL('../../public/ai/components/' + slug + '.md', import.meta.url), 'utf8')
    const examples = await extractVueExamples(markdown)
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await openDoc(page, slug)
    for (const [index, section] of sections.entries()) {
      await page.locator('#' + section + ' .bing-code-block').getByRole('button', { name: '复制代码', exact: true }).click()
      // Windows 剪贴板会将 LF 转成 CRLF，仅统一换行符后比较完整代码。
      await expect.poll(async () => (await page.evaluate(() => navigator.clipboard.readText())).replaceAll('\r\n', '\n')).toBe(examples[index]!)
    }
  })
}

test('Form：空值、错误值、合法值和数组最少一项校验', async ({ page }) => {
  await openDoc(page, 'form')
  const section = page.locator('#layout-validation')
  const form = section.locator('form')
  const feedback = section.locator('.form-demo-feedback')
  await form.getByRole('button', { name: '提交', exact: true }).click()
  await expect(feedback).toContainText('invalid 事件')
  await expect(form.getByText('请输入至少 2 个字符的项目名称', { exact: true })).toBeVisible()
  await expect(form.getByRole('textbox', { name: '项目名称', exact: true })).toBeFocused()
  await form.getByPlaceholder('例如：组件文档站').fill('A')
  await form.getByRole('button', { name: '提交', exact: true }).click()
  await expect(feedback).toContainText('invalid 事件')
  await form.getByPlaceholder('例如：组件文档站').fill('文档试点')
  await form.getByRole('button', { name: '选择方向', exact: true }).click()
  await page.getByRole('option', { name: /设计系统/ }).click()
  await setCheckbox(form.getByRole('checkbox', { name: '站内消息', exact: true }), false)
  await form.getByRole('button', { name: '提交', exact: true }).click()
  await expect(form.getByText('至少选择一个通知渠道', { exact: true })).toBeVisible()
  await setCheckbox(form.getByRole('checkbox', { name: '邮件通知', exact: true }), true)
  await form.getByRole('button', { name: '提交', exact: true }).click()
  await expect(feedback).toContainText('提交成功')
})

test('Form：关闭错误聚焦与滚动；新默认示例在窄屏展示实际 Tab 落点', async ({ page }, info) => {
  await page.setViewportSize({ width: 390, height: 900 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await openDoc(page, 'form', 'dark')
  await setCheckbox(page.getByRole('checkbox', { name: '滚动到错误', exact: true }), false)
  await setCheckbox(page.getByRole('checkbox', { name: '聚焦错误字段', exact: true }), false)
  const submit = page.locator('#layout-validation').getByRole('button', { name: '提交', exact: true })
  await submit.click()
  await expect(page.locator('#layout-validation .bing-form-item.is-invalid')).toHaveCount(2)
  await expect(submit).toBeFocused()
  await expect(page.locator('#layout-validation .bing-code-block__code')).toContainText('"focusOnError": false')
  const section = page.locator('#auto-focus')
  await setCheckbox(section.getByRole('checkbox'), true)
  const name = section.getByRole('textbox', { name: '姓名', exact: true })
  const email = section.getByRole('textbox', { name: '邮箱', exact: true })
  await name.fill('A')
  await expect(section.getByRole('alert')).toHaveCount(0)
  await expect(section.locator('.bing-form__next-hint')).toBeVisible()
  await name.press('Tab')
  await expect(email).toBeFocused()
  await expect(section.getByText('姓名至少 2 个字符', { exact: true })).toBeVisible()
  await section.locator('.doc-example').screenshot({ path: info.outputPath('form-auto-dark-390.png'), animations: 'disabled' })
})

test('Form：异步校验、字段校验、清错、读取错误和重置', async ({ page }) => {
  await openDoc(page, 'form')
  const section = page.locator('#methods')
  const feedback = section.locator('.form-demo-feedback')
  const fields = section.locator('form input')
  await section.getByRole('button', { name: '校验全部', exact: true }).click()
  await expect(feedback).toContainText('2 条错误')
  await expect(section.locator('form').getByText('这个邮箱已经被占用', { exact: true })).toBeVisible()
  await fields.nth(0).fill('available@example.com')
  await section.getByRole('button', { name: '校验邮箱', exact: true }).click()
  await expect(feedback).toHaveText('validateField(email)：通过')
  await expect(section.locator('form').getByText('昵称至少需要 3 个字符', { exact: true })).toBeVisible()
  await section.getByRole('button', { name: '读取错误', exact: true }).click()
  await expect(feedback).toContainText('nickname')
  await section.getByRole('button', { name: '清空错误', exact: true }).click()
  await expect(section.locator('.bing-form-item__message.is-error')).toHaveCount(0)
  await fields.nth(1).fill('Alice')
  await section.getByRole('button', { name: '校验全部', exact: true }).click()
  await expect(feedback).toHaveText('validate()：通过')
  await section.getByRole('button', { name: '重置字段', exact: true }).click()
  await expect(fields.nth(0)).toHaveValue('taken@example.com')
  await expect(fields.nth(1)).toHaveValue('Bo')
})

test('FormItem：必填标记、帮助与错误消息、禁用和跨度', async ({ page }) => {
  await openDoc(page, 'form-item')
  const section = page.locator('#label-message')
  await expect(section.locator('.bing-form-item__required')).toHaveCount(2)
  await setCheckbox(section.getByRole('checkbox', { name: '显示必填星号', exact: true }), false)
  const code = section.locator('.bing-code-block__code')
  await expect(code).toContainText('"required": false')
  await expect(section.locator('.bing-form-item__required')).toHaveCount(0)
  await section.getByRole('button', { name: '校验字段', exact: true }).click()
  await expect(section.locator('form').getByText('请输入至少 2 个字符', { exact: true })).toBeVisible()
  await section.getByRole('button', { name: '清空错误', exact: true }).click()
  await expect(section.locator('.bing-form-item__message').first()).toHaveText('帮助文本和错误文本共用同一个消息槽。')
  await setCheckbox(section.getByRole('checkbox', { name: '显示消息区域', exact: true }), false)
  await expect(code).toContainText('"showMessage": false')
  await expect(section.locator('.bing-form-item__message-slot')).toHaveCount(0)
  await setCheckbox(section.getByRole('checkbox', { name: '继承禁用状态', exact: true }), true)
  await expect(code).toContainText('"disabled": true')
  await expect(section.getByPlaceholder('输入后触发校验')).toBeDisabled()
  await section.getByRole('radiogroup', { name: 'FormItem 标签位置', exact: true }).getByRole('radio', { name: /^top/ }).locator('..').click()
  await expect(section.locator('form')).toHaveClass(/bing-form--label-top/)
  await expect(code).toContainText('"labelPosition": "top"')
  await page.locator('#form-item-label-width').fill('128')
  await expect(code).toContainText('"labelWidth": "128px"')
  const span = page.locator('#span-layout')
  await span.getByRole('radiogroup', { name: '标题字段跨度', exact: true }).getByRole('radio', { name: /^full/ }).locator('..').click()
  await expect(span.locator('.bing-code-block__code')).toContainText('"titleSpan": {')
  await expect(span.locator('.bing-code-block__code')).toContainText('"xl": 3')
  await expect(span.locator('.bing-form-item').first()).toHaveCSS('--bing-form-item-span-xl', '3')
  await span.getByRole('button', { name: '校验布局表单', exact: true }).click()
  await expect(span.locator('.form-demo-feedback')).toContainText('布局表单存在错误')
})

test('页面往返保持参数、字段值和滚动位置，目录锚点可用', async ({ page }) => {
  await openDoc(page, 'form')
  await page.getByPlaceholder('例如：组件文档站').fill('往返状态')
  await page.getByRole('radiogroup', { name: '表单布局', exact: true }).getByRole('radio', { name: /^stack/ }).locator('..').click()
  await page.locator('.docs-toc a[href="#methods"]').click()
  await expect(page.locator('#methods h2')).toBeInViewport()
  const scrollPosition = () => page.getByRole('region', { name: '文档页面', exact: true }).evaluate((element) => element.scrollTop)
  const before = await scrollPosition()
  await page.locator('.docs-sidebar a[href="/docs/components/form-item"]').click()
  await expect(page.locator('.doc-page h1')).toHaveText('BingFormItem')
  await page.locator('.docs-sidebar a[href="/docs/components/form"]').click()
  await expect(page.locator('.doc-page h1')).toHaveText('BingForm')
  await expect.poll(scrollPosition).toBeGreaterThan(before - 10)
  await expect(page.getByPlaceholder('例如：组件文档站')).toHaveValue('往返状态')
  await expect(page.locator('#layout-validation form')).toHaveClass(/bing-form--stack/)
})

test('system 主题响应系统变化，代码复制与跨组件页面正常', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.emulateMedia({ colorScheme: 'dark' })
  await openDoc(page, 'form-item', 'system')
  const bodyColor = () => page.locator('body').evaluate((element) => getComputedStyle(element).backgroundColor)
  const dark = await bodyColor()
  await page.emulateMedia({ colorScheme: 'light' })
  await expect.poll(bodyColor).not.toBe(dark)
  const code = page.locator('#slot-scope .bing-code-block')
  await code.getByRole('button', { name: '复制代码', exact: true }).click()
  const copied = await page.evaluate(() => navigator.clipboard.readText())
  expect(copied).toContain('aria-describedby')
  for (const slug of ['tabs', 'table']) {
    await page.goto(`/docs/components/${slug}`)
    await expect(page.locator('.doc-page h1')).toHaveText(slug === 'tabs' ? 'BingTabs' : 'BingTable')
    await expect(page.locator('.doc-example').first()).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
})

test('FormItem：原生预览可操作，标签与错误消息关联正确', async ({ page }, info) => {
  await page.setViewportSize({ width: 390, height: 900 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await openDoc(page, 'form-item', 'dark')
  const section = page.locator('#slot-scope')
  const input = section.getByRole('textbox', { name: '自定义控件', exact: true })
  await section.locator('.bing-form-item__label').click()
  await expect(input).toBeFocused()
  await expect(input).toHaveCSS('min-height', '40px')
  await input.fill('A')
  await input.press('Tab')
  await expect(input).toHaveAttribute('aria-invalid', 'true')
  const message = section.getByRole('alert')
  await expect(message).toHaveText('自定义字段至少需要 2 个字符')
  await expect(input).toHaveAttribute('aria-describedby', (await message.getAttribute('id'))!)
  await section.locator('.doc-example').screenshot({ path: info.outputPath('form-item-slot-dark-390.png'), animations: 'disabled' })
})
