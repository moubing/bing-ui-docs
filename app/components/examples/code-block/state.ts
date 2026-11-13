import { computed, ref, watch } from 'vue'
import type { BingCodeBlockCopyPayload, BingCodeBlockHighlightLine, BingCodeBlockTheme, BingRadioValue, BingSelectOption } from '@moubing/bing-ui'
import playgroundUsageCodeSource from '~~/examples/code-block/basic.vue?raw'
import scrollCodeSource from '~~/examples/code-block/highlight.vue?raw'
import wrapUsageCodeSource from '~~/examples/code-block/wrap.vue?raw'
import resizableCodeSource from '~~/examples/code-block/resizable.vue?raw'
import { renderExampleCode } from '#shared/docs/example-code'
import { inject as injectExampleState, provide as provideExampleState, type InjectionKey } from 'vue'

function createExamples() {
  type RadioOption<T extends string> = {
    label: string
    value: T
    description?: string
  }

  type LanguageChoice = 'vue' | 'ts' | 'json'

  type ThemeChoice = Extract<
    BingCodeBlockTheme,
    | 'auto'
    | 'vitesse-light'
    | 'vitesse-dark'
    | 'github-light'
    | 'github-dark'
    | 'light-plus'
    | 'dark-plus'
  >

  type HighlightMode = 'none' | 'single' | 'range'

  const codeSamples: Record<LanguageChoice, string> = {
  vue: `<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)

function openDialog() {
  visible.value = true
}
<${'/'}script>

<template>
  <BingButton @click="openDialog">打开弹窗</BingButton>
  <BingDialog v-model="visible" title="发布确认">
    当前文档会进入公开状态。
  </BingDialog>
</template>`,
  ts: `type Status = 'idle' | 'loading' | 'ready'

export function createStatusText(status: Status) {
  const labels = {
    idle: '等待操作',
    loading: '正在处理',
    ready: '处理完成',
  }

  return labels[status]
}`,
  json: `{
  "name": "@moubing/bing-ui",
  "private": false,
  "components": [
    "BingButton",
    "BingCodeBlock",
    "BingDialog"
  ]
}`,
}



  const longCode = Array.from({ length: 26 }, (_, index) => {
    const line = index + 1

    return `const metric${line.toString().padStart(2, '0')} = collectComponentSignal(source[${index}], { animated: true, density: 'compact' })`
  }).join('\n')

  const highlightLineOptions: BingSelectOption[] = Array.from({ length: 26 }, (_, index) => ({
    label: `第 ${index + 1} 行`,
    value: index + 1,
    description: `metric${(index + 1).toString().padStart(2, '0')}`,
  }))

  const wrapCode = `const message = '这是一行刻意写得比较长的代码，用来观察 wrap 打开后是否保留缩进并在容器内自然换行，适合移动端文档或较窄的示例区域。'

export function previewMessage() {
  return message.toUpperCase()
}`

  const languageOptions: RadioOption<LanguageChoice>[] = [
    { label: 'vue', value: 'vue', description: '组件示例，适合文档页面。' },
    { label: 'ts', value: 'ts', description: '组合式函数或工具方法。' },
    { label: 'json', value: 'json', description: '配置片段。' },
  ]

  const themeOptions: RadioOption<ThemeChoice>[] = [
    { label: 'auto', value: 'auto', description: '跟随 Bing UI 的全局亮暗主题。' },
    { label: 'vitesse-light', value: 'vitesse-light' },
    { label: 'vitesse-dark', value: 'vitesse-dark' },
    { label: 'github-light', value: 'github-light' },
    { label: 'github-dark', value: 'github-dark' },
    { label: 'light-plus', value: 'light-plus' },
    { label: 'dark-plus', value: 'dark-plus' },
  ]

  const highlightOptions: RadioOption<HighlightMode>[] = [
    { label: 'none', value: 'none', description: '不强调任何行。' },
    { label: 'single', value: 'single', description: '强调一个关键行。' },
    { label: 'range', value: 'range', description: '强调一个连续区间。' },
  ]

  const playgroundLanguage = ref<LanguageChoice>('vue')

  const playgroundTheme = ref<ThemeChoice>('auto')

  const playgroundTitle = ref('usage.vue')

  const playgroundLanguageLabel = ref('Vue')

  const playgroundHighlightMode = ref<HighlightMode>('range')

  const playgroundLineNumbers = ref(true)

  const playgroundCopyable = ref(true)

  const playgroundWrap = ref(false)

  const playgroundMaxHeight = ref('360px')

  const selectedHighlightLines = ref<number[]>([6])

  const highlightRangeStart = ref<number>(12)

  const highlightRangeEnd = ref<number>(16)

  const copyLog = ref('等待复制')

  const highlightLog = ref('高亮状态正常')

  const playgroundCodeValue = computed(() => codeSamples[playgroundLanguage.value])

  const highlightRangeEndOptions = computed(() =>
    highlightLineOptions.filter(option => Number(option.value) >= highlightRangeStart.value),
  )

  const selectedHighlightEntries = computed<BingCodeBlockHighlightLine[]>(() => [
    ...selectedHighlightLines.value,
    [highlightRangeStart.value, highlightRangeEnd.value],
  ])

  const selectedHighlightLinesText = computed(
    () =>
      `[${selectedHighlightEntries.value
        .map(line => (Array.isArray(line) ? `[${line.join(', ')}]` : line))
        .join(', ')}]`,
  )

  watch(highlightRangeStart, (start) => {
    if (highlightRangeEnd.value < start) {
      highlightRangeEnd.value = start
    }
  })

  const playgroundHighlightLines = computed<BingCodeBlockHighlightLine[]>(() => {
    if (playgroundHighlightMode.value === 'single') {
      return [4]
    }

    if (playgroundHighlightMode.value === 'range') {
      return [[8, 12]]
    }

    return []
  })

  function updateLanguage(value: BingRadioValue) {
    playgroundLanguage.value = value as LanguageChoice

    if (value === 'vue') {
      playgroundTitle.value = 'usage.vue'
      playgroundLanguageLabel.value = 'Vue'
      return
    }

    if (value === 'ts') {
      playgroundTitle.value = 'status.ts'
      playgroundLanguageLabel.value = 'TypeScript'
      return
    }

    playgroundTitle.value = 'package.json'
    playgroundLanguageLabel.value = 'JSON'
  }

  function updateTheme(value: BingRadioValue) {
    playgroundTheme.value = value as ThemeChoice
  }

  function updateHighlight(value: BingRadioValue) {
    playgroundHighlightMode.value = value as HighlightMode
  }

  function handleCopy(payload: BingCodeBlockCopyPayload) {
    copyLog.value = `已复制 ${payload.language}，共 ${payload.code.length} 个字符`
  }

  function handleCopyError(error: Error) {
    copyLog.value = `复制失败：${error.message}`
  }

  function handleHighlightError(error: Error) {
    highlightLog.value = `高亮失败，已回退纯文本：${error.message}`
  }



  const playgroundUsageCode = computed(() => renderExampleCode(playgroundUsageCodeSource, { code: playgroundCodeValue.value, language: playgroundLanguage.value, theme: playgroundTheme.value, title: playgroundTitle.value, languageLabel: playgroundLanguageLabel.value, lineNumbers: playgroundLineNumbers.value, copyable: playgroundCopyable.value, wrap: playgroundWrap.value, maxHeight: playgroundMaxHeight.value, highlightLines: playgroundHighlightLines.value }))

  const scrollCode = scrollCodeSource.trim()

  const wrapUsageCode = wrapUsageCodeSource.trim()

  const resizableCode = resizableCodeSource.trim()
  return { codeSamples, longCode, highlightLineOptions, wrapCode, languageOptions, themeOptions, highlightOptions, playgroundLanguage, playgroundTheme, playgroundTitle, playgroundLanguageLabel, playgroundHighlightMode, playgroundLineNumbers, playgroundCopyable, playgroundWrap, playgroundMaxHeight, selectedHighlightLines, highlightRangeStart, highlightRangeEnd, copyLog, highlightLog, playgroundCodeValue, highlightRangeEndOptions, selectedHighlightEntries, selectedHighlightLinesText, playgroundHighlightLines, updateLanguage, updateTheme, updateHighlight, handleCopy, handleCopyError, handleHighlightError, playgroundUsageCode, scrollCode, wrapUsageCode, resizableCode }
}
const key: InjectionKey<ReturnType<typeof createExamples>> = Symbol('code-block-examples')
export function provideExamples() { provideExampleState(key, createExamples()) }
export function useExamples() {
  const state = injectExampleState(key)
  if (!state) throw new Error('示例需要文档页面提供状态')
  return state
}
