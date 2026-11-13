import { computed, onActivated, onDeactivated, reactive, ref } from 'vue'
import { FilePlus2, FolderOpen, Package, Wand } from 'lucide-vue-next'
import type { BingDropDownExpose, BingDropDownPlacement, BingDropDownSize, BingDropDownTrigger, BingRadioValue } from '@moubing/bing-ui'
import playgroundCodeSource from '~~/examples/drop-down/basic.vue?raw'
import contextCodeSource from '~~/examples/drop-down/context.vue?raw'
import itemCodeSource from '~~/examples/drop-down/items.vue?raw'
import controlledCodeSource from '~~/examples/drop-down/controlled.vue?raw'
import { renderExampleCode } from '#shared/docs/example-code'
import { inject as injectExampleState, provide as provideExampleState, type InjectionKey } from 'vue'

function createExamples() {
  const examplesActive = ref(true)
  const contextFeedback = ref('等待右键操作')
  const itemFeedback = ref('等待选择')
  const actionHistory = ref<string[]>([])
  onActivated(() => { examplesActive.value = true })
  onDeactivated(() => {
    examplesActive.value = false
    menuOpen.value = false
    controlledOpen.value = false
    menuContext.value = null
  })
  type RadioOption<T extends string> = {
    label: string
    value: T
    description?: string
  }

  type AssetKind = 'folder' | 'image' | 'package' | 'document'

  type AssetRow = {
    id: string
    name: string
    description: string
    kind: AssetKind
    status: string
    locked: boolean
    deletable: boolean
  }

  const triggerOptions: RadioOption<BingDropDownTrigger>[] = [
    { label: 'click', value: 'click', description: '点击触发器打开或关闭。' },
    { label: 'hover', value: 'hover', description: '鼠标悬停打开，移出后关闭。' },
    { label: 'contextmenu', value: 'contextmenu', description: '右键或 Shift + F10 打开。' },
  ]

  const placementOptions: RadioOption<BingDropDownPlacement>[] = [
    { label: 'bottom-start', value: 'bottom-start' },
    { label: 'bottom-end', value: 'bottom-end' },
    { label: 'top-start', value: 'top-start' },
    { label: 'top-end', value: 'top-end' },
    { label: 'right-start', value: 'right-start' },
    { label: 'right-end', value: 'right-end' },
    { label: 'left-start', value: 'left-start' },
    { label: 'left-end', value: 'left-end' },
  ]

  const sizeOptions: RadioOption<BingDropDownSize>[] = [
    { label: 'sm', value: 'sm' },
    { label: 'md', value: 'md' },
    { label: 'lg', value: 'lg' },
  ]

  const playground = reactive({
    trigger: 'click' as BingDropDownTrigger,
    placement: 'bottom-end' as BingDropDownPlacement,
    size: 'md' as BingDropDownSize,
    minWidth: '220',
    closeOnOutside: true,
    closeOnEscape: true,
    autoFocus: false,
    loop: true,
    glass: true,
  })

  const menuOpen = ref(false)

  const controlledOpen = ref(false)

  const eventLog = ref('等待打开菜单')

  const controlledLog = ref('等待操作')

  const menuContext = ref<unknown>(null)

  const controlledDropdown = ref<BingDropDownExpose | null>(null)

  const assets: AssetRow[] = [
    {
      id: 'brand-kit',
      name: '品牌资源',
      description: '32 个源文件',
      kind: 'folder',
      status: '可编辑',
      locked: false,
      deletable: false,
    },
    {
      id: 'cover-image',
      name: '首页封面图',
      description: '3840 x 2160 图片',
      kind: 'image',
      status: '待压缩',
      locked: false,
      deletable: true,
    },
    {
      id: 'release',
      name: 'release-candidate.zip',
      description: '128 MB 发布包',
      kind: 'package',
      status: '审核中',
      locked: true,
      deletable: false,
    },
    {
      id: 'handoff',
      name: '交付说明.md',
      description: '协作文档',
      kind: 'document',
      status: '已共享',
      locked: false,
      deletable: true,
    },
  ]

  const minWidthValue = computed(() => toCssSize(playground.minWidth, '220px'))

  const selectedContextName = computed(() => getContextName(menuContext.value))

  function updateTrigger(value: BingRadioValue) {
    playground.trigger = value as BingDropDownTrigger
    menuOpen.value = false
  }

  function updatePlacement(value: BingRadioValue) {
    playground.placement = value as BingDropDownPlacement
  }

  function updateSize(value: BingRadioValue) {
    playground.size = value as BingDropDownSize
  }

  function recordAction(action: string) {
    actionHistory.value = [...actionHistory.value, action].slice(-6)
    eventLog.value = actionHistory.value.join(' → ')
  }

  function recordControlled(action: string) {
    controlledLog.value = action
  }

  function openControlled() {
    controlledDropdown.value?.openPanel()
    controlledLog.value = '调用 openPanel()'
  }

  function closeControlled() {
    controlledDropdown.value?.close()
    controlledLog.value = '调用 close()'
  }

  function toggleControlled() {
    controlledDropdown.value?.toggle()
    controlledLog.value = '调用 toggle()'
  }

  function focusControlled() {
    controlledDropdown.value?.focusFirstItem()
    controlledLog.value = '调用 focusFirstItem()'
  }

  function iconForAsset(asset: AssetRow | unknown) {
    const kind = getContextKind(asset)

    if (kind === 'folder') {
      return FolderOpen
    }

    if (kind === 'package') {
      return Package
    }

    if (kind === 'image') {
      return Wand
    }

    return FilePlus2
  }

  function getContextName(context: unknown) {
    return isAssetRow(context) ? context.name : '未选择资源'
  }

  function getContextDescription(context: unknown) {
    return isAssetRow(context) ? context.description : '右键目标会出现在这里'
  }

  function getContextKind(context: unknown): AssetKind | undefined {
    return isAssetRow(context) ? context.kind : undefined
  }

  function isAssetFolder(context: unknown) {
    return getContextKind(context) === 'folder'
  }

  function isContextLocked(context: unknown) {
    return isAssetRow(context) ? context.locked : false
  }

  function isContextDeletable(context: unknown) {
    return isAssetRow(context) ? context.deletable : false
  }

  function isAssetRow(value: unknown): value is AssetRow {
    if (typeof value !== 'object' || value === null) return false
    const record = value as Record<string, unknown>
    return typeof record.id === 'string' && typeof record.name === 'string'
      && typeof record.description === 'string' && typeof record.status === 'string'
      && typeof record.kind === 'string' && ['folder', 'image', 'package', 'document'].includes(record.kind)
      && typeof record.locked === 'boolean' && typeof record.deletable === 'boolean'
  }

  function recordContextAction(action: string, context: unknown) {
    contextFeedback.value = action + '：' + getContextName(context) + '（仅本地演示）'
  }

  function recordItemAction(action: string) { itemFeedback.value = '已选择：' + action + '（仅本地演示）' }

  function handleContextOpened(payload: { context: unknown }) {
    contextFeedback.value = `右键打开：${getContextName(payload.context)}`
  }

  function toCssSize(value: string, fallback: string) {
    const normalized = value.trim()

    if (!normalized) {
      return fallback
    }

    if (/^\d+(\.\d+)?$/.test(normalized)) {
      return `${normalized}px`
    }

    return normalized
  }

  const playgroundCode = computed(() => renderExampleCode(playgroundCodeSource, { trigger: playground.trigger, placement: playground.placement, size: playground.size, minWidth: minWidthValue.value, closeOnOutside: playground.closeOnOutside, closeOnEscape: playground.closeOnEscape, autoFocus: playground.autoFocus, loop: playground.loop, glass: playground.glass }))

  const contextCode = contextCodeSource.trim()

  const itemCode = itemCodeSource.trim()

  const controlledCode = controlledCodeSource.trim()
  return { examplesActive, contextFeedback, itemFeedback, recordContextAction, recordItemAction, triggerOptions, placementOptions, sizeOptions, playground, menuOpen, controlledOpen, eventLog, controlledLog, menuContext, controlledDropdown, assets, minWidthValue, selectedContextName, updateTrigger, updatePlacement, updateSize, recordAction, recordControlled, openControlled, closeControlled, toggleControlled, focusControlled, iconForAsset, getContextName, getContextDescription, getContextKind, isAssetFolder, isContextLocked, isContextDeletable, isAssetRow, handleContextOpened, toCssSize, playgroundCode, contextCode, itemCode, controlledCode }
}
const key: InjectionKey<ReturnType<typeof createExamples>> = Symbol('drop-down-examples')
export function provideExamples() { provideExampleState(key, createExamples()) }
export function useExamples() {
  const state = injectExampleState(key)
  if (!state) throw new Error('示例需要文档页面提供状态')
  return state
}
