import { computed, markRaw, ref } from 'vue'
import { Mail, Search, Sparkles } from 'lucide-vue-next'
import type { BingInputExpose, BingInputSize, BingInputType, BingRadioValue } from '@moubing/bing-ui'
import playgroundCodeSource from '~~/examples/input/basic.vue?raw'
import statesCodeSource from '~~/examples/input/states.vue?raw'
import iconCodeSource from '~~/examples/input/icons.vue?raw'
import debounceCodeSource from '~~/examples/input/debounce.vue?raw'
import exposeCodeSource from '~~/examples/input/methods.vue?raw'
import { renderExampleCode } from '#shared/docs/example-code'
import { inject as injectExampleState, provide as provideExampleState, type InjectionKey } from 'vue'

function createExamples() {
  type RadioOption<T extends string> = {
    label: string
    value: T
    description?: string
  }

  type InputStatus = 'default' | 'error' | 'success' | 'warning'

  const SearchIcon = markRaw(Search)

  const MailIcon = markRaw(Mail)

  const SparklesIcon = markRaw(Sparkles)

  const typeOptions: RadioOption<BingInputType>[] = [
    { label: 'text', value: 'text' },
    { label: 'search', value: 'search' },
    { label: 'email', value: 'email' },
    { label: 'password', value: 'password' },
    { label: 'tel', value: 'tel' },
    { label: 'url', value: 'url' },
  ]

  const sizeOptions: RadioOption<BingInputSize>[] = [
    { label: 'sm', value: 'sm' },
    { label: 'md', value: 'md' },
    { label: 'lg', value: 'lg' },
  ]

  const statusOptions: RadioOption<InputStatus>[] = [
    { label: 'default', value: 'default', description: '默认状态。' },
    { label: 'success', value: 'success', description: '成功状态。' },
    { label: 'warning', value: 'warning', description: '警告状态。' },
    { label: 'error', value: 'error', description: '错误状态。' },
  ]

  const sizeValues: BingInputSize[] = ['sm', 'md', 'lg']

  const statusValues: InputStatus[] = ['default', 'success', 'warning', 'error']

  const playgroundValue = ref<string | number | null>('Bing UI')

  const playgroundPlaceholder = ref('请输入内容')

  const playgroundType = ref<BingInputType>('text')

  const playgroundSize = ref<BingInputSize>('md')

  const playgroundStatus = ref<InputStatus>('default')

  const playgroundClearMode = ref('auto')
  const playgroundClearable = computed(() => playgroundClearMode.value === 'auto' ? undefined : playgroundClearMode.value === 'always')

  const playgroundBlock = ref(true)

  const playgroundDisabled = ref(false)

  const playgroundWithIcon = ref(true)

  const debounceValue = ref<string | number | null>('')

  const debouncedValue = ref('等待输入')

  const clearCount = ref(0)

  const focusCount = ref(0)

  const blurCount = ref(0)

  const exposeValue = ref<string | number | null>('可以通过 ref 控制')

  const exposeInput = ref<BingInputExpose | null>(null)

  const selectedText = ref('未选择')

  function updateType(value: BingRadioValue) {
    playgroundType.value = value as BingInputType
  }

  function updateSize(value: BingRadioValue) {
    playgroundSize.value = value as BingInputSize
  }

  function updateStatus(value: BingRadioValue) {
    playgroundStatus.value = value as InputStatus
  }

  function handleDebouncedInput(value: string) {
    debouncedValue.value = value || '空字符串'
  }

  function handleClear() {
    clearCount.value += 1
  }

  function handleFocus() {
    focusCount.value += 1
  }

  function handleBlur() {
    blurCount.value += 1
  }

  function focusExposeInput() {
    exposeInput.value?.focus()
  }

  function blurExposeInput() {
    exposeInput.value?.blur()
  }

  function selectExposeInput() {
    exposeInput.value?.select()
    const element = exposeInput.value?.input
    selectedText.value = element ? element.value.slice(element.selectionStart ?? 0, element.selectionEnd ?? 0) : '未选择'
  }

  const playgroundCode = computed(() => renderExampleCode(playgroundCodeSource, { initialValue: playgroundValue.value, type: playgroundType.value, placeholder: playgroundPlaceholder.value, size: playgroundSize.value, status: playgroundStatus.value, clearMode: playgroundClearMode.value, block: playgroundBlock.value, disabled: playgroundDisabled.value, withIcon: playgroundWithIcon.value }))

  const statesCode = statesCodeSource.trim()

  const iconCode = iconCodeSource.trim()

  const debounceCode = debounceCodeSource.trim()

  const exposeCode = exposeCodeSource.trim()
  return { SearchIcon, MailIcon, SparklesIcon, typeOptions, sizeOptions, statusOptions, sizeValues, statusValues, playgroundValue, playgroundPlaceholder, playgroundType, playgroundSize, playgroundStatus, playgroundClearMode, playgroundClearable, playgroundBlock, playgroundDisabled, playgroundWithIcon, debounceValue, debouncedValue, clearCount, focusCount, blurCount, exposeValue, exposeInput, selectedText, updateType, updateSize, updateStatus, handleDebouncedInput, handleClear, handleFocus, handleBlur, focusExposeInput, blurExposeInput, selectExposeInput, playgroundCode, statesCode, iconCode, debounceCode, exposeCode }
}
const key: InjectionKey<ReturnType<typeof createExamples>> = Symbol('input-examples')
export function provideExamples() { provideExampleState(key, createExamples()) }
export function useExamples() {
  const state = injectExampleState(key)
  if (!state) throw new Error('示例需要文档页面提供状态')
  return state
}
