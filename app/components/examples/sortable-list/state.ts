import { computed, reactive, ref } from 'vue'
import type { BingRadioValue, BingSortableListAxis, BingSortableListKey, BingSortableListPayload, BingSortableListReorderMode } from '@moubing/bing-ui'
import basicCodeSource from '~~/examples/sortable-list/basic.vue?raw'
import disabledCodeSource from '~~/examples/sortable-list/disabled.vue?raw'
import horizontalCodeSource from '~~/examples/sortable-list/horizontal.vue?raw'
import controlledCodeSource from '~~/examples/sortable-list/controlled.vue?raw'
import { renderExampleCode } from '#shared/docs/example-code'
import { inject as injectExampleState, provide as provideExampleState, type InjectionKey } from 'vue'

function createExamples() {
  type RadioOption<T extends string> = {
    label: string
    value: T
    description?: string
  }

  type SortableDemoItem = {
    id: string
    title: string
    meta: string
    tone: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
    locked?: boolean
  }

  const workflowItems: SortableDemoItem[] = [
    {
      id: 'idea',
      title: '需求收集',
      meta: '输入阶段',
      tone: 'primary',
    },
    {
      id: 'design',
      title: '交互设计',
      meta: '方案确认',
      tone: 'secondary',
    },
    {
      id: 'develop',
      title: '开发实现',
      meta: '组件接入',
      tone: 'success',
    },
    {
      id: 'review',
      title: '验收发布',
      meta: '质量检查',
      tone: 'warning',
    },
  ]

  const laneItems: SortableDemoItem[] = [
    {
      id: 'summary',
      title: '摘要',
      meta: '禁止发起排序',
      tone: 'primary',
      locked: true,
    },
    {
      id: 'demo',
      title: '示例',
      meta: '可拖动',
      tone: 'success',
    },
    {
      id: 'api',
      title: 'API',
      meta: '可拖动',
      tone: 'secondary',
    },
    {
      id: 'notes',
      title: '备注',
      meta: '可拖动',
      tone: 'warning',
    },
  ]

  const columnItems: SortableDemoItem[] = [
    { id: 'project', title: '项目', meta: '主列', tone: 'primary' },
    { id: 'owner', title: '负责人', meta: '协作', tone: 'secondary' },
    { id: 'status', title: '状态', meta: '流程', tone: 'success' },
    { id: 'progress', title: '进度', meta: '数值', tone: 'warning' },
    { id: 'risk', title: '风险', meta: '信号', tone: 'danger' },
  ]

  const basicOrder = ref<BingSortableListKey[]>(workflowItems.map((item) => item.id))

  const lockedOrder = ref<BingSortableListKey[]>(laneItems.map((item) => item.id))

  const horizontalOrder = ref<BingSortableListKey[]>(columnItems.map((item) => item.id))

  const controlledOrder = ref<BingSortableListKey[]>(['owner', 'project', 'status', 'progress', 'risk'])

  const basicDemo = reactive({
    axis: 'vertical' as BingSortableListAxis,
    reorderMode: 'drop' as BingSortableListReorderMode,
    keyboard: true,
    flip: true,
    disabled: false,
    dragThreshold: '4',
    duration: '0.26',
    settleDuration: '0.16',
  })

  const lockedDemo = reactive({
    lockByField: true,
    wholeCardHandle: false,
  })

  const horizontalDemo = reactive({
    flip: true,
    keyboard: true,
  })

  const axisOptions: RadioOption<BingSortableListAxis>[] = [
    { label: 'vertical', value: 'vertical', description: '上下排序。' },
    { label: 'horizontal', value: 'horizontal', description: '左右排序。' },
  ]

  const modeOptions: RadioOption<BingSortableListReorderMode>[] = [
    { label: 'drop', value: 'drop', description: '拖拽结束后提交最终顺序。' },
    { label: 'live', value: 'live', description: '拖拽过程中实时提交顺序。' },
  ]

  const disabledItemResolver = computed(() =>
    lockedDemo.lockByField ? (item: SortableDemoItem) => Boolean(item.locked) : undefined,
  )

  const disabledKeys = computed(() => (lockedDemo.lockByField ? [] : ['summary']))

  const basicEventLog = ref('等待排序')

  const lockedEventLog = ref('摘要禁止发起排序，其余项可调整')

  const horizontalEventLog = ref('尝试横向拖动列名')

  const controlledEventLog = ref('外部按钮会直接改写 order')

  const basicOrderText = computed(() => formatOrder(basicOrder.value, workflowItems))

  const lockedOrderText = computed(() => formatOrder(lockedOrder.value, laneItems))

  const horizontalOrderText = computed(() => formatOrder(horizontalOrder.value, columnItems))

  const controlledOrderText = computed(() => formatOrder(controlledOrder.value, columnItems))

  function updateAxis(value: BingRadioValue) {
    basicDemo.axis = value as BingSortableListAxis
  }

  function updateReorderMode(value: BingRadioValue) {
    basicDemo.reorderMode = value as BingSortableListReorderMode
  }

  function handleBasicReorder(payload: BingSortableListPayload<SortableDemoItem>) {
    basicEventLog.value = `reorder：${payload.item.title} 从 ${payload.from + 1} 到 ${payload.to + 1}`
  }

  function handleLockedReorder(payload: BingSortableListPayload<SortableDemoItem>) {
    lockedEventLog.value = `reorder：${payload.item.title} 已移动`
  }

  function handleHorizontalReorder(payload: BingSortableListPayload<SortableDemoItem>) {
    horizontalEventLog.value = `reorder：${payload.item.title} 到第 ${payload.to + 1} 列`
  }

  function handleControlledReorder(payload: BingSortableListPayload<SortableDemoItem>) {
    controlledEventLog.value = `reorder：${payload.item.title} 到第 ${payload.to + 1} 位`
  }

  function resetBasicOrder() {
    basicOrder.value = workflowItems.map((item) => item.id)
    basicEventLog.value = '已重置顺序'
  }

  function reverseBasicOrder() {
    basicOrder.value = [...basicOrder.value].reverse()
    basicEventLog.value = '已反转顺序'
  }

  function moveRiskFirst() {
    controlledOrder.value = ['risk', 'owner', 'project', 'status', 'progress']
    controlledEventLog.value = '风险列已置顶'
  }

  function resetControlledOrder() {
    controlledOrder.value = ['owner', 'project', 'status', 'progress', 'risk']
    controlledEventLog.value = '已恢复默认列顺序'
  }

  function toNumberText(value: string) {
    const numericValue = Number(value)

    if (!Number.isFinite(numericValue)) {
      return 0
    }

    return numericValue
  }

  function formatOrder(order: BingSortableListKey[], items: SortableDemoItem[]) {
    const labelMap = new Map(items.map((item) => [item.id, item.title]))
    return order.map((key) => labelMap.get(String(key)) || key).join(' / ')
  }

  const basicCode = computed(() => renderExampleCode(basicCodeSource, { axis: basicDemo.axis, reorderMode: basicDemo.reorderMode, keyboard: basicDemo.keyboard, flip: basicDemo.flip, disabled: basicDemo.disabled, dragThreshold: toNumberText(basicDemo.dragThreshold), duration: toNumberText(basicDemo.duration), settleDuration: toNumberText(basicDemo.settleDuration) }))

  const disabledCode = computed(() => renderExampleCode(disabledCodeSource, { lockByField: lockedDemo.lockByField, wholeCardHandle: lockedDemo.wholeCardHandle }))

  const horizontalCode = computed(() => renderExampleCode(horizontalCodeSource, { keyboard: horizontalDemo.keyboard, flip: horizontalDemo.flip }))

  const controlledCode = controlledCodeSource.trim()
  return { workflowItems, laneItems, columnItems, basicOrder, lockedOrder, horizontalOrder, controlledOrder, basicDemo, lockedDemo, horizontalDemo, axisOptions, modeOptions, disabledItemResolver, disabledKeys, basicEventLog, lockedEventLog, horizontalEventLog, controlledEventLog, basicOrderText, lockedOrderText, horizontalOrderText, controlledOrderText, updateAxis, updateReorderMode, handleBasicReorder, handleLockedReorder, handleHorizontalReorder, handleControlledReorder, resetBasicOrder, reverseBasicOrder, moveRiskFirst, resetControlledOrder, toNumberText, formatOrder, basicCode, disabledCode, horizontalCode, controlledCode }
}
const key: InjectionKey<ReturnType<typeof createExamples>> = Symbol('sortable-list-examples')
export function provideExamples() { provideExampleState(key, createExamples()) }
export function useExamples() {
  const state = injectExampleState(key)
  if (!state) throw new Error('示例需要文档页面提供状态')
  return state
}
