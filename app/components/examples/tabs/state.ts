import { computed, ref, inject, provide, type InjectionKey } from 'vue'
import type { BingRadioValue, BingTabItem, BingTabValue, BingTabsActivation, BingTabsChangePayload, BingTabsFocusPayload, BingTabsSize, BingTabsVariant } from '@moubing/bing-ui'
import { renderExampleCode } from '#shared/docs/example-code'
import basicSource from '~~/examples/tabs/basic.vue?raw'
import variantsSource from '~~/examples/tabs/variants.vue?raw'
import richSource from '~~/examples/tabs/item-slot.vue?raw'
import keyboardSource from '~~/examples/tabs/keyboard.vue?raw'

function createTabsExamples() {
  type RadioOption<T extends string> = {
    label: string
    value: T
    description?: string
  }

  type RichTabItem = BingTabItem & {
    tone: string
    count: number
  }

  const tabsItems: BingTabItem[] = [
    { value: 'overview', label: '总览' },
    { value: 'usage', label: '用法' },
    { value: 'metrics', label: '指标' },
    { value: 'disabled', label: '禁用项', disabled: true },
  ]

  const richItems: RichTabItem[] = [
    { value: 'design', label: '设计', tone: '#fb7185', count: 12 },
    { value: 'develop', label: '开发', tone: '#38bdf8', count: 6 },
    { value: 'release', label: '发布', tone: '#34d399', count: 3 },
    { value: 'archive', label: '归档', tone: '#94a3b8', count: 0, disabled: true },
  ]

  const sizeOptions: RadioOption<BingTabsSize>[] = [
    { label: 'sm', value: 'sm' },
    { label: 'md', value: 'md' },
    { label: 'lg', value: 'lg' },
  ]

  const variantOptions: RadioOption<BingTabsVariant>[] = [
    { label: 'pill', value: 'pill', description: '默认胶囊样式。' },
    { label: 'glass', value: 'glass', description: '更强的玻璃浮层质感。' },
    { label: 'soft', value: 'soft', description: '更轻的背景和阴影。' },
  ]

  const activationOptions: RadioOption<BingTabsActivation>[] = [
    { label: 'auto', value: 'auto', description: '方向键移动焦点时同步切换选中项。' },
    { label: 'manual', value: 'manual', description: '方向键只移动焦点，Enter 或 Space 才切换。' },
  ]

  const activeValue = ref<BingTabValue>('overview')
  const richValue = ref<BingTabValue>('design')
  const pillValue = ref<BingTabValue>('overview')
  const glassValue = ref<BingTabValue>('overview')
  const softValue = ref<BingTabValue>('overview')
  const playgroundSize = ref<BingTabsSize>('md')
  const playgroundVariant = ref<BingTabsVariant>('glass')
  const playgroundActivation = ref<BingTabsActivation>('auto')
  const playgroundBlock = ref(false)
  const playgroundLoop = ref(true)
  const playgroundAnimated = ref(true)
  const playgroundDisabled = ref(false)
  const eventLog = ref('等待切换')
  const focusLog = ref('等待焦点事件')

  const activeItem = computed(() =>
    tabsItems.find((item) => Object.is(item.value, activeValue.value)) ?? tabsItems[0],
  )

  const richActiveItem = computed(() =>
    richItems.find((item) => Object.is(item.value, richValue.value)) ?? richItems[0],
  )

  const playgroundCode = computed(() => renderExampleCode(basicSource, {
    size: playgroundSize.value, variant: playgroundVariant.value, activation: playgroundActivation.value,
    block: playgroundBlock.value, loop: playgroundLoop.value, animated: playgroundAnimated.value, disabled: playgroundDisabled.value,
  }))
  const variantsCode = variantsSource.trim()
  const richCode = richSource.trim()
  const activationCode = keyboardSource.trim()

  function updateSize(value: BingRadioValue) {
    playgroundSize.value = value as BingTabsSize
  }

  function updateVariant(value: BingRadioValue) {
    playgroundVariant.value = value as BingTabsVariant
  }

  function updateActivation(value: BingRadioValue) {
    playgroundActivation.value = value as BingTabsActivation
  }

  function handleChange(payload: BingTabsChangePayload) {
    eventLog.value = `${payload.previousItem?.label ?? '无'} -> ${payload.item.label}`
  }

  function handleFocus(payload: BingTabsFocusPayload) {
    focusLog.value = `聚焦：${payload.item.label}`
  }

  function handleBlur(payload: BingTabsFocusPayload) {
    focusLog.value = `失焦：${payload.item.label}`
  }

  function getRichTone(item: BingTabItem) {
    return typeof item.tone === 'string' ? item.tone : '#94a3b8'
  }

  function getRichCount(item: BingTabItem) {
    return typeof item.count === 'number' ? item.count : 0
  }
  return { activeValue, tabsItems, playgroundSize, playgroundVariant, playgroundActivation, playgroundBlock, playgroundLoop, playgroundAnimated, playgroundDisabled, handleChange, handleFocus, handleBlur, activeItem, eventLog, focusLog, variantOptions, sizeOptions, activationOptions, updateVariant, updateSize, updateActivation, playgroundCode, pillValue, glassValue, softValue, variantsCode, richValue, richItems, getRichTone, getRichCount, richActiveItem, richCode, activationCode }
}

// 每个页面实例独立持有状态，基础区和手动激活区继续共享选中值；KeepAlive 可保留它们。
const key: InjectionKey<ReturnType<typeof createTabsExamples>> = Symbol('tabs-examples')
export function provideTabsExamples() { provide(key, createTabsExamples()) }
export function useTabsExamples() {
  const state = inject(key)
  if (!state) throw new Error('Tabs 示例必须由文档页面提供状态')
  return state
}
