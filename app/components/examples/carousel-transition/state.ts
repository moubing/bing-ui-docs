import { computed, ref, reactive, onActivated, onDeactivated } from 'vue'
import type { BingCarouselTransitionChangePayload, BingCarouselTransitionItem, BingRadioValue, BingTabValue } from '@moubing/bing-ui'
import basicCodeSource from '~~/examples/carousel-transition/basic.vue?raw'
import playgroundCodeSource from '~~/examples/carousel-transition/controls.vue?raw'
import wheelCodeSource from '~~/examples/carousel-transition/wheel.vue?raw'
import { renderExampleCode } from '#shared/docs/example-code'
import { inject as injectExampleState, provide as provideExampleState, type InjectionKey } from 'vue'

function createExamples() {
  const examplesActive = ref(true)
  onActivated(() => { examplesActive.value = true })
  onDeactivated(() => { examplesActive.value = false })
  type PanelKey = 'snapshot' | 'activity' | 'insight'

  type RadioOption<T extends string> = {
    label: string
    value: T
    description?: string
  }

  type DemoPanel = BingCarouselTransitionItem & {
    value: PanelKey
    title: string
    summary: string
    badge: string
    accent: string
  }

  const panels: DemoPanel[] = [
    {
      value: 'snapshot',
      label: '概览',
      title: '当前状态快照',
      summary: '用一张固定宽度的面板承载当前模块最重要的概览信息。',
      badge: 'Now',
      accent: '#52525b',
    },
    {
      value: 'activity',
      label: '动态',
      title: '最近活动',
      summary: '横向滑动可以保留前后面板的空间方向，适合连续内容。',
      badge: '12',
      accent: '#71717a',
    },
    {
      value: 'insight',
      label: '洞察',
      title: '下一步洞察',
      summary: '默认插槽可以渲染任意业务内容，而不是只展示纯文本。',
      badge: 'AI',
      accent: '#3f3f46',
    },
  ]

  const panelOptions: RadioOption<PanelKey>[] = panels.map((panel) => ({
    label: panel.label,
    value: panel.value,
    description: panel.title,
  }))

  const wheelActive = ref<PanelKey>('snapshot')

  const counts = reactive<Record<string, number>>({})

  function increment(value: BingTabValue) { const key = String(value); counts[key] = (counts[key] ?? 0) + 1 }

  const basicActive = ref<PanelKey>('snapshot')

  const playgroundActive = ref<PanelKey>('activity')

  const playgroundDisabled = ref(false)

  const playgroundLoop = ref(true)

  const playgroundShowTabs = ref(true)

  const playgroundRespectReducedMotion = ref(true)

  const changeLog = ref('等待切换')

  const selectedPanel = computed(() => panels.find((panel) => panel.value === playgroundActive.value))

  function updatePlaygroundActive(value: BingRadioValue) {
    playgroundActive.value = value as PanelKey
  }

  function handleChange(payload: BingCarouselTransitionChangePayload) {
    changeLog.value = `${payload.previousItem?.label ?? '无'} -> ${payload.item.label}`
  }

  const basicCode = basicCodeSource.trim()

  const playgroundCode = computed(() => renderExampleCode(playgroundCodeSource, { disabled: playgroundDisabled.value, loop: playgroundLoop.value, showTabs: playgroundShowTabs.value, respectReducedMotion: playgroundRespectReducedMotion.value }))

  const wheelCode = wheelCodeSource.trim()
  return { examplesActive, panels, panelOptions, wheelActive, counts, increment, basicActive, playgroundActive, playgroundDisabled, playgroundLoop, playgroundShowTabs, playgroundRespectReducedMotion, changeLog, selectedPanel, updatePlaygroundActive, handleChange, basicCode, playgroundCode, wheelCode }
}
const key: InjectionKey<ReturnType<typeof createExamples>> = Symbol('carousel-transition-examples')
export function provideExamples() { provideExampleState(key, createExamples()) }
export function useExamples() {
  const state = injectExampleState(key)
  if (!state) throw new Error('示例需要文档页面提供状态')
  return state
}
