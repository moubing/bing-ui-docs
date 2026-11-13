import { computed, reactive, ref, onActivated, onDeactivated } from 'vue'
import type { BingColorPickerChangePayload, BingColorPickerCopyPayload, BingColorPickerPresetInput, BingColorPickerSize, BingColorPickerExpose, BingRadioValue } from '@moubing/bing-ui'
import playgroundCodeSource from '~~/examples/color-picker/basic.vue?raw'
import presetsCodeSource from '~~/examples/color-picker/presets.vue?raw'
import sizesCodeSource from '~~/examples/color-picker/sizes.vue?raw'
import eventsCodeSource from '~~/examples/color-picker/events.vue?raw'
import { renderExampleCode } from '#shared/docs/example-code'
import { inject as injectExampleState, provide as provideExampleState, type InjectionKey } from 'vue'

function createExamples() {
  const examplesActive = ref(true)
  onActivated(() => { examplesActive.value = true })
  onDeactivated(() => { examplesActive.value = false })
  type RadioOption<T extends string> = {
    label: string
    value: T
    description?: string
  }

  type ColorPickerStatus = 'default' | 'error' | 'success' | 'warning'

  const sizeOptions: RadioOption<BingColorPickerSize>[] = [
    { label: 'sm', value: 'sm' },
    { label: 'md', value: 'md' },
    { label: 'lg', value: 'lg' },
  ]

  const statusOptions: RadioOption<ColorPickerStatus>[] = [
    { label: 'default', value: 'default', description: '默认状态。' },
    { label: 'success', value: 'success', description: '成功状态。' },
    { label: 'warning', value: 'warning', description: '警告状态。' },
    { label: 'error', value: 'error', description: '错误状态。' },
  ]

  const productPresets: BingColorPickerPresetInput[] = [
    { label: '冰粉', value: '#ec4899' },
    { label: '玫瑰红', value: '#f43f5e' },
    { label: '琥珀橙', value: '#f59e0b' },
    { label: '柔金', value: '#eab308' },
    { label: '青柠绿', value: '#84cc16' },
    { label: '翡翠绿', value: '#10b981' },
    { label: '青色', value: '#06b6d4' },
    { label: '天蓝', value: '#0ea5e9' },
    { label: '亮蓝', value: '#3b82f6' },
    { label: '靛蓝', value: '#6366f1' },
    { label: '紫罗兰', value: '#8b5cf6' },
    { label: '品红', value: '#d946ef' },
    { label: '蓝灰', value: '#334155' },
    { label: '石墨黑', value: '#111827' },
    { label: '瓷白', value: '#f8fafc' },
    { label: '浅粉', value: '#fdf2f8' },
  ]

  const neutralPresets: BingColorPickerPresetInput[] = [
    '#111827',
    '#334155',
    '#64748b',
    '#94a3b8',
    '#cbd5e1',
    '#f8fafc',
    '#ffffff',
    '#ec4899',
  ]

  const playground = reactive({
    size: 'md' as BingColorPickerSize,
    status: 'default' as ColorPickerStatus,
    block: true,
    glass: true,
    disabled: false,
    minWidth: '180',
    panelWidth: '320',
  })

  const colorValue = ref('#ec4899')

  const presetValue = ref('#0ea5e9')

  const smallValue = ref('#f43f5e')

  const mediumValue = ref('#10b981')

  const largeValue = ref('#6366f1')

  const eventPicker = ref<BingColorPickerExpose | null>(null)

  const eventValue = ref('#8b5cf6')

  const eventLog = ref('等待操作')

  function updateSize(value: BingRadioValue) {
    playground.size = value as BingColorPickerSize
  }

  function updateStatus(value: BingRadioValue) {
    playground.status = value as ColorPickerStatus
  }

  function toNumberText(value: string) {
    const numericValue = Number(value)

    return Number.isFinite(numericValue) ? numericValue : 0
  }

  function handleChange(payload: BingColorPickerChangePayload) {
    eventValue.value = payload.rgba
    eventLog.value = `change(${payload.source})：${payload.rgba}`
  }

  function handleCopy(payload: BingColorPickerCopyPayload) {
    eventLog.value = `copy(${payload.format})：${payload.value}`
  }

  function handleCopyError(error: Error) {
    eventLog.value = `copyError：${error.message}`
  }

  function handleOpen() {
    eventLog.value = 'open：面板已打开'
  }

  function handleClose() {
    eventLog.value = 'close：面板已关闭'
  }

  const playgroundCode = computed(() => renderExampleCode(playgroundCodeSource, { size: playground.size, status: playground.status, block: playground.block, glass: playground.glass, disabled: playground.disabled, minWidth: toNumberText(playground.minWidth), panelWidth: toNumberText(playground.panelWidth) }))

  const presetsCode = presetsCodeSource.trim()

  const sizesCode = sizesCodeSource.trim()

  const eventsCode = eventsCodeSource.trim()
  return { examplesActive, sizeOptions, statusOptions, productPresets, neutralPresets, playground, colorValue, presetValue, smallValue, mediumValue, largeValue, eventPicker, eventValue, eventLog, updateSize, updateStatus, toNumberText, handleChange, handleCopy, handleCopyError, handleOpen, handleClose, playgroundCode, presetsCode, sizesCode, eventsCode }
}
const key: InjectionKey<ReturnType<typeof createExamples>> = Symbol('color-picker-examples')
export function provideExamples() { provideExampleState(key, createExamples()) }
export function useExamples() {
  const state = injectExampleState(key)
  if (!state) throw new Error('示例需要文档页面提供状态')
  return state
}
