import { computed, reactive, ref } from 'vue'
import type { BingRadioValue, BingSelectChangePayload, BingSelectModelValue, BingSelectOption, BingSelectProps, BingSelectSize, BingSelectVirtualMode } from '@moubing/bing-ui'
import playgroundCodeSource from '~~/examples/select/basic.vue?raw'
import multipleCodeSource from '~~/examples/select/multiple.vue?raw'
import detailCodeSource from '~~/examples/select/detail.vue?raw'
import virtualCodeSource from '~~/examples/select/virtual.vue?raw'
import panelCodeSource from '~~/examples/select/panel.vue?raw'
import sizesCodeSource from '~~/examples/select/sizes.vue?raw'
import eventsCodeSource from '~~/examples/select/events.vue?raw'
import { renderExampleCode } from '#shared/docs/example-code'
import { inject as injectExampleState, provide as provideExampleState, type InjectionKey } from 'vue'

function createExamples() {
  type RadioOption<T extends string> = {
    label: string
    value: T
    description?: string
  }

  type BingSelectPanelAlign = NonNullable<BingSelectProps['panelAlign']>

  type BingSelectPanelPlacement = NonNullable<BingSelectProps['panelPlacement']>

  type SelectStatus = 'default' | 'error' | 'success' | 'warning'

  type ToggleMode = 'auto' | 'true' | 'false'

  type SelectSearchable = NonNullable<BingSelectProps['searchable']>

  const sizeOptions: RadioOption<BingSelectSize>[] = [
    { label: 'sm', value: 'sm' },
    { label: 'md', value: 'md' },
    { label: 'lg', value: 'lg' },
  ]

  const statusOptions: RadioOption<SelectStatus>[] = [
    { label: 'default', value: 'default', description: '默认状态。' },
    { label: 'success', value: 'success', description: '成功状态。' },
    { label: 'warning', value: 'warning', description: '警告状态。' },
    { label: 'error', value: 'error', description: '错误状态。' },
  ]

  const modeOptions: RadioOption<ToggleMode>[] = [
    { label: 'auto', value: 'auto', description: '根据选项数量自动判断。' },
    { label: 'true', value: 'true', description: '始终开启。' },
    { label: 'false', value: 'false', description: '始终关闭。' },
  ]

  const panelPlacementOptions: RadioOption<BingSelectPanelPlacement>[] = [
    { label: 'auto', value: 'auto', description: '根据视口空间自动选择。' },
    { label: 'bottom', value: 'bottom', description: '固定在触发器下方。' },
    { label: 'top', value: 'top', description: '固定在触发器上方。' },
    { label: 'left', value: 'left', description: '固定在触发器左侧。' },
    { label: 'right', value: 'right', description: '固定在触发器右侧。' },
  ]

  const panelAlignOptions: RadioOption<BingSelectPanelAlign>[] = [
    { label: 'start', value: 'start', description: '和触发器起点对齐。' },
    { label: 'middle', value: 'middle', description: '和触发器居中对齐。' },
    { label: 'end', value: 'end', description: '和触发器终点对齐。' },
  ]

  const cityOptions: BingSelectOption[] = [
    {
      label: '上海',
      value: 'shanghai',
      description: '华东业务中心',
      detail: '适合放置销售、交付和活动运营团队。',
      meta: {
        区域: '华东',
        等级: '核心',
      },
    },
    {
      label: '深圳',
      value: 'shenzhen',
      description: '产品与研发中心',
      detail: '适合放置研发、设计和增长团队。',
      meta: {
        区域: '华南',
        等级: '核心',
      },
    },
    {
      label: '成都',
      value: 'chengdu',
      description: '内容与支持中心',
      detail: '适合放置内容运营和客户支持团队。',
      meta: {
        区域: '西南',
        等级: '扩展',
      },
    },
    {
      label: '杭州',
      value: 'hangzhou',
      description: '生态合作中心',
      detail: '适合放置生态合作、渠道和社区团队。',
      meta: {
        区域: '华东',
        等级: '扩展',
      },
    },
    {
      label: '北京',
      value: 'beijing',
      description: '暂不可选',
      disabled: true,
    },
  ]

  const roleOptions: BingSelectOption[] = [
    { label: '设计系统', value: 'design-system', description: '组件规范、主题和交互标准。' },
    { label: '前端开发', value: 'frontend', description: '页面开发和组件接入。' },
    { label: '后端接口', value: 'backend', description: '接口、权限和数据模型。' },
    { label: '产品运营', value: 'operation', description: '内容配置和活动上线。' },
    { label: '质量保障', value: 'qa', description: '测试计划和回归验证。' },
  ]

  const detailOptions: BingSelectOption[] = [
    {
      label: '柔和入场',
      value: 'soft-enter',
      description: '低干扰的页面进入动效。',
      detail: '适合数据面板、设置页和需要保持安静的业务页面。',
      meta: {
        时长: '0.72s',
        层级: '页面',
      },
    },
    {
      label: '点击反馈',
      value: 'click-feedback',
      description: '快速确认用户操作。',
      detail: '适合按钮、标签、列表项这类频繁交互元素。',
      meta: {
        时长: '0.18s',
        层级: '控件',
      },
    },
    {
      label: '悬停提示',
      value: 'hover-detail',
      description: '在不打断流程的情况下展示补充信息。',
      detail: '适合选项很多、但每个选项都需要解释的选择器。',
      meta: {
        时长: '0.24s',
        层级: '浮层',
      },
    },
    {
      label: '危险操作',
      value: 'danger-action',
      description: '需要二次确认的操作。',
      detail: '这里作为禁用项示例，真实业务中可搭配权限或状态判断。',
      disabled: true,
      meta: {
        状态: '禁用',
      },
    },
  ]

  const virtualOptions: BingSelectOption[] = Array.from({ length: 160 }, (_, index) => ({
    label: `虚拟选项 ${index + 1}`,
    value: `virtual-${index + 1}`,
    description: index % 2 === 0 ? '高频选项' : '低频选项',
    detail: `这是第 ${index + 1} 个选项，面板只渲染当前视口附近的行。`,
    meta: {
      序号: index + 1,
      分组: index % 2 === 0 ? 'A' : 'B',
    },
    disabled: index % 23 === 0,
  }))

  const playground = reactive({
    placeholder: '请选择城市',
    size: 'md' as BingSelectSize,
    searchable: 'auto' as ToggleMode,
    typeahead: true,
    highlightMatches: true,
    status: 'default' as SelectStatus,
    clearable: true,
    block: true,
    glass: true,
    disabled: false,
  })

  const multipleDemo = reactive({
    showSelectAll: true,
    searchable: true,
    clearable: true,
  })

  const virtualDemo = reactive({
    virtual: 'true' as ToggleMode,
    itemHeight: '',
    panelMaxHeight: '320',
  })

  const panelDemo = reactive({
    placement: 'auto' as BingSelectPanelPlacement,
    align: 'start' as BingSelectPanelAlign,
    gap: '10',
  })

  const singleValue = ref<BingSelectModelValue>('shenzhen')

  const multipleValue = ref<BingSelectModelValue>(['design-system', 'frontend'])

  const detailValue = ref<BingSelectModelValue>('soft-enter')

  const virtualValue = ref<BingSelectModelValue>(['virtual-2', 'virtual-18'])

  const panelValue = ref<BingSelectModelValue>('shanghai')

  const smallValue = ref<BingSelectModelValue>('shanghai')

  const mediumValue = ref<BingSelectModelValue>('shenzhen')

  const largeValue = ref<BingSelectModelValue>('chengdu')

  const eventValue = ref<BingSelectModelValue>('soft-enter')

  const eventLog = ref('等待选择')

  const selectedCityLabel = computed(() => getSelectedLabels(singleValue.value, cityOptions))

  const selectedRoleLabel = computed(() => getSelectedLabels(multipleValue.value, roleOptions))

  const selectedDetailLabel = computed(() => getSelectedLabels(detailValue.value, detailOptions))

  const selectedVirtualLabel = computed(() => getSelectedLabels(virtualValue.value, virtualOptions))

  const selectedPanelLabel = computed(() => getSelectedLabels(panelValue.value, cityOptions))

  const playgroundSearchable = computed(() => parseMode(playground.searchable) as SelectSearchable)

  const virtualMode = computed(() => parseMode(virtualDemo.virtual) as BingSelectVirtualMode)

  function updateSize(value: BingRadioValue) {
    playground.size = value as BingSelectSize
  }

  function updateSearchable(value: BingRadioValue) {
    playground.searchable = value as ToggleMode
  }

  function updateStatus(value: BingRadioValue) {
    playground.status = value as SelectStatus
  }

  function updateVirtual(value: BingRadioValue) {
    virtualDemo.virtual = value as ToggleMode
  }

  function updatePanelPlacement(value: BingRadioValue) {
    panelDemo.placement = value as BingSelectPanelPlacement
  }

  function updatePanelAlign(value: BingRadioValue) {
    panelDemo.align = value as BingSelectPanelAlign
  }

  function parseMode(value: ToggleMode) {
    if (value === 'true') {
      return true
    }

    if (value === 'false') {
      return false
    }

    return 'auto'
  }

  function handleChange(payload: BingSelectChangePayload) {
    const labels = payload.options.map((option) => option.label).join('、') || '无'
    eventLog.value += ' → ' + `change：${labels}`
  }

  function handleClear() {
    eventLog.value += ' → ' + 'clear：已清空'
  }

  function handleOpen() {
    eventLog.value += ' → ' + 'open：面板已打开'
  }

  function handleClose() {
    eventLog.value += ' → ' + 'close：面板已关闭'
  }

  function getSelectedLabels(value: BingSelectModelValue, options: BingSelectOption[]) {
    const values = Array.isArray(value) ? value : value === null ? [] : [value]
    const labels = options
      .filter((option) => values.includes(option.value))
      .map((option) => option.label)

    return labels.length ? labels.join('、') : '未选择'
  }

  function toNumberText(value: string) {
    const numericValue = Number(value)

    if (Number.isNaN(numericValue)) {
      return 0
    }

    return numericValue
  }

  const virtualItemHeight = computed(() => virtualDemo.itemHeight.trim() === '' ? undefined : toNumberText(virtualDemo.itemHeight))

  const playgroundCode = computed(() => renderExampleCode(playgroundCodeSource, { placeholder: playground.placeholder, size: playground.size, searchable: playgroundSearchable.value, typeahead: playground.typeahead, highlightMatches: playground.highlightMatches, status: playground.status, clearable: playground.clearable, block: playground.block, glass: playground.glass, disabled: playground.disabled }))

  const multipleCode = computed(() => renderExampleCode(multipleCodeSource, { showSelectAll: multipleDemo.showSelectAll, searchable: multipleDemo.searchable, clearable: multipleDemo.clearable }))

  const detailCode = detailCodeSource.trim()

  const virtualCode = computed(() => renderExampleCode(virtualCodeSource, { virtual: virtualMode.value, virtualItemHeight: virtualItemHeight.value, panelMaxHeight: toNumberText(virtualDemo.panelMaxHeight) }))

  const panelCode = computed(() => renderExampleCode(panelCodeSource, { panelPlacement: panelDemo.placement, panelAlign: panelDemo.align, panelGap: toNumberText(panelDemo.gap) }))

  const sizesCode = sizesCodeSource.trim()

  const eventsCode = eventsCodeSource.trim()
  return { sizeOptions, statusOptions, modeOptions, panelPlacementOptions, panelAlignOptions, cityOptions, roleOptions, detailOptions, virtualOptions, playground, multipleDemo, virtualDemo, panelDemo, singleValue, multipleValue, detailValue, virtualValue, panelValue, smallValue, mediumValue, largeValue, eventValue, eventLog, selectedCityLabel, selectedRoleLabel, selectedDetailLabel, selectedVirtualLabel, selectedPanelLabel, playgroundSearchable, virtualMode, virtualItemHeight, updateSize, updateSearchable, updateStatus, updateVirtual, updatePanelPlacement, updatePanelAlign, parseMode, handleChange, handleClear, handleOpen, handleClose, getSelectedLabels, toNumberText, playgroundCode, multipleCode, detailCode, virtualCode, panelCode, sizesCode, eventsCode }
}
const key: InjectionKey<ReturnType<typeof createExamples>> = Symbol('select-examples')
export function provideExamples() { provideExampleState(key, createExamples()) }
export function useExamples() {
  const state = injectExampleState(key)
  if (!state) throw new Error('示例需要文档页面提供状态')
  return state
}
