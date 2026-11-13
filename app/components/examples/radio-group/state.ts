import { computed, ref } from 'vue'
import type { BingRadioGroupDirection, BingRadioGroupOption, BingRadioGroupSize, BingRadioValue } from '@moubing/bing-ui'
import playgroundCodeSource from '~~/examples/radio-group/basic.vue?raw'
import optionsCodeSource from '~~/examples/radio-group/options.vue?raw'
import slotCodeSource from '~~/examples/radio-group/slot.vue?raw'
import keyboardCodeSource from '~~/examples/radio-group/keyboard.vue?raw'
import { renderExampleCode } from '#shared/docs/example-code'
import { inject as injectExampleState, provide as provideExampleState, type InjectionKey } from 'vue'

function createExamples() {
  type RadioOption<T extends string> = {
    label: string
    value: T
    description?: string
  }

  type GroupStatus = 'default' | 'error' | 'success' | 'warning'

  const directionOptions: RadioOption<BingRadioGroupDirection>[] = [
    { label: 'wrap', value: 'wrap', description: '默认换行排列。' },
    { label: 'row', value: 'row', description: '横向排列。' },
    { label: 'column', value: 'column', description: '纵向排列。' },
  ]

  const sizeOptions: RadioOption<BingRadioGroupSize>[] = [
    { label: 'sm', value: 'sm' },
    { label: 'md', value: 'md' },
    { label: 'lg', value: 'lg' },
  ]

  const statusOptions: RadioOption<GroupStatus>[] = [
    { label: 'default', value: 'default', description: '默认状态。' },
    { label: 'success', value: 'success', description: '成功状态。' },
    { label: 'warning', value: 'warning', description: '警告状态。' },
    { label: 'error', value: 'error', description: '错误状态。' },
  ]

  const playgroundOptions: BingRadioGroupOption[] = [
    { label: '标准模式', value: 'standard', description: '默认密度，适合常规表单。' },
    { label: '紧凑模式', value: 'compact', description: '减少垂直空间，适合工具栏。' },
    { label: '沉浸模式', value: 'immersive', description: '更适合展示型页面。' },
    { label: '实验模式', value: 'labs', description: '暂不可选。', disabled: true },
  ]

  const compactOptions: BingRadioGroupOption[] = [
    { label: '浅色', value: 'light' },
    { label: '深色', value: 'dark' },
    { label: '跟随系统', value: 'system' },
  ]

  const keyboardOptions: BingRadioGroupOption[] = [
    { label: '第一步', value: 'step-1', description: '确认基础信息。' },
    { label: '第二步', value: 'step-2', description: '此项禁用，会被方向键跳过。', disabled: true },
    { label: '第三步', value: 'step-3', description: '检查文档示例。' },
  ]

  const playgroundValue = ref<BingRadioValue | null>('standard')

  const playgroundDirection = ref<BingRadioGroupDirection>('wrap')

  const playgroundSize = ref<BingRadioGroupSize>('md')

  const playgroundStatus = ref<GroupStatus>('default')

  const playgroundDisabled = ref(false)

  const compactValue = ref<BingRadioValue | null>('system')

  const slotValue = ref<BingRadioValue | null>('api')

  const keyboardValue = ref<BingRadioValue | null>('step-1')

  const eventLog = ref('等待操作')

  const selectedLabel = computed(() => formatSelected(playgroundValue.value))

  function updateDirection(value: BingRadioValue) {
    playgroundDirection.value = value as BingRadioGroupDirection
  }

  function updateSize(value: BingRadioValue) {
    playgroundSize.value = value as BingRadioGroupSize
  }

  function updateStatus(value: BingRadioValue) {
    playgroundStatus.value = value as GroupStatus
  }

  function selectRecommended() {
    playgroundValue.value = 'standard'
  }

  function clearExternalValue() {
    playgroundValue.value = null
  }

  function handleKeyboardChange(value: BingRadioValue) {
    eventLog.value = `change：${String(value)}`
  }

  function handleKeyboardFocus() {
    eventLog.value = 'focus：焦点进入选项组'
  }

  function handleKeyboardBlur() {
    eventLog.value = 'blur：焦点离开选项组'
  }

  function formatSelected(value: BingRadioValue | null) {
    if (value === null || value === undefined || value === '') {
      return '未选择'
    }

    return String(value)
  }

  const playgroundCode = computed(() => renderExampleCode(playgroundCodeSource, { direction: playgroundDirection.value, size: playgroundSize.value, status: playgroundStatus.value, disabled: playgroundDisabled.value }))

  const optionsCode = optionsCodeSource.trim()

  const slotCode = slotCodeSource.trim()

  const keyboardCode = keyboardCodeSource.trim()
  return { directionOptions, sizeOptions, statusOptions, playgroundOptions, compactOptions, keyboardOptions, playgroundValue, playgroundDirection, playgroundSize, playgroundStatus, playgroundDisabled, compactValue, slotValue, keyboardValue, eventLog, selectedLabel, updateDirection, updateSize, updateStatus, selectRecommended, clearExternalValue, handleKeyboardChange, handleKeyboardFocus, handleKeyboardBlur, formatSelected, playgroundCode, optionsCode, slotCode, keyboardCode }
}
const key: InjectionKey<ReturnType<typeof createExamples>> = Symbol('radio-group-examples')
export function provideExamples() { provideExampleState(key, createExamples()) }
export function useExamples() {
  const state = injectExampleState(key)
  if (!state) throw new Error('示例需要文档页面提供状态')
  return state
}
