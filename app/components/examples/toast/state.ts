import { computed, onBeforeUnmount, onDeactivated, ref } from 'vue'
import { BING_TOAST_POSITION_OPTIONS, bingToast, normalizeBingToastPosition } from '@moubing/bing-ui'
import type { BingSelectModelValue, BingSelectOption, BingToastItem, BingToastPosition, BingToastType, BingToastViewportPosition } from '@moubing/bing-ui'
import playgroundCodeSource from '~~/examples/toast/basic.vue?raw'
import typeCodeSource from '~~/examples/toast/types.vue?raw'
import loadingCodeSource from '~~/examples/toast/loading.vue?raw'
import positionCodeSource from '~~/examples/toast/positions.vue?raw'
import { renderExampleCode } from '#shared/docs/example-code'
import { inject as injectExampleState, provide as provideExampleState, type InjectionKey } from 'vue'

function createExamples() {
  const toastTypes: BingToastType[] = ['default', 'success', 'error', 'loading', 'warning', 'info']

  const viewportPositions = ['all', ...BING_TOAST_POSITION_OPTIONS] as BingToastViewportPosition[]

  const typeOptions: BingSelectOption[] = [
    { label: 'default', value: 'default', description: '普通提示。' },
    { label: 'success', value: 'success', description: '操作完成。' },
    { label: 'error', value: 'error', description: '错误或失败。' },
    { label: 'loading', value: 'loading', description: '持续中的任务。' },
    { label: 'warning', value: 'warning', description: '需要注意。' },
    { label: 'info', value: 'info', description: '补充信息。' },
  ]

  const positionOptions: BingSelectOption[] = BING_TOAST_POSITION_OPTIONS.map((position) => ({
    label: position,
    value: position,
  }))

  const viewportOptions: BingSelectOption[] = viewportPositions.map((position) => ({
    label: position,
    value: position,
    description: position === 'all' ? '同一个视口承载全部位置。' : `只渲染 ${position} 区域。`,
  }))

  const playgroundType = ref<BingToastType>('success')

  const playgroundPosition = ref<BingToastPosition>('top-right')

  const playgroundViewport = ref<BingToastViewportPosition>('all')

  const playgroundTitle = ref('保存成功')

  const playgroundMessage = ref('新的组件文档已经写入本地页面。')

  const playgroundDuration = ref('2800')

  const playgroundClosable = ref(true)

  const playgroundWidth = ref('360px')

  const playgroundOffset = ref('18px')

  const playgroundGap = ref('10px')

  const playgroundMax = ref('5')

  const lastToastId = ref('未创建')

  const closeLog = ref('等待关闭')
  const ownedIds = new Set<string>()
  const pendingTimers = new Map<number, BingToastPosition>()
  let loadingTimer: number | undefined

  function remember(id: string) { ownedIds.add(id); lastToastId.value = id }
  function schedule(callback: () => void, delay: number, position: BingToastPosition) {
    const timer = window.setTimeout(() => { pendingTimers.delete(timer); callback() }, delay)
    pendingTimers.set(timer, position)
    return timer
  }
  function cancelPending(position?: BingToastPosition) {
    for (const [timer, target] of pendingTimers) {
      if (position && normalizeBingToastPosition(position) !== normalizeBingToastPosition(target)) continue
      window.clearTimeout(timer)
      pendingTimers.delete(timer)
    }
  }

  const playgroundSummary = computed(() => [
    {
      label: '持续时间',
      value: resolveDuration() === 0 ? '手动关闭' : `${resolveDuration()} ms`,
    },
    { label: '消息位置', value: playgroundPosition.value },
    { label: '视口', value: playgroundViewport.value },
    { label: '卡片宽度', value: playgroundWidth.value || '自动' },
    { label: '堆叠间距', value: playgroundGap.value || '默认' },
    { label: '关闭按钮', value: playgroundClosable.value ? '显示' : '隐藏' },
  ])

  function cleanupDemo() {
    cancelPending()
    ownedIds.forEach(id => bingToast.close(id))
    ownedIds.clear()
  }
  onBeforeUnmount(cleanupDemo)
  onDeactivated(cleanupDemo)

  function updateType(value: BingSelectModelValue) {
    if (typeof value === 'string') playgroundType.value = value as BingToastType
  }

  function updatePosition(value: BingSelectModelValue) {
    if (typeof value === 'string') playgroundPosition.value = value as BingToastPosition
  }

  function updateViewport(value: BingSelectModelValue) {
    if (typeof value === 'string') playgroundViewport.value = value as BingToastViewportPosition
  }

  function pushConfiguredToast() {
    const id = createToastByType(playgroundType.value, {
      title: playgroundTitle.value,
      message: playgroundMessage.value,
      position: playgroundPosition.value,
      duration: resolveDuration(),
      closable: playgroundClosable.value,
    })

    remember(id)
  }

  function pushType(type: BingToastType) {
    const id = createToastByType(type, {
      title: toastTypeTitle(type),
      message: toastTypeMessage(type),
      position: playgroundPosition.value,
      duration: type === 'loading' ? 0 : resolveDuration(),
      closable: playgroundClosable.value,
    })

    remember(id)
  }

  function pushLoadingFlow() {
    if (loadingTimer !== undefined) { window.clearTimeout(loadingTimer); pendingTimers.delete(loadingTimer) }
    const position = playgroundPosition.value
    const id = bingToast.loading({
      id: 'docs-toast-loading',
      title: '处理中',
      message: '正在同步组件元数据。',
      position,
      closable: true,
    })

    remember(id)

    loadingTimer = schedule(() => {
      loadingTimer = undefined
      if (!bingToast.getToasts().some(toast => toast.id === id)) return
      bingToast.success({
        id,
        title: '同步完成',
        message: '组件元数据已经更新。',
        position,
        duration: 2600,
        closable: true,
      })
    }, 1200, position)
  }

  function pushStack() {
    const position = playgroundPosition.value
    const duration = resolveDuration()
    const closable = playgroundClosable.value
    ;[
      ['success', '文档已保存'],
      ['info', '预览链接已复制'],
      ['warning', '有一项配置需要确认'],
    ].forEach(([type, message], index) => {
      schedule(() => {
        const id = createToastByType(type as BingToastType, {
          message,
          position, duration, closable,
        })

        remember(id)
      }, index * 140, position)
    })
  }

  function pushAtPosition(position: BingToastPosition) {
    const id = bingToast.success({
      title: `位置：${position}`,
      message: '这条消息由 position 参数决定出现位置。',
      position,
      duration: resolveDuration(),
      closable: playgroundClosable.value,
    })

    remember(id)
  }

  function closeLastToast() {
    if (lastToastId.value === '未创建') {
      closeLog.value = '还没有可关闭的 Toast'
      return
    }

    bingToast.close(lastToastId.value)
    closeLog.value = `已手动关闭：${lastToastId.value}`
  }

  function clearAllToasts() {
    cancelPending()
    bingToast.clear()
    closeLog.value = '已清空全部 Toast'
    lastToastId.value = '未创建'
  }

  function clearCurrentPosition() {
    cancelPending(playgroundPosition.value)
    bingToast.clear(playgroundPosition.value)
    closeLog.value = `已清空位置：${playgroundPosition.value}`
  }

  function handleClose(toast: BingToastItem) {
    closeLog.value = `用户关闭：${toast.id} / ${toast.type}`
  }

  function createToastByType(type: BingToastType, options: Parameters<typeof bingToast.show>[0]) {
    if (type === 'success') {
      return bingToast.success(options)
    }

    if (type === 'error') {
      return bingToast.error(options)
    }

    if (type === 'loading') {
      return bingToast.loading(options)
    }

    if (type === 'warning') {
      return bingToast.warning(options)
    }

    if (type === 'info') {
      return bingToast.info(options)
    }

    return bingToast.show(options)
  }

  function serviceMethodName(type: BingToastType) {
    return type === 'default' ? 'show' : type
  }

  function toastTypeTitle(type: BingToastType) {
    const titles: Record<BingToastType, string> = {
      default: '提示',
      success: '保存成功',
      error: '提交失败',
      loading: '处理中',
      warning: '需要确认',
      info: '说明',
    }

    return titles[type]
  }

  function toastTypeMessage(type: BingToastType) {
    const messages: Record<BingToastType, string> = {
      default: '这是一条普通消息。',
      success: '新的配置已经保存。',
      error: '当前素材还没有通过校验。',
      loading: '正在同步组件元数据。',
      warning: '有一项设置可能影响页面展示。',
      info: '预览链接已经复制到剪贴板。',
    }

    return messages[type]
  }

  function resolveDuration() {
    const duration = Number(playgroundDuration.value)

    return Number.isFinite(duration) ? Math.max(0, Math.floor(duration)) : 2800
  }

  function resolveMax() {
    const max = Number(playgroundMax.value)

    return Number.isFinite(max) ? Math.max(1, Math.floor(max)) : 5
  }

  const playgroundCode = computed(() => renderExampleCode(playgroundCodeSource, { type: playgroundType.value, title: playgroundTitle.value, message: playgroundMessage.value, position: playgroundPosition.value, duration: resolveDuration(), closable: playgroundClosable.value, viewportPosition: playgroundViewport.value, width: playgroundWidth.value, offset: playgroundOffset.value, gap: playgroundGap.value, max: resolveMax() }))

  const typeCode = typeCodeSource.trim()

  const loadingCode = loadingCodeSource.trim()

  const positionCode = positionCodeSource.trim()
  return { toastTypes, viewportPositions, typeOptions, positionOptions, viewportOptions, playgroundType, playgroundPosition, playgroundViewport, playgroundTitle, playgroundMessage, playgroundDuration, playgroundClosable, playgroundWidth, playgroundOffset, playgroundGap, playgroundMax, lastToastId, closeLog, playgroundSummary, updateType, updatePosition, updateViewport, pushConfiguredToast, pushType, pushLoadingFlow, pushStack, pushAtPosition, closeLastToast, clearAllToasts, clearCurrentPosition, handleClose, createToastByType, serviceMethodName, toastTypeTitle, toastTypeMessage, resolveDuration, resolveMax, playgroundCode, typeCode, loadingCode, positionCode }
}
const key: InjectionKey<ReturnType<typeof createExamples>> = Symbol('toast-examples')
export function provideExamples() { provideExampleState(key, createExamples()) }
export function useExamples() {
  const state = injectExampleState(key)
  if (!state) throw new Error('示例需要文档页面提供状态')
  return state
}
