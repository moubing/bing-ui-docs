import { computed, onDeactivated, ref } from 'vue'
import type { BingDialogCloseReason, BingDialogOverlayOrb } from '@moubing/bing-ui'
import basicCodeSource from '~~/examples/dialog/basic.vue?raw'
import footerCodeSource from '~~/examples/dialog/footer.vue?raw'
import ambienceCodeSource from '~~/examples/dialog/ambience.vue?raw'
import behaviorCodeSource from '~~/examples/dialog/behavior.vue?raw'
import { renderExampleCode } from '#shared/docs/example-code'
import { inject as injectExampleState, provide as provideExampleState, type InjectionKey } from 'vue'

function createExamples() {
  const basicOpen = ref(false)

  const footerOpen = ref(false)

  const ambienceOpen = ref(false)

  const behaviorOpen = ref(false)

  const basicTitle = ref('发布组件文档')

  const basicWidth = ref('560px')

  const basicShowFooter = ref(true)

  const basicShowClose = ref(true)

  const basicShowPeek = ref(true)

  const basicLockScroll = ref(true)

  const basicCloseOnOverlay = ref(true)

  const basicCloseOnEsc = ref(true)

  const basicCloseOnConfirm = ref(false)

  const basicConfirmLoading = ref(false)

  const basicConfirmDisabled = ref(false)

  const lastCloseReason = ref<BingDialogCloseReason | '未关闭'>('未关闭')

  const confirmCount = ref(0)

  const cancelCount = ref(0)

  const footerAction = ref('等待操作')
  const footerConfirmCount = ref(0)

  const behaviorEvents = ref<string[]>([])
  const behaviorLog = computed(() => `状态：${behaviorOpen.value ? '已打开' : '已关闭'}；事件：${behaviorEvents.value.join(' → ') || '无'}`)

  onDeactivated(() => {
    closeDemoDialogs()
  })

  const customOrbs: BingDialogOverlayOrb[] = [
    {
      id: 'rose',
      color: '#fb7185',
      x: 24,
      y: 28,
      size: 320,
      opacity: 0.26,
      blur: 58,
      motionX: 64,
      motionY: 40,
      duration: 12,
    },
    {
      id: 'cyan',
      color: '#38bdf8',
      x: 78,
      y: 26,
      size: 300,
      opacity: 0.22,
      blur: 54,
      motionX: -72,
      motionY: 48,
      duration: 14,
    },
    {
      id: 'violet',
      color: '#a78bfa',
      x: 58,
      y: 78,
      size: 260,
      opacity: 0.2,
      blur: 60,
      motionX: 42,
      motionY: -56,
      duration: 16,
    },
  ]

  function handleClose(reason: BingDialogCloseReason) {
    lastCloseReason.value = reason
  }

  function handleConfirm() {
    confirmCount.value += 1
  }

  function handleCancel() {
    cancelCount.value += 1
  }

  function handleFooterClose(reason: BingDialogCloseReason) {
    footerAction.value = `关闭来源：${reason}`
  }

  function saveDraft() {
    footerAction.value = '已保存草稿，弹窗保持打开'
  }

  function handleBehaviorClose(reason: BingDialogCloseReason) {
    behaviorEvents.value.push(`close:${reason}`)
  }

  function updateBehavior(value: boolean) {
    behaviorEvents.value.push(`update:${value}`)
    behaviorOpen.value = value
  }

  function closeDemoDialogs() {
    basicOpen.value = false
    footerOpen.value = false
    ambienceOpen.value = false
    behaviorOpen.value = false
  }

  const basicCode = computed(() => renderExampleCode(basicCodeSource, { title: basicTitle.value, width: basicWidth.value, showFooter: basicShowFooter.value, showClose: basicShowClose.value, showPeek: basicShowPeek.value, lockScroll: basicLockScroll.value, closeOnOverlay: basicCloseOnOverlay.value, closeOnEsc: basicCloseOnEsc.value, closeOnConfirm: basicCloseOnConfirm.value, confirmLoading: basicConfirmLoading.value, confirmDisabled: basicConfirmDisabled.value }))

  const footerCode = footerCodeSource.trim()

  const ambienceCode = ambienceCodeSource.trim()

  const behaviorCode = behaviorCodeSource.trim()
  return { basicOpen, footerOpen, ambienceOpen, behaviorOpen, basicTitle, basicWidth, basicShowFooter, basicShowClose, basicShowPeek, basicLockScroll, basicCloseOnOverlay, basicCloseOnEsc, basicCloseOnConfirm, basicConfirmLoading, basicConfirmDisabled, lastCloseReason, confirmCount, cancelCount, footerAction, footerConfirmCount, behaviorEvents, behaviorLog, customOrbs, handleClose, handleConfirm, handleCancel, handleFooterClose, saveDraft, handleBehaviorClose, updateBehavior, closeDemoDialogs, basicCode, footerCode, ambienceCode, behaviorCode }
}
const key: InjectionKey<ReturnType<typeof createExamples>> = Symbol('dialog-examples')
export function provideExamples() { provideExampleState(key, createExamples()) }
export function useExamples() {
  const state = injectExampleState(key)
  if (!state) throw new Error('示例需要文档页面提供状态')
  return state
}
