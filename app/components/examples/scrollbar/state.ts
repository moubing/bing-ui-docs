import { computed, nextTick, ref } from 'vue'
import type { BingScrollbarExpose } from '@moubing/bing-ui'
import playgroundCodeSource from '~~/examples/scrollbar/basic.vue?raw'
import horizontalCodeSource from '~~/examples/scrollbar/horizontal.vue?raw'
import smoothCodeSource from '~~/examples/scrollbar/smooth.vue?raw'
import exposeCodeSource from '~~/examples/scrollbar/methods.vue?raw'
import { renderExampleCode } from '#shared/docs/example-code'
import { inject as injectExampleState, provide as provideExampleState, type InjectionKey } from 'vue'

function createExamples() {
  const verticalItems = Array.from({ length: 18 }, (_, index) => ({
    id: index + 1,
    title: `交互层 ${index + 1}`,
    description: index % 2 === 0 ? '动效反馈和状态展示。' : '稳定的结构内容区域。',
  }))

  const horizontalColumns = Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
    title: `Column ${index + 1}`,
    description: '横向滚动内容块。',
  }))

  const logItems = ref(Array.from({ length: 36 }, (_, index) => ({
    id: index + 1,
    time: `09:${String(index + 10).padStart(2, '0')}`,
    text: index % 3 === 0 ? '组件状态已同步。' : index % 3 === 1 ? '用户调整了滚动区域。' : '示例内容继续写入。',
  })))

  const playgroundHeight = ref('300px')

  const playgroundMinThumbSize = ref('28')

  const playgroundTolerance = ref('1')

  const playgroundAlways = ref(true)

  const playgroundVertical = ref(true)

  const playgroundHorizontal = ref(false)

  const playgroundDisabled = ref(false)

  const playgroundLog = ref('等待滚动')

  const apiScrollbarRef = ref<BingScrollbarExpose | null>(null)

  const apiLog = ref('等待调用')

  function handlePlaygroundScroll(event: Event) {
    const target = event.currentTarget as HTMLElement

    playgroundLog.value = `scrollTop: ${Math.round(target.scrollTop)} / scrollLeft: ${Math.round(target.scrollLeft)}`
  }

  function scrollApiToTop() {
    apiScrollbarRef.value?.scrollTo(0)
    apiLog.value = 'scrollTo(0)'
  }

  function scrollApiDown() {
    apiScrollbarRef.value?.scrollBy(120)
    apiLog.value = 'scrollBy(120)'
  }

  function scrollApiToBottom() {
    apiScrollbarRef.value?.scrollTo({ top: 9999, behavior: 'smooth' })
    apiLog.value = 'scrollTo({ top: 9999 })'
  }

  function refreshApiMetrics() {
    apiScrollbarRef.value?.update()
    apiLog.value = 'update()'
  }

  async function appendLogs() {
    logItems.value.push(...Array.from({ length: 10 }, (_, index) => ({
      id: logItems.value.length + index + 1, time: '新增', text: '示例内容继续写入。',
    })))
    await nextTick()
    refreshApiMetrics()
  }

  function stopApiScroll() { apiScrollbarRef.value?.stop(); apiLog.value = '停止组件插值' }
  function forwardApiWheel(event: WheelEvent) { apiLog.value = `外部滚轮消费：${apiScrollbarRef.value?.handleWheel(event) ?? false}` }

  function normalizeNumber(value: string, fallback: number) {
    const nextValue = Number(value)

    return Number.isFinite(nextValue) ? nextValue : fallback
  }

  const playgroundCode = computed(() => renderExampleCode(playgroundCodeSource, { height: playgroundHeight.value, minThumbSize: normalizeNumber(playgroundMinThumbSize.value, 28), overflowTolerance: normalizeNumber(playgroundTolerance.value, 1), vertical: playgroundVertical.value, horizontal: playgroundHorizontal.value, always: playgroundAlways.value, disabled: playgroundDisabled.value }))

  const horizontalCode = horizontalCodeSource.trim()

  const smoothCode = smoothCodeSource.trim()

  const exposeCode = exposeCodeSource.trim()
  return { verticalItems, horizontalColumns, logItems, playgroundHeight, playgroundMinThumbSize, playgroundTolerance, playgroundAlways, playgroundVertical, playgroundHorizontal, playgroundDisabled, playgroundLog, apiScrollbarRef, apiLog, handlePlaygroundScroll, scrollApiToTop, scrollApiDown, scrollApiToBottom, refreshApiMetrics, appendLogs, stopApiScroll, forwardApiWheel, normalizeNumber, playgroundCode, horizontalCode, smoothCode, exposeCode }
}
const key: InjectionKey<ReturnType<typeof createExamples>> = Symbol('scrollbar-examples')
export function provideExamples() { provideExampleState(key, createExamples()) }
export function useExamples() {
  const state = injectExampleState(key)
  if (!state) throw new Error('示例需要文档页面提供状态')
  return state
}
