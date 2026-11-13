import { computed, ref } from 'vue'
import type { BingRadioSize, BingRadioValue } from '@moubing/bing-ui'
import playgroundCodeSource from '~~/examples/radio/basic.vue?raw'
import statesCodeSource from '~~/examples/radio/states.vue?raw'
import groupCodeSource from '~~/examples/radio/group.vue?raw'
import eventsCodeSource from '~~/examples/radio/events.vue?raw'
import { renderExampleCode } from '#shared/docs/example-code'
import { inject as injectExampleState, provide as provideExampleState, type InjectionKey } from 'vue'

function createExamples() {
  type RadioOption<T extends string> = {
    label: string
    value: T
    description?: string
  }

  type RadioStatus = 'default' | 'error' | 'success' | 'warning'

  const sizeOptions: RadioOption<BingRadioSize>[] = [
    { label: 'sm', value: 'sm' },
    { label: 'md', value: 'md' },
    { label: 'lg', value: 'lg' },
  ]

  const statusOptions: RadioOption<RadioStatus>[] = [
    { label: 'default', value: 'default', description: '默认状态。' },
    { label: 'success', value: 'success', description: '成功状态。' },
    { label: 'warning', value: 'warning', description: '警告状态。' },
    { label: 'error', value: 'error', description: '错误状态。' },
  ]

  const playgroundModel = ref<BingRadioValue>('docs')

  const playgroundValue = ref('docs')

  const playgroundLabel = ref('文档模式')

  const playgroundDescription = ref('为组件文档保留完整说明和示例。')

  const playgroundSize = ref<BingRadioSize>('md')

  const playgroundStatus = ref<RadioStatus>('default')

  const playgroundDisabled = ref(false)

  const stateModel = ref<BingRadioValue>('md')

  const groupModel = ref<BingRadioValue>('compact')

  const eventModel = ref<BingRadioValue>('none')

  const eventLog = ref('等待操作')

  const playgroundChecked = computed(() => playgroundModel.value === playgroundValue.value)

  function updateSize(value: BingRadioValue) {
    playgroundSize.value = value as BingRadioSize
  }

  function updateStatus(value: BingRadioValue) {
    playgroundStatus.value = value as RadioStatus
  }

  function handleChange(value: BingRadioValue) {
    eventLog.value = `change：已选中 ${String(value)}`
  }

  function handleFocus() {
    eventLog.value = 'focus：获得焦点'
  }

  function handleBlur() {
    eventLog.value = 'blur：失去焦点'
  }

  function resetEventRadio() {
    eventModel.value = 'none'
    eventLog.value = '已重置'
  }

  const playgroundCode = computed(() => renderExampleCode(playgroundCodeSource, { value: playgroundValue.value, label: playgroundLabel.value, description: playgroundDescription.value, size: playgroundSize.value, status: playgroundStatus.value, disabled: playgroundDisabled.value }))

  const statesCode = statesCodeSource.trim()

  const groupCode = groupCodeSource.trim()

  const eventsCode = eventsCodeSource.trim()
  return { sizeOptions, statusOptions, playgroundModel, playgroundValue, playgroundLabel, playgroundDescription, playgroundSize, playgroundStatus, playgroundDisabled, stateModel, groupModel, eventModel, eventLog, playgroundChecked, updateSize, updateStatus, handleChange, handleFocus, handleBlur, resetEventRadio, playgroundCode, statesCode, groupCode, eventsCode }
}
const key: InjectionKey<ReturnType<typeof createExamples>> = Symbol('radio-examples')
export function provideExamples() { provideExampleState(key, createExamples()) }
export function useExamples() {
  const state = injectExampleState(key)
  if (!state) throw new Error('示例需要文档页面提供状态')
  return state
}
