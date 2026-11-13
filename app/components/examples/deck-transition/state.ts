import { computed, ref, onActivated, onDeactivated } from 'vue'
import type { BingDeckTransitionChangePayload, BingDeckTransitionItem, BingRadioValue } from '@moubing/bing-ui'
import basicCodeSource from '~~/examples/deck-transition/basic.vue?raw'
import playgroundCodeSource from '~~/examples/deck-transition/playground.vue?raw'
import controlsCodeSource from '~~/examples/deck-transition/controls.vue?raw'
import { renderExampleCode } from '#shared/docs/example-code'
import { inject as injectExampleState, provide as provideExampleState, type InjectionKey } from 'vue'

function createExamples() {
  const examplesActive = ref(true)
  onActivated(() => { examplesActive.value = true })
  onDeactivated(() => { examplesActive.value = false })
  type PanelKey = 'plan' | 'build' | 'ship'

  type RadioOption<T extends string> = {
    label: string
    value: T
    description?: string
  }

  type DemoCard = BingDeckTransitionItem & {
    value: PanelKey
    title: string
    summary: string
    step: string
    accent: string
  }

  const cards: DemoCard[] = [
    {
      value: 'plan',
      label: '规划',
      title: '确认组件边界',
      summary: '先读源码、类型和测试，把真实行为写进文档。',
      step: '01',
      accent: '#52525b',
    },
    {
      value: 'build',
      label: '编写',
      title: '组合交互示例',
      summary: '用默认插槽承载卡片内容，让文档里的示例真正可操作。',
      step: '02',
      accent: '#71717a',
    },
    {
      value: 'ship',
      label: '验证',
      title: '验证页面与示例',
      summary: '检查类型、导出内容和交互，让示例能独立运行。',
      step: '03',
      accent: '#3f3f46',
    },
  ]

  const cardOptions: RadioOption<PanelKey>[] = cards.map((card) => ({
    label: card.label,
    value: card.value,
    description: card.title,
  }))

  const controlsActive = ref<PanelKey>('plan')

  const basicActive = ref<PanelKey>('plan')

  const playgroundActive = ref<PanelKey>('build')

  const playgroundLoop = ref(true)

  const playgroundShowControls = ref(true)

  const playgroundReducedMotion = ref(true)

  const playgroundDisabled = ref(false)

  const changeLog = ref('等待切换')

  const activeCard = computed(() => cards.find((card) => card.value === playgroundActive.value))

  function updatePlaygroundActive(value: BingRadioValue) {
    playgroundActive.value = value as PanelKey
  }

  function handleChange(payload: BingDeckTransitionChangePayload) {
    changeLog.value = `${payload.previousItem?.label ?? '无'} -> ${payload.item.label}`
  }

  const basicCode = basicCodeSource.trim()

  const playgroundCode = computed(() => renderExampleCode(playgroundCodeSource, { disabled: playgroundDisabled.value, loop: playgroundLoop.value, showControls: playgroundShowControls.value, respectReducedMotion: playgroundReducedMotion.value }))

  const controlsCode = controlsCodeSource.trim()
  return { examplesActive, cards, cardOptions, controlsActive, basicActive, playgroundActive, playgroundLoop, playgroundShowControls, playgroundReducedMotion, playgroundDisabled, changeLog, activeCard, updatePlaygroundActive, handleChange, basicCode, playgroundCode, controlsCode }
}
const key: InjectionKey<ReturnType<typeof createExamples>> = Symbol('deck-transition-examples')
export function provideExamples() { provideExampleState(key, createExamples()) }
export function useExamples() {
  const state = injectExampleState(key)
  if (!state) throw new Error('示例需要文档页面提供状态')
  return state
}
