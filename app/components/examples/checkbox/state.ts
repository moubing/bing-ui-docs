import { computed, ref } from 'vue'
import type { BingCheckboxShape, BingCheckboxSize, BingCheckboxTone, BingRadioValue } from '@moubing/bing-ui'
import playgroundCodeSource from '~~/examples/checkbox/basic.vue?raw'
import statesCodeSource from '~~/examples/checkbox/states.vue?raw'
import sizesCodeSource from '~~/examples/checkbox/sizes.vue?raw'
import decorativeCodeSource from '~~/examples/checkbox/decorative.vue?raw'
import eventsCodeSource from '~~/examples/checkbox/events.vue?raw'
import { renderExampleCode } from '#shared/docs/example-code'
import { inject as injectExampleState, provide as provideExampleState, type InjectionKey } from 'vue'

function createExamples() {
  type RadioOption<T extends string> = {
    label: string
    value: T
    description?: string
  }

  type CheckboxStatus = 'default' | 'error' | 'success' | 'warning'

  type CheckboxSizeName = Extract<BingCheckboxSize, string>

  const sizeOptions: RadioOption<CheckboxSizeName>[] = [
    { label: 'sm', value: 'sm' },
    { label: 'md', value: 'md' },
    { label: 'lg', value: 'lg' },
  ]

  const shapeOptions: RadioOption<BingCheckboxShape>[] = [
    { label: 'rounded', value: 'rounded', description: '默认圆角方形。' },
    { label: 'circle', value: 'circle', description: '圆形选择控件。' },
  ]

  const toneOptions: RadioOption<BingCheckboxTone>[] = [
    { label: 'primary', value: 'primary', description: '主色强调。' },
    { label: 'secondary', value: 'secondary', description: '辅助色强调。' },
  ]

  const statusOptions: RadioOption<CheckboxStatus>[] = [
    { label: 'default', value: 'default', description: '默认状态。' },
    { label: 'success', value: 'success', description: '成功状态。' },
    { label: 'warning', value: 'warning', description: '警告状态。' },
    { label: 'error', value: 'error', description: '错误状态。' },
  ]

  const playgroundValue = ref(false)

  const playgroundLabel = ref('启用动效反馈')

  const playgroundSize = ref<CheckboxSizeName>('md')

  const playgroundShape = ref<BingCheckboxShape>('rounded')

  const playgroundTone = ref<BingCheckboxTone>('primary')

  const playgroundStatus = ref<CheckboxStatus>('default')

  const playgroundIndeterminate = ref(false)

  const playgroundDisabled = ref(false)

  const baseChecked = ref(true)

  const indeterminateChecked = ref(false)

  const circleChecked = ref(true)

  const smallSizeChecked = ref(false)

  const mediumSizeChecked = ref(false)

  const largeSizeChecked = ref(false)

  const customSizeChecked = ref(true)

  const eventChecked = ref(false)

  const eventLog = ref('等待操作')

  function updateSize(value: BingRadioValue) {
    playgroundSize.value = value as CheckboxSizeName
  }

  function updateShape(value: BingRadioValue) {
    playgroundShape.value = value as BingCheckboxShape
  }

  function updateTone(value: BingRadioValue) {
    playgroundTone.value = value as BingCheckboxTone
  }

  function updateStatus(value: BingRadioValue) {
    playgroundStatus.value = value as CheckboxStatus
  }

  function handleChange(value: boolean) {
    eventLog.value = `change：${value ? '已选中' : '未选中'}`
  }

  function handleFocus() {
    eventLog.value = 'focus：获得焦点'
  }

  function handleBlur() {
    eventLog.value = 'blur：失去焦点'
  }


  const playgroundCode = computed(() => renderExampleCode(playgroundCodeSource, { label: playgroundLabel.value, size: playgroundSize.value, shape: playgroundShape.value, tone: playgroundTone.value, status: playgroundStatus.value, indeterminate: playgroundIndeterminate.value, disabled: playgroundDisabled.value }))

  const statesCode = statesCodeSource.trim()

  const sizesCode = sizesCodeSource.trim()

  const decorativeCode = decorativeCodeSource.trim()

  const eventsCode = eventsCodeSource.trim()
  return { sizeOptions, shapeOptions, toneOptions, statusOptions, playgroundValue, playgroundLabel, playgroundSize, playgroundShape, playgroundTone, playgroundStatus, playgroundIndeterminate, playgroundDisabled, baseChecked, indeterminateChecked, circleChecked, smallSizeChecked, mediumSizeChecked, largeSizeChecked, customSizeChecked, eventChecked, eventLog, updateSize, updateShape, updateTone, updateStatus, handleChange, handleFocus, handleBlur, playgroundCode, statesCode, sizesCode, decorativeCode, eventsCode }
}
const key: InjectionKey<ReturnType<typeof createExamples>> = Symbol('checkbox-examples')
export function provideExamples() { provideExampleState(key, createExamples()) }
export function useExamples() {
  const state = injectExampleState(key)
  if (!state) throw new Error('示例需要文档页面提供状态')
  return state
}
