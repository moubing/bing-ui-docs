import { computed, ref } from 'vue'
import type { BingRadioValue, BingResizableDirection, BingResizableExpose, BingResizableMode, BingResizablePayload, BingResizableProps } from '@moubing/bing-ui'
import playgroundCodeSource from '~~/examples/resizable/basic.vue?raw'
import modesCodeSource from '~~/examples/resizable/modes.vue?raw'
import constraintCodeSource from '~~/examples/resizable/constraints.vue?raw'
import exposeCodeSource from '~~/examples/resizable/methods.vue?raw'
import { renderExampleCode } from '#shared/docs/example-code'
import { inject as injectExampleState, provide as provideExampleState, type InjectionKey } from 'vue'

function createExamples() {
  type BingResizableSnapMode = NonNullable<BingResizableProps['snapMode']>
  type RadioOption<T extends string> = {
    label: string
    value: T
    description?: string
  }

  const allDirections: BingResizableDirection[] = [
    'top',
    'right',
    'bottom',
    'left',
    'top-left',
    'top-right',
    'bottom-left',
    'bottom-right',
  ]

  const defaultDirections: BingResizableDirection[] = ['right', 'bottom', 'bottom-right']

  const modeOptions: RadioOption<BingResizableMode>[] = [
    { label: 'fixed', value: 'fixed', description: '固定对边，只移动被拖拽方向相关的边。' },
    { label: 'mirror', value: 'mirror', description: '围绕中心对称缩放，位置会同步变化。' },
  ]

  const snapOptions: RadioOption<BingResizableSnapMode>[] = [
    { label: 'live', value: 'live', description: '拖拽过程中实时吸附 step。' },
    { label: 'end', value: 'end', description: '拖拽过程保持流畅，松手时吸附 step。' },
  ]

  const playgroundMode = ref<BingResizableMode>('fixed')

  const playgroundSnapMode = ref<BingResizableSnapMode>('live')

  const playgroundWidth = ref('320')

  const playgroundHeight = ref('200')

  const playgroundMinWidth = ref('180')

  const playgroundMinHeight = ref('120')

  const playgroundMaxWidth = ref('620')

  const playgroundMaxHeight = ref('320')

  const playgroundStep = ref('8')

  const playgroundUseAllHandles = ref(false)

  const playgroundDisabled = ref(false)

  const playgroundLockRatio = ref(false)

  const playgroundContain = ref(true)

  const playgroundShowSize = ref(true)

  const eventLog = ref('等待拖拽')

  const apiResizableRef = ref<BingResizableExpose | null>(null)

  const apiSize = ref('尚未读取')

  const playgroundDirections = computed(() =>
    playgroundUseAllHandles.value ? allDirections : defaultDirections,
  )

  const playgroundDefaultSize = computed(() => ({
    width: normalizeNumber(playgroundWidth.value, 320),
    height: normalizeNumber(playgroundHeight.value, 200),
  }))

  function updateMode(value: BingRadioValue) {
    playgroundMode.value = value as BingResizableMode
  }

  function updateSnapMode(value: BingRadioValue) {
    playgroundSnapMode.value = value as BingResizableSnapMode
  }

  function handleResizeStart(payload: BingResizablePayload) {
    eventLog.value = `开始：${payload.direction}`
  }

  function handleResize(payload: BingResizablePayload) {
    eventLog.value = `调整中：${Math.round(payload.size.width)} x ${Math.round(payload.size.height)} / x ${Math.round(payload.position.x)}, y ${Math.round(payload.position.y)}`
  }

  function handleResizeEnd(payload: BingResizablePayload) {
    eventLog.value = `结束：${payload.direction} / ${Math.round(payload.size.width)} x ${Math.round(payload.size.height)}`
  }

  function resetApiPanel() {
    apiResizableRef.value?.reset()
    apiSize.value = '已重置'
  }

  function readApiPanel() {
    const size = apiResizableRef.value?.getSize()
    const position = apiResizableRef.value?.getPosition()

    if (!size || !position) {
      apiSize.value = '尚未挂载'
      return
    }

    apiSize.value = `${Math.round(size.width)} x ${Math.round(size.height)} / x ${Math.round(position.x)}, y ${Math.round(position.y)}`
  }

  function normalizeNumber(value: string, fallback: number) {
    const nextValue = Number(value)

    return Number.isFinite(nextValue) ? nextValue : fallback
  }

  function directionsLiteral(directions: BingResizableDirection[]) {
    return `[${directions.map((direction) => `'${direction}'`).join(', ')}]`
  }

  const playgroundCode = computed(() => renderExampleCode(playgroundCodeSource, { defaultSize: playgroundDefaultSize.value, minWidth: normalizeNumber(playgroundMinWidth.value, 180), minHeight: normalizeNumber(playgroundMinHeight.value, 120), maxWidth: normalizeNumber(playgroundMaxWidth.value, 620), maxHeight: normalizeNumber(playgroundMaxHeight.value, 320), mode: playgroundMode.value, snapMode: playgroundSnapMode.value, directions: playgroundDirections.value, step: normalizeNumber(playgroundStep.value, 8), disabled: playgroundDisabled.value, lockAspectRatio: playgroundLockRatio.value, contain: playgroundContain.value, showSize: playgroundShowSize.value }))

  const modesCode = modesCodeSource.trim()

  const constraintCode = constraintCodeSource.trim()

  const exposeCode = exposeCodeSource.trim()
  return { allDirections, defaultDirections, modeOptions, snapOptions, playgroundMode, playgroundSnapMode, playgroundWidth, playgroundHeight, playgroundMinWidth, playgroundMinHeight, playgroundMaxWidth, playgroundMaxHeight, playgroundStep, playgroundUseAllHandles, playgroundDisabled, playgroundLockRatio, playgroundContain, playgroundShowSize, eventLog, apiResizableRef, apiSize, playgroundDirections, playgroundDefaultSize, updateMode, updateSnapMode, handleResizeStart, handleResize, handleResizeEnd, resetApiPanel, readApiPanel, normalizeNumber, directionsLiteral, playgroundCode, modesCode, constraintCode, exposeCode }
}
const key: InjectionKey<ReturnType<typeof createExamples>> = Symbol('resizable-examples')
export function provideExamples() { provideExampleState(key, createExamples()) }
export function useExamples() {
  const state = injectExampleState(key)
  if (!state) throw new Error('示例需要文档页面提供状态')
  return state
}
