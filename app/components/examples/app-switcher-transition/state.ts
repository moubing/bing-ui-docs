import { computed, reactive, ref, onActivated, onDeactivated } from 'vue'
import type { BingAppSwitcherTransitionChangePayload, BingAppSwitcherTransitionItem, BingRadioValue, BingTabValue } from '@moubing/bing-ui'
import basicCodeSource from '~~/examples/app-switcher-transition/basic.vue?raw'
import playgroundCodeSource from '~~/examples/app-switcher-transition/controls.vue?raw'
import slotCodeSource from '~~/examples/app-switcher-transition/slots.vue?raw'
import { renderExampleCode } from '#shared/docs/example-code'
import { inject as injectExampleState, provide as provideExampleState, type InjectionKey } from 'vue'

function createExamples() {
  const examplesActive = ref(true)
  onActivated(() => { examplesActive.value = true })
  onDeactivated(() => { examplesActive.value = false })
  type PanelKey = 'overview' | 'workflow' | 'metrics'

  type RadioOption<T extends string> = {
    label: string
    value: T
    description?: string
  }

  type DemoPanel = BingAppSwitcherTransitionItem & {
    value: PanelKey
    title: string
    summary: string
    metric: string
    accent: string
  }

  const panels: DemoPanel[] = [
    {
      value: 'overview',
      label: '总览',
      title: '工作台总览',
      summary: '把当前模块的关键状态压缩成一个可快速阅读的卡片。',
      metric: '24',
      accent: '#52525b',
    },
    {
      value: 'workflow',
      label: '流程',
      title: '流程推进',
      summary: '用于展示从一个应用状态切换到另一个状态时的空间关系。',
      metric: '07',
      accent: '#71717a',
    },
    {
      value: 'metrics',
      label: '指标',
      title: '指标追踪',
      summary: '适合承载带有数据、摘要和下一步操作的复杂面板。',
      metric: '91%',
      accent: '#3f3f46',
    },
  ]

  const panelOptions: RadioOption<PanelKey>[] = panels.map((panel) => ({
    label: panel.label,
    value: panel.value,
    description: panel.title,
  }))

  const slotActive = ref<BingTabValue>('overview')

  const counts = reactive<Record<string, number>>({})

  function increment(value: BingTabValue) { const key = String(value); counts[key] = (counts[key] ?? 0) + 1 }

  const basicActive = ref<PanelKey>('overview')

  const playgroundActive = ref<PanelKey>('workflow')

  const playgroundDisabled = ref(false)

  const playgroundLoop = ref(true)

  const playgroundShowTabs = ref(true)

  const playgroundRespectReducedMotion = ref(true)

  const changeLog = ref('等待切换')

  const selectedPanel = computed(() => panels.find((panel) => panel.value === playgroundActive.value))

  function updatePlaygroundActive(value: BingRadioValue) {
    playgroundActive.value = value as PanelKey
  }

  function handleChange(payload: BingAppSwitcherTransitionChangePayload) {
    changeLog.value = `${payload.previousItem?.label ?? '无'} -> ${payload.item.label}`
  }

  const basicCode = basicCodeSource.trim()

  const playgroundCode = computed(() => renderExampleCode(playgroundCodeSource, { disabled: playgroundDisabled.value, loop: playgroundLoop.value, showTabs: playgroundShowTabs.value, respectReducedMotion: playgroundRespectReducedMotion.value }))

  const slotCode = slotCodeSource.trim()
  return { examplesActive, panels, panelOptions, slotActive, counts, increment, basicActive, playgroundActive, playgroundDisabled, playgroundLoop, playgroundShowTabs, playgroundRespectReducedMotion, changeLog, selectedPanel, updatePlaygroundActive, handleChange, basicCode, playgroundCode, slotCode }
}
const key: InjectionKey<ReturnType<typeof createExamples>> = Symbol('app-switcher-transition-examples')
export function provideExamples() { provideExampleState(key, createExamples()) }
export function useExamples() {
  const state = injectExampleState(key)
  if (!state) throw new Error('示例需要文档页面提供状态')
  return state
}
