import { computed, onActivated, onDeactivated, ref } from 'vue'
import type { BingRadioValue, BingTooltipAlign, BingTooltipCloseReason, BingTooltipExpose, BingTooltipOpenReason, BingTooltipPlacement, BingTooltipTrigger } from '@moubing/bing-ui'
import playgroundCodeSource from '~~/examples/tooltip/basic.vue?raw'
import richContentCodeSource from '~~/examples/tooltip/rich.vue?raw'
import placementCodeSource from '~~/examples/tooltip/placement.vue?raw'
import manualCodeSource from '~~/examples/tooltip/manual.vue?raw'
import { renderExampleCode } from '#shared/docs/example-code'
import { inject as injectExampleState, provide as provideExampleState, type InjectionKey } from 'vue'

function createExamples() {
  type RadioOption<T extends string> = {
    label: string
    value: T
    description?: string
  }

  const triggerOptions: RadioOption<BingTooltipTrigger>[] = [
    { label: 'hover', value: 'hover', description: '鼠标悬停或键盘聚焦时打开。' },
    { label: 'click', value: 'click', description: '点击锚点切换显示状态。' },
    { label: 'manual', value: 'manual', description: '只通过 v-model 或 expose 方法控制。' },
  ]

  const placementOptions: RadioOption<BingTooltipPlacement>[] = [
    { label: 'top', value: 'top' },
    { label: 'right', value: 'right' },
    { label: 'bottom', value: 'bottom' },
    { label: 'left', value: 'left' },
  ]

  const alignOptions: RadioOption<BingTooltipAlign>[] = [
    { label: 'start', value: 'start' },
    { label: 'center', value: 'center' },
    { label: 'end', value: 'end' },
  ]

  const placementItems: Array<{ placement: BingTooltipPlacement; label: string; content: string }> = [
    { placement: 'top', label: '上方', content: 'placement="top" 会优先显示在锚点上方。' },
    { placement: 'right', label: '右侧', content: 'placement="right" 适合解释图标按钮。' },
    { placement: 'bottom', label: '下方', content: 'placement="bottom" 常用于表单控件说明。' },
    { placement: 'left', label: '左侧', content: 'placement="left" 会贴近锚点左侧。' },
  ]

  const playgroundRef = ref<BingTooltipExpose | null>(null)

  const manualTooltip = ref<BingTooltipExpose | null>(null)

  const playgroundOpen = ref(false)

  const manualOpen = ref(false)
  const examplesActive = ref(true)
  onActivated(() => { examplesActive.value = true })
  onDeactivated(() => { examplesActive.value = false; playgroundOpen.value = false; manualOpen.value = false })

  const richActionCount = ref(0)

  const playgroundContent = ref('斜体')

  const playgroundTrigger = ref<BingTooltipTrigger>('click')

  const playgroundPlacement = ref<BingTooltipPlacement>('top')

  const playgroundAlign = ref<BingTooltipAlign>('center')

  const playgroundOpenDelay = ref('0')

  const playgroundCloseDelay = ref('80')

  const playgroundOffset = ref('10')

  const playgroundMaxWidth = ref('280')

  const playgroundInteractive = ref(true)

  const playgroundDisabled = ref(false)

  const playgroundCloseOnOutside = ref(true)

  const playgroundCloseOnEsc = ref(true)

  const lastOpenReason = ref<BingTooltipOpenReason | '未打开'>('未打开')

  const lastCloseReason = ref<BingTooltipCloseReason | '未关闭'>('未关闭')

  const manualEventLog = ref('等待手动控制')

  const normalizedOpenDelay = computed(() => toNonNegativeNumber(playgroundOpenDelay.value, 0))

  const normalizedCloseDelay = computed(() => toNonNegativeNumber(playgroundCloseDelay.value, 80))

  const normalizedOffset = computed(() => toNonNegativeNumber(playgroundOffset.value, 10))

  const normalizedMaxWidth = computed(() => toNonNegativeNumber(playgroundMaxWidth.value, 280))

  function updateTrigger(value: BingRadioValue) {
    playgroundTrigger.value = value as BingTooltipTrigger
    if (value === 'manual') playgroundCloseOnOutside.value = false
  }

  function updatePlacement(value: BingRadioValue) {
    playgroundPlacement.value = value as BingTooltipPlacement
  }

  function updateAlign(value: BingRadioValue) {
    playgroundAlign.value = value as BingTooltipAlign
  }

  function handlePlaygroundOpen(reason: BingTooltipOpenReason) {
    lastOpenReason.value = reason
  }

  function handlePlaygroundClose(reason: BingTooltipCloseReason) {
    lastCloseReason.value = reason
  }

  function togglePlaygroundTooltip() {
    playgroundRef.value?.toggle('manual')
  }

  function showManualTooltip() {
    manualTooltip.value?.show('manual')
  }

  function hideManualTooltip() {
    manualTooltip.value?.hide('manual')
  }

  function toggleManualTooltip() {
    manualTooltip.value?.toggle('manual')
  }

  function handleManualOpen(reason: BingTooltipOpenReason) {
    manualEventLog.value = `打开来源：${reason}`
  }

  function handleManualClose(reason: BingTooltipCloseReason) {
    manualEventLog.value = `关闭来源：${reason}`
  }

  function toNonNegativeNumber(value: string, fallback: number) {
    const parsed = Number(value)

    if (!Number.isFinite(parsed)) {
      return fallback
    }

    return Math.max(0, parsed)
  }

  const playgroundCode = computed(() => renderExampleCode(playgroundCodeSource, { content: playgroundContent.value, trigger: playgroundTrigger.value, placement: playgroundPlacement.value, align: playgroundAlign.value, openDelay: normalizedOpenDelay.value, closeDelay: normalizedCloseDelay.value, offset: normalizedOffset.value, maxWidth: normalizedMaxWidth.value, interactive: playgroundInteractive.value, disabled: playgroundDisabled.value, closeOnOutside: playgroundCloseOnOutside.value, closeOnEsc: playgroundCloseOnEsc.value }))

  const richContentCode = richContentCodeSource.trim()

  const placementCode = placementCodeSource.trim()

  const manualCode = manualCodeSource.trim()
  return { examplesActive, triggerOptions, placementOptions, alignOptions, placementItems, playgroundRef, manualTooltip, playgroundOpen, manualOpen, richActionCount, playgroundContent, playgroundTrigger, playgroundPlacement, playgroundAlign, playgroundOpenDelay, playgroundCloseDelay, playgroundOffset, playgroundMaxWidth, playgroundInteractive, playgroundDisabled, playgroundCloseOnOutside, playgroundCloseOnEsc, lastOpenReason, lastCloseReason, manualEventLog, normalizedOpenDelay, normalizedCloseDelay, normalizedOffset, normalizedMaxWidth, updateTrigger, updatePlacement, updateAlign, handlePlaygroundOpen, handlePlaygroundClose, togglePlaygroundTooltip, showManualTooltip, hideManualTooltip, toggleManualTooltip, handleManualOpen, handleManualClose, toNonNegativeNumber, playgroundCode, richContentCode, placementCode, manualCode }
}
const key: InjectionKey<ReturnType<typeof createExamples>> = Symbol('tooltip-examples')
export function provideExamples() { provideExampleState(key, createExamples()) }
export function useExamples() {
  const state = injectExampleState(key)
  if (!state) throw new Error('示例需要文档页面提供状态')
  return state
}
