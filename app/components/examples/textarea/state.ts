import { computed, ref } from 'vue'
import type { BingRadioValue, BingTextareaAutosize, BingTextareaExpose, BingTextareaSize } from '@moubing/bing-ui'
import playgroundCodeSource from '~~/examples/textarea/basic.vue?raw'
import autosizeCodeSource from '~~/examples/textarea/autosize.vue?raw'
import resizeCodeSource from '~~/examples/textarea/resize.vue?raw'
import eventsCodeSource from '~~/examples/textarea/events.vue?raw'
import exposeCodeSource from '~~/examples/textarea/methods.vue?raw'
import { renderExampleCode } from '#shared/docs/example-code'
import { inject as injectExampleState, provide as provideExampleState, type InjectionKey } from 'vue'

function createExamples() {
  type RadioOption<T extends string | number> = {
    label: string
    value: T
    description?: string
  }

  type TextareaStatus = 'default' | 'error' | 'success' | 'warning'

  type AutosizeMode = 'off' | 'auto' | 'range'

  type ResizeMode = 'none' | 'vertical' | 'horizontal' | 'both'

  const sizeOptions: RadioOption<BingTextareaSize>[] = [
    { label: 'sm', value: 'sm' },
    { label: 'md', value: 'md' },
    { label: 'lg', value: 'lg' },
  ]

  const statusOptions: RadioOption<TextareaStatus>[] = [
    { label: 'default', value: 'default', description: '默认状态。' },
    { label: 'success', value: 'success', description: '成功状态。' },
    { label: 'warning', value: 'warning', description: '警告状态。' },
    { label: 'error', value: 'error', description: '错误状态。' },
  ]

  const autosizeOptions: RadioOption<AutosizeMode>[] = [
    { label: 'off', value: 'off', description: '使用 rows 固定初始高度。' },
    { label: 'auto', value: 'auto', description: '按内容自动增高。' },
    { label: 'range', value: 'range', description: '限制最小和最大行数。' },
  ]

  const rowOptions: RadioOption<number>[] = [
    { label: '2', value: 2 },
    { label: '4', value: 4 },
    { label: '6', value: 6 },
  ]

  const resizeOptions: RadioOption<ResizeMode>[] = [
    { label: 'none', value: 'none' },
    { label: 'vertical', value: 'vertical' },
    { label: 'horizontal', value: 'horizontal' },
    { label: 'both', value: 'both' },
  ]

  const playgroundValue = ref('BingTextarea 适合备注、描述、长文案编辑和多行反馈。')

  const playgroundPlaceholder = ref('请输入说明内容')

  const playgroundSize = ref<BingTextareaSize>('md')

  const playgroundStatus = ref<TextareaStatus>('default')

  const playgroundRows = ref(4)

  const playgroundAutosizeMode = ref<AutosizeMode>('range')

  const playgroundResize = ref<ResizeMode>('vertical')

  const playgroundShowCount = ref(true)

  const playgroundClearable = ref(true)

  const playgroundBlock = ref(true)

  const playgroundDisabled = ref(false)
  const playgroundReadonly = ref(false)
  const playgroundSmoothCaret = ref(true)

  const fixedValue = ref('固定行数 textarea\n适合高度稳定的备注框。')

  const autosizeValue = ref('自动高度 textarea\n继续输入更多行时会自动增高。\n第三行内容。')

  const countValue = ref('最多 80 个字符，右下角显示计数。')

  const eventValue = ref('试着输入、清除、聚焦或失焦。')

  const exposeValue = ref('可以通过 ref 调用 focus、blur、select。')

  const exposeTextarea = ref<BingTextareaExpose | null>(null)

  const selectedText = ref('未选择')

  const eventLog = ref('等待操作')

  const resizeValues = ref({ none: '禁止拖拽调整', vertical: '只允许垂直调整', error: '撑满父容器并显示错误状态' })

  const playgroundAutosize = computed<BingTextareaAutosize>(() => {
    if (playgroundAutosizeMode.value === 'auto') {
      return true
    }

    if (playgroundAutosizeMode.value === 'range') {
      return { minRows: 3, maxRows: 6 }
    }

    return false
  })

  function updateSize(value: BingRadioValue) {
    playgroundSize.value = value as BingTextareaSize
  }

  function updateStatus(value: BingRadioValue) {
    playgroundStatus.value = value as TextareaStatus
  }

  function updateRows(value: BingRadioValue) {
    playgroundRows.value = Number(value)
  }

  function updateAutosize(value: BingRadioValue) {
    playgroundAutosizeMode.value = value as AutosizeMode
  }

  function updateResize(value: BingRadioValue) {
    playgroundResize.value = value as ResizeMode
  }

  function handleInput(value: string) {
    eventLog.value = `input：${value.length} 个字符`
  }

  function handleClear() {
    eventLog.value = 'clear：已清空'
  }

  function handleFocus() {
    eventLog.value = 'focus：获得焦点'
  }

  function handleBlur() {
    eventLog.value = 'blur：失去焦点'
  }

  function focusExposeTextarea() {
    exposeTextarea.value?.focus()
  }

  function blurExposeTextarea() {
    exposeTextarea.value?.blur()
  }

  function selectExposeTextarea() {
    exposeTextarea.value?.select()
    const element = exposeTextarea.value?.textarea
    selectedText.value = element ? element.value.slice(element.selectionStart, element.selectionEnd) : '未选择'
  }

  const playgroundCode = computed(() => renderExampleCode(playgroundCodeSource, { placeholder: playgroundPlaceholder.value, size: playgroundSize.value, status: playgroundStatus.value, rows: playgroundRows.value, autosize: playgroundAutosize.value, resize: playgroundResize.value, showCount: playgroundShowCount.value, clearable: playgroundClearable.value, smoothCaret: playgroundSmoothCaret.value, block: playgroundBlock.value, disabled: playgroundDisabled.value, readonly: playgroundReadonly.value }))

  const autosizeCode = autosizeCodeSource.trim()

  const resizeCode = resizeCodeSource.trim()

  const eventsCode = eventsCodeSource.trim()

  const exposeCode = exposeCodeSource.trim()
  return { sizeOptions, statusOptions, autosizeOptions, rowOptions, resizeOptions, playgroundValue, playgroundPlaceholder, playgroundSize, playgroundStatus, playgroundRows, playgroundAutosizeMode, playgroundResize, playgroundShowCount, playgroundClearable, playgroundSmoothCaret, playgroundBlock, playgroundDisabled, playgroundReadonly, fixedValue, autosizeValue, countValue, eventValue, exposeValue, exposeTextarea, selectedText, eventLog, resizeValues, playgroundAutosize, updateSize, updateStatus, updateRows, updateAutosize, updateResize, handleInput, handleClear, handleFocus, handleBlur, focusExposeTextarea, blurExposeTextarea, selectExposeTextarea, playgroundCode, autosizeCode, resizeCode, eventsCode, exposeCode }
}
const key: InjectionKey<ReturnType<typeof createExamples>> = Symbol('textarea-examples')
export function provideExamples() { provideExampleState(key, createExamples()) }
export function useExamples() {
  const state = injectExampleState(key)
  if (!state) throw new Error('示例需要文档页面提供状态')
  return state
}
