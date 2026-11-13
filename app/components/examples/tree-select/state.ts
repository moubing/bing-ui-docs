import { computed, reactive, ref, watch } from 'vue'
import { BingInput, BingTag, BingTreeSelect } from '@moubing/bing-ui'
import type { BingRadioValue, BingTreeSelectChangePayload, BingTreeSelectExpandPayload, BingTreeSelectModelValue, BingTreeSelectNode, BingTreeSelectProps, BingTreeSelectSearchable, BingTreeSelectSize, BingTreeSelectVirtualMode } from '@moubing/bing-ui'
import basicCodeSource from '~~/examples/tree-select/basic.vue?raw'
import cascadeCodeSource from '~~/examples/tree-select/cascade.vue?raw'
import customCodeSource from '~~/examples/tree-select/custom.vue?raw'
import virtualCodeSource from '~~/examples/tree-select/virtual.vue?raw'
import panelCodeSource from '~~/examples/tree-select/panel.vue?raw'
import { renderExampleCode } from '#shared/docs/example-code'
import { inject as injectExampleState, provide as provideExampleState, type InjectionKey } from 'vue'

function createExamples() {
  type RadioOption<T extends string> = {
    label: string
    value: T
    description?: string
  }

  type BingTreeSelectPanelAlign = NonNullable<BingTreeSelectProps['panelAlign']>

  type BingTreeSelectPanelPlacement = NonNullable<BingTreeSelectProps['panelPlacement']>

  type ToggleMode = 'auto' | 'true' | 'false'

  type TreeSelectStatus = 'default' | 'success' | 'warning' | 'error'

  const sizeOptions: RadioOption<BingTreeSelectSize>[] = [
    { label: 'sm', value: 'sm' },
    { label: 'md', value: 'md' },
    { label: 'lg', value: 'lg' },
  ]

  const searchableOptions: RadioOption<ToggleMode>[] = [
    { label: 'auto', value: 'auto', description: '节点较多时自动显示搜索。' },
    { label: 'true', value: 'true', description: '始终显示搜索框。' },
    { label: 'false', value: 'false', description: '始终隐藏搜索框。' },
  ]

  const statusOptions: RadioOption<TreeSelectStatus>[] = [
    { label: 'default', value: 'default', description: '默认状态。' },
    { label: 'success', value: 'success', description: '成功状态。' },
    { label: 'warning', value: 'warning', description: '警告状态。' },
    { label: 'error', value: 'error', description: '错误状态。' },
  ]

  const panelPlacementOptions: RadioOption<BingTreeSelectPanelPlacement>[] = [
    { label: 'auto', value: 'auto', description: '根据视口空间自动选择。' },
    { label: 'bottom', value: 'bottom', description: '固定在触发器下方。' },
    { label: 'top', value: 'top', description: '固定在触发器上方。' },
    { label: 'left', value: 'left', description: '固定在触发器左侧。' },
    { label: 'right', value: 'right', description: '固定在触发器右侧。' },
  ]

  const panelAlignOptions: RadioOption<BingTreeSelectPanelAlign>[] = [
    { label: 'start', value: 'start', description: '和触发器起点对齐。' },
    { label: 'middle', value: 'middle', description: '和触发器居中对齐。' },
    { label: 'end', value: 'end', description: '和触发器终点对齐。' },
  ]

  const workspaceTree: BingTreeSelectNode[] = [
    {
      label: '组件库',
      value: 'library',
      description: '组件、主题和文档的主要工作区。',
      meta: {
        类型: '系统',
        状态: '维护中',
      },
      children: [
        {
          label: '基础组件',
          value: 'basic',
          description: '按钮、标签、图标和基础输入。',
          meta: {
            类型: '分组',
          },
          children: [
            { label: 'BingButton', value: 'button', description: '按钮和操作入口。' },
            { label: 'BingTag', value: 'tag', description: '轻量信息标记。' },
            { label: 'BingIcon', value: 'icon', description: '图标包装和语义标签。' },
          ],
        },
        {
          label: '表单组件',
          value: 'form',
          description: '输入、选择和校验相关控件。',
          meta: {
            类型: '分组',
          },
          children: [
            { label: 'BingInput', value: 'input', description: '单行文本输入。' },
            { label: 'BingSelect', value: 'select', description: '扁平选项选择器。' },
            {
              label: 'BingTreeSelect',
              value: 'tree-select',
              description: '层级数据选择器，支持搜索、级联和虚拟滚动。',
              meta: {
                类型: '当前组件',
                级联: '支持',
              },
            },
          ],
        },
      ],
    },
    {
      label: '动效系统',
      value: 'motion',
      description: '页面切换、文本动画和组件反馈。',
      meta: {
        引擎: 'GSAP',
        类型: '体验',
      },
      children: [
        {
          label: '转场组件',
          value: 'transition',
          children: [
            { label: 'AppSwitcherTransition', value: 'app-switcher-transition' },
            { label: 'CarouselTransition', value: 'carousel-transition' },
            { label: 'DeckTransition', value: 'deck-transition' },
          ],
        },
        {
          label: '文本动效',
          value: 'text-motion',
          children: [
            { label: 'BingAnimatedText', value: 'animated-text' },
            { label: '禁用示例', value: 'disabled-motion', disabled: true },
          ],
        },
      ],
    },
    {
      label: '文档结构',
      value: 'docs',
      selectable: false,
      description: '只负责展开层级，本身不可被选中。',
      children: [
        { label: '快速开始', value: 'getting-started' },
        { label: '组件示例', value: 'component-examples' },
        { label: 'API 表格', value: 'api-table' },
      ],
    },
  ]

  const virtualTree: BingTreeSelectNode[] = Array.from({ length: 28 }, (_, groupIndex) => ({
    label: `工作区 ${groupIndex + 1}`,
    value: `workspace-${groupIndex + 1}`,
    description: groupIndex % 2 === 0 ? '设计与研发资源。' : '运营与交付资源。',
    meta: {
      层级: '一级',
      编号: groupIndex + 1,
    },
    children: Array.from({ length: 14 }, (_, itemIndex) => ({
      label: `资源 ${groupIndex + 1}-${itemIndex + 1}`,
      value: `workspace-${groupIndex + 1}-item-${itemIndex + 1}`,
      description: itemIndex % 3 === 0 ? '高频访问节点。' : '普通层级节点。',
      disabled: itemIndex === 12,
      meta: {
        分组: itemIndex % 2 === 0 ? 'A' : 'B',
      },
    })),
  }))

  const basicDemo = reactive({
    placeholder: '请选择组件分组',
    size: 'md' as BingTreeSelectSize,
    searchable: 'auto' as ToggleMode,
    typeahead: true,
    highlightMatches: true,
    status: 'default' as TreeSelectStatus,
    block: true,
    clearable: true,
    showTreeActions: true,
    disabled: false,
    panelMaxHeight: '320',
  })

  const cascadeDemo = reactive({
    checkStrictly: false,
    showSelectAll: true,
    clearable: true,
  })

  const virtualDemo = reactive({
    searchable: true,
    defaultExpandAll: true,
    virtual: 'true' as ToggleMode,
    itemHeight: '',
    panelMaxHeight: '360',
  })

  const panelDemo = reactive({
    placement: 'auto' as BingTreeSelectPanelPlacement,
    align: 'start' as BingTreeSelectPanelAlign,
    gap: '10',
  })

  const singleValue = ref<BingTreeSelectModelValue>('tree-select')

  const cascadeValue = ref<BingTreeSelectModelValue>(['button', 'select'])

  const customValue = ref<BingTreeSelectModelValue>('motion')

  const virtualValue = ref<BingTreeSelectModelValue>([
    'workspace-2-item-3',
    'workspace-8-item-6',
  ])

  const panelValue = ref<BingTreeSelectModelValue>('select')

  const eventLog = ref('等待选择')

  const flatWorkspaceNodes = flattenTree(workspaceTree)

  const flatVirtualNodes = flattenTree(virtualTree)

  const basicSearchable = computed(
    () => parseToggleMode(basicDemo.searchable) as BingTreeSelectSearchable,
  )

  const virtualMode = computed(
    () => parseToggleMode(virtualDemo.virtual) as BingTreeSelectVirtualMode,
  )

  const selectedSingleText = computed(() => getSelectedLabels(singleValue.value, flatWorkspaceNodes))

  const selectedCascadeText = computed(() => getSelectedLabels(cascadeValue.value, flatWorkspaceNodes))

  const selectedCustomText = computed(() => getSelectedLabels(customValue.value, flatWorkspaceNodes))

  const selectedVirtualText = computed(() => getSelectedLabels(virtualValue.value, flatVirtualNodes))

  const selectedPanelText = computed(() => getSelectedLabels(panelValue.value, flatWorkspaceNodes))

  watch(
    () => cascadeDemo.checkStrictly,
    (strict) => {
      cascadeValue.value = strict ? ['library', 'button', 'select'] : ['button', 'select']
    },
  )

  function parseToggleMode(value: ToggleMode) {
    if (value === 'true') {
      return true
    }

    if (value === 'false') {
      return false
    }

    return 'auto'
  }

  function flattenTree(nodes: BingTreeSelectNode[]) {
    const result: BingTreeSelectNode[] = []

    function visit(list: BingTreeSelectNode[]) {
      list.forEach((node) => {
        result.push(node)

        if (node.children?.length) {
          visit(node.children)
        }
      })
    }

    visit(nodes)

    return result
  }

  function normalizeValue(value: BingTreeSelectModelValue) {
    if (Array.isArray(value)) {
      return value
    }

    return value === null ? [] : [value]
  }

  function getSelectedLabels(value: BingTreeSelectModelValue, nodes: BingTreeSelectNode[]) {
    const selectedValues = normalizeValue(value)

    if (!selectedValues.length) {
      return '未选择'
    }

    return selectedValues
      .map((selectedValue) => nodes.find((node) => node.value === selectedValue)?.label ?? selectedValue)
      .join('、')
  }

  function formatValue(value: BingTreeSelectModelValue) {
    return JSON.stringify(value)
  }

  function formatSelectedCount(value: BingTreeSelectModelValue) {
    return normalizeValue(value).length
  }

  function handleBasicChange(payload: BingTreeSelectChangePayload) {
    eventLog.value += ' → ' + `change：${getSelectedLabels(payload.value, flatWorkspaceNodes)}`
  }

  function handleTreeEvent(type: string) {
    eventLog.value += ' → ' + type
  }

  function handleExpand(type: 'expand' | 'collapse', payload: BingTreeSelectExpandPayload) {
    eventLog.value += ' → ' + `${type === 'expand' ? '展开' : '收起'}：${payload.node.label}`
  }

  function updateControl1(value: BingRadioValue) { basicDemo.size = value as BingTreeSelectSize }

  function updateControl2(value: BingRadioValue) { basicDemo.searchable = value as ToggleMode }

  function updateControl3(value: BingRadioValue) { basicDemo.status = value as TreeSelectStatus }

  function updateControl4(value: BingRadioValue) { virtualDemo.virtual = value as ToggleMode }

  function updateControl5(value: BingRadioValue) { panelDemo.placement = value as BingTreeSelectPanelPlacement }

  function updateControl6(value: BingRadioValue) { panelDemo.align = value as BingTreeSelectPanelAlign }

  function toNumberText(value: string) {
    const numberValue = Number(value)

    return Number.isFinite(numberValue) ? numberValue : 0
  }

  function metaValue(node: BingTreeSelectNode, key: string) {
    const value = node.meta?.[key]

    return value === undefined || value === null ? '' : String(value)
  }

  const basicCode = computed(() => renderExampleCode(basicCodeSource, { placeholder: basicDemo.placeholder, size: basicDemo.size, searchable: basicSearchable.value,
    typeahead: basicDemo.typeahead,
    highlightMatches: basicDemo.highlightMatches, status: basicDemo.status, block: basicDemo.block, clearable: basicDemo.clearable, showTreeActions: basicDemo.showTreeActions, disabled: basicDemo.disabled, panelMaxHeight: toNumberText(basicDemo.panelMaxHeight) }))

  const cascadeCode = computed(() => renderExampleCode(cascadeCodeSource, { checkStrictly: cascadeDemo.checkStrictly, showSelectAll: cascadeDemo.showSelectAll, clearable: cascadeDemo.clearable }))

  const customCode = customCodeSource.trim()

  const virtualCode = computed(() => renderExampleCode(virtualCodeSource, { defaultExpandAll: virtualDemo.defaultExpandAll, virtual: virtualMode.value, virtualItemHeight: virtualDemo.itemHeight.trim() ? toNumberText(virtualDemo.itemHeight) : undefined, panelMaxHeight: toNumberText(virtualDemo.panelMaxHeight) }))

  const panelCode = computed(() => renderExampleCode(panelCodeSource, { panelPlacement: panelDemo.placement, panelAlign: panelDemo.align, panelGap: toNumberText(panelDemo.gap) }))
  return { sizeOptions, searchableOptions, statusOptions, panelPlacementOptions, panelAlignOptions, workspaceTree, virtualTree, basicDemo, cascadeDemo, virtualDemo, panelDemo, singleValue, cascadeValue, customValue, virtualValue, panelValue, eventLog, flatWorkspaceNodes, flatVirtualNodes, basicSearchable, virtualMode, selectedSingleText, selectedCascadeText, selectedCustomText, selectedVirtualText, selectedPanelText, parseToggleMode, flattenTree, normalizeValue, getSelectedLabels, formatValue, formatSelectedCount, handleBasicChange, handleTreeEvent, handleExpand, updateControl1, updateControl2, updateControl3, updateControl4, updateControl5, updateControl6, toNumberText, metaValue, basicCode, cascadeCode, customCode, virtualCode, panelCode }
}
const key: InjectionKey<ReturnType<typeof createExamples>> = Symbol('tree-select-examples')
export function provideExamples() { provideExampleState(key, createExamples()) }
export function useExamples() {
  const state = injectExampleState(key)
  if (!state) throw new Error('示例需要文档页面提供状态')
  return state
}
