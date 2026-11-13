import { computed, ref, watch, reactive, onActivated, onDeactivated } from 'vue'
import type { BingDatePickerChangePayload, BingDatePickerExpose, BingDatePickerModelValue, BingDatePickerSize, BingDatePickerType, BingRadioValue } from '@moubing/bing-ui'
import playgroundCodeSource from '~~/examples/date-picker/basic.vue?raw'
import typeCodeSource from '~~/examples/date-picker/singles.vue?raw'
import rangeCodeSource from '~~/examples/date-picker/ranges.vue?raw'
import disabledRulesCodeSource from '~~/examples/date-picker/rules.vue?raw'
import exposeCodeSource from '~~/examples/date-picker/methods.vue?raw'
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

  type DatePickerStatus = 'default' | 'error' | 'success' | 'warning'

  const typeOptions: RadioOption<BingDatePickerType>[] = [
    { label: 'date', value: 'date', description: '选择日期。' },
    { label: 'datetime', value: 'datetime', description: '选择日期和时间。' },
    { label: 'month', value: 'month', description: '选择月份。' },
    { label: 'year', value: 'year', description: '选择年份。' },
    { label: 'time', value: 'time', description: '只选择时间。' },
  ]

  const sizeOptions: RadioOption<BingDatePickerSize>[] = [
    { label: 'sm', value: 'sm' },
    { label: 'md', value: 'md' },
    { label: 'lg', value: 'lg' },
  ]

  const statusOptions: RadioOption<DatePickerStatus>[] = [
    { label: 'default', value: 'default', description: '默认状态。' },
    { label: 'success', value: 'success', description: '成功状态。' },
    { label: 'warning', value: 'warning', description: '警告状态。' },
    { label: 'error', value: 'error', description: '错误状态。' },
  ]

  const playgroundType = ref<BingDatePickerType>('date')

  const playgroundSize = ref<BingDatePickerSize>('md')

  const playgroundStatus = ref<DatePickerStatus>('default')

  const playgroundRange = ref(false)

  const playgroundClearable = ref(true)
  const playgroundLocale = ref('zh-CN')

  const playgroundShowShortcuts = ref(true)

  const playgroundBlock = ref(true)

  const playgroundDisabled = ref(false)

  const playgroundValue = ref<BingDatePickerModelValue>(createSampleValue('date', false))

  const eventLog = ref('等待选择')

  const singleValues = reactive<Record<string, BingDatePickerModelValue>>({"date":"2026/07/01","datetime":"2026-07-01 09:30:00","month":"2026-07","year":"2026","time":"09:30:00"})

  const rangeValues = reactive<Record<string, BingDatePickerModelValue>>({"date":["2026-07-01","2026-07-15"],"datetime":["2026-07-01 09:30:00","2026-07-15 18:00:00"],"time":["09:00:00","18:00:00"]})

  const minDate = ref('2026-07-01')

  const maxDate = ref('2026-07-31')

  const ruleDate = ref<BingDatePickerModelValue>('2026-07-08')

  const ruleTime = ref<BingDatePickerModelValue>('09:30:00')

  const exposeValue = ref<BingDatePickerModelValue>('2026-07-01')

  const exposePicker = ref<BingDatePickerExpose | null>(null)

  const exposeLog = ref('等待操作')

  watch([playgroundType, playgroundRange], ([type, range]) => {
    playgroundValue.value = createSampleValue(type, range)
    eventLog.value = '已重置为示例值'
  })

  const playgroundPlaceholder = computed(() => {
    if (playgroundRange.value) {
      return ''
    }

    if (playgroundType.value === 'datetime') {
      return '选择日期时间'
    }

    if (playgroundType.value === 'month') {
      return '选择月份'
    }

    if (playgroundType.value === 'year') {
      return '选择年份'
    }

    if (playgroundType.value === 'time') {
      return '选择时间'
    }

    return '选择日期'
  })

  const playgroundValueText = computed(() => formatModelValue(playgroundValue.value))

  function updateType(value: BingRadioValue) {
    playgroundType.value = value as BingDatePickerType
  }

  function updateSize(value: BingRadioValue) {
    playgroundSize.value = value as BingDatePickerSize
  }

  function updateStatus(value: BingRadioValue) {
    playgroundStatus.value = value as DatePickerStatus
  }

  function handlePlaygroundChange(payload: BingDatePickerChangePayload) {
    eventLog.value = `change：${formatModelValue(payload.value)}`
  }

  function handlePlaygroundConfirm(payload: BingDatePickerChangePayload) {
    eventLog.value = `confirm：${formatModelValue(payload.value)}`
  }

  function disabledDate(value: { day: () => number }) {
    const day = value.day()
    return day === 0 || day === 6
  }

  function disabledTime(_value: unknown, context: { unit: string; value: number }) {
    return context.unit === 'hour' && (context.value < 9 || context.value > 18)
  }

  function openExposePanel() {
    exposePicker.value?.openPanel()
    exposeLog.value = '已调用 openPanel()'
  }

  function focusExposeTrigger() {
    exposePicker.value?.focus()
    exposeLog.value = '已调用 focus()'
  }

  function clearExposeValue() {
    exposePicker.value?.closePanel()
    exposePicker.value?.clear()
    exposeLog.value = '已调用 clear()'
  }

  function createSampleValue(type: BingDatePickerType, range: boolean): BingDatePickerModelValue {
    const singleMap: Record<BingDatePickerType, string> = {
      date: '2026-07-01',
      datetime: '2026-07-01 09:30:00',
      month: '2026-07',
      year: '2026',
      time: '09:30:00',
    }

    const rangeMap: Record<BingDatePickerType, [string, string]> = {
      date: ['2026-07-01', '2026-07-15'],
      datetime: ['2026-07-01 09:30:00', '2026-07-15 18:00:00'],
      month: ['2026-07', '2026-09'],
      year: ['2026', '2028'],
      time: ['09:00:00', '18:00:00'],
    }

    return range ? rangeMap[type] : singleMap[type]
  }

  function formatModelValue(value: BingDatePickerModelValue) {
    if (Array.isArray(value)) {
      return `${value[0]} - ${value[1]}`
    }

    return value || '空'
  }

  const playgroundCode = computed(() => renderExampleCode(playgroundCodeSource, { type: playgroundType.value, range: playgroundRange.value, size: playgroundSize.value, status: playgroundStatus.value, placeholder: playgroundPlaceholder.value, clearable: playgroundClearable.value, showShortcuts: playgroundShowShortcuts.value, block: playgroundBlock.value, disabled: playgroundDisabled.value, locale: playgroundLocale.value }))

  const typeCode = typeCodeSource.trim()

  const rangeCode = rangeCodeSource.trim()

  const disabledRulesCode = computed(() => renderExampleCode(disabledRulesCodeSource, { min: minDate.value, max: maxDate.value }))

  const exposeCode = exposeCodeSource.trim()
  return { examplesActive, typeOptions, sizeOptions, statusOptions, playgroundType, playgroundSize, playgroundStatus, playgroundRange, playgroundClearable, playgroundLocale, playgroundShowShortcuts, playgroundBlock, playgroundDisabled, playgroundValue, eventLog, singleValues, rangeValues, minDate, maxDate, ruleDate, ruleTime, exposeValue, exposePicker, exposeLog, playgroundPlaceholder, playgroundValueText, updateType, updateSize, updateStatus, handlePlaygroundChange, handlePlaygroundConfirm, disabledDate, disabledTime, openExposePanel, focusExposeTrigger, clearExposeValue, createSampleValue, formatModelValue, playgroundCode, typeCode, rangeCode, disabledRulesCode, exposeCode }
}
const key: InjectionKey<ReturnType<typeof createExamples>> = Symbol('date-picker-examples')
export function provideExamples() { provideExampleState(key, createExamples()) }
export function useExamples() {
  const state = injectExampleState(key)
  if (!state) throw new Error('示例需要文档页面提供状态')
  return state
}
