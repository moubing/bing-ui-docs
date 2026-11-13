import { computed, ref } from 'vue'
import type { BingCheckboxGroupDirection, BingCheckboxGroupOption, BingCheckboxGroupSize, BingCheckboxGroupValue, BingRadioValue } from '@moubing/bing-ui'
import playgroundCodeSource from '~~/examples/checkbox-group/basic.vue?raw'
import optionsCodeSource from '~~/examples/checkbox-group/options.vue?raw'
import slotCodeSource from '~~/examples/checkbox-group/slot.vue?raw'
import eventsCodeSource from '~~/examples/checkbox-group/events.vue?raw'
import statusCodeSource from '~~/examples/checkbox-group/status.vue?raw'
import { renderExampleCode } from '#shared/docs/example-code'
import { inject as injectExampleState, provide as provideExampleState, type InjectionKey } from 'vue'

function createExamples() {
  type RadioOption<T extends string> = {
    label: string
    value: T
    description?: string
  }

  type GroupStatus = 'default' | 'error' | 'success' | 'warning'

  const directionOptions: RadioOption<BingCheckboxGroupDirection>[] = [
    { label: 'wrap', value: 'wrap', description: '默认换行排列，适合选项数量不固定的场景。' },
    { label: 'row', value: 'row', description: '单行排列，适合短选项。' },
    { label: 'column', value: 'column', description: '纵向排列，适合带描述的选项。' },
  ]

  const sizeOptions: RadioOption<BingCheckboxGroupSize>[] = [
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

  const playgroundOptions: BingCheckboxGroupOption[] = [
    { label: '键盘导航', value: 'keyboard', description: '支持 Tab、Space 与焦点反馈。' },
    { label: '动效反馈', value: 'motion', description: '开启悬浮、点击和选中动效。' },
    { label: '批量操作', value: 'batch', description: '允许一次选择多个操作对象。' },
    { label: '实验功能', value: 'labs', description: '暂时不可选。', disabled: true },
  ]

  const compactOptions: BingCheckboxGroupOption[] = [
    { label: '文档', value: 'docs' },
    { label: '示例', value: 'demo' },
    { label: '类型', value: 'types' },
  ]

  const statusOptionsPreview: BingCheckboxGroupOption[] = [
    { label: '代码生成', value: 'code' },
    { label: '视觉回归', value: 'visual' },
    { label: '自动发布', value: 'release' },
  ]

  const playgroundValue = ref<BingCheckboxGroupValue[]>(['keyboard', 'motion'])

  const playgroundDirection = ref<BingCheckboxGroupDirection>('wrap')

  const playgroundSize = ref<BingCheckboxGroupSize>('md')

  const playgroundStatus = ref<GroupStatus>('default')

  const playgroundDisabled = ref(false)

  const compactValue = ref<BingCheckboxGroupValue[]>(['docs'])

  const slotValue = ref<BingCheckboxGroupValue[]>(['design'])

  const statusValue = ref<BingCheckboxGroupValue[]>(['code'])

  const eventValue = ref<BingCheckboxGroupValue[]>(['email'])

  const eventLog = ref('等待操作')

  const selectedLabel = computed(() => formatSelected(playgroundValue.value))

  function updateDirection(value: BingRadioValue) {
    playgroundDirection.value = value as BingCheckboxGroupDirection
  }

  function updateSize(value: BingRadioValue) {
    playgroundSize.value = value as BingCheckboxGroupSize
  }

  function updateStatus(value: BingRadioValue) {
    playgroundStatus.value = value as GroupStatus
  }

  function selectAllPlayground() {
    playgroundValue.value = playgroundOptions
      .filter((option) => !option.disabled)
      .map((option) => option.value)
  }

  function clearPlayground() {
    playgroundValue.value = []
  }

  function handleGroupChange(value: BingCheckboxGroupValue[]) {
    eventLog.value = `change：${formatSelected(value)}`
  }

  function handleGroupFocus() {
    eventLog.value = 'focus：焦点进入选项组'
  }

  function handleGroupBlur() {
    eventLog.value = 'blur：焦点离开选项组'
  }

  function formatSelected(value: BingCheckboxGroupValue[]) {
    if (!value.length) {
      return '未选择'
    }

    return value.map(String).join('、')
  }

  const playgroundCode = computed(() => renderExampleCode(playgroundCodeSource, { direction: playgroundDirection.value, size: playgroundSize.value, status: playgroundStatus.value, disabled: playgroundDisabled.value }))

  const optionsCode = optionsCodeSource.trim()

  const slotCode = slotCodeSource.trim()

  const eventsCode = eventsCodeSource.trim()

  const statusCode = statusCodeSource.trim()
  return { directionOptions, sizeOptions, statusOptions, playgroundOptions, compactOptions, statusOptionsPreview, playgroundValue, playgroundDirection, playgroundSize, playgroundStatus, playgroundDisabled, compactValue, slotValue, statusValue, eventValue, eventLog, selectedLabel, updateDirection, updateSize, updateStatus, selectAllPlayground, clearPlayground, handleGroupChange, handleGroupFocus, handleGroupBlur, formatSelected, playgroundCode, optionsCode, slotCode, eventsCode, statusCode }
}
const key: InjectionKey<ReturnType<typeof createExamples>> = Symbol('checkbox-group-examples')
export function provideExamples() { provideExampleState(key, createExamples()) }
export function useExamples() {
  const state = injectExampleState(key)
  if (!state) throw new Error('示例需要文档页面提供状态')
  return state
}
