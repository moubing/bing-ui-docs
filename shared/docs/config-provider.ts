import type { DocsApiTables } from './types'

export const configProviderApi: DocsApiTables = {
  props: { headers: ['属性', '类型', '默认值', '说明'], codeColumns: 3, rows: [
    ['size', "'sm' | 'md' | 'lg'", 'undefined', '子树内未显式传入 size 的组件使用的默认尺寸。未设置时继承外层 Provider，最外层回落到组件自身的 md。Form / FormItem 的尺寸上下文优先于 Provider。'],
    ['zIndex', 'number', 'undefined（基准 2000）', '浮层层级基准；各类浮层在基准上加固定偏移，见下方层级表。组件显式传入的 zIndex 优先。'],
    ['reducedMotion', "'user' | 'always' | 'never'", "undefined（'user'）", 'JS 驱动动效的减弱策略。user 跟随系统 prefers-reduced-motion，always 始终减少，never 始终完整播放。0.12.4 起共享 Tooltip 面板按对应触发器的局部策略打开、切换和关闭。'],
  ] },
  slots: { headers: ['插槽', '参数', '说明'], codeColumns: 2, rows: [
    ['default', '-', '配置作用的子树。Provider 只提供上下文，不渲染额外的 DOM 元素。'],
  ] },
  sizes: { headers: ['组件', '尺寸解析顺序'], codeColumns: 1, rows: [
    ['BingInput / BingTextarea / BingSelect / BingTreeSelect / BingAutocomplete / BingDatePicker / BingColorPicker', '组件 size → FormItem → Form → Provider → md'],
    ['BingButton / BingCheckbox / BingCheckboxGroup / BingRadio / BingRadioGroup', '组件 size（或所在 Group）→ FormItem → Form → Provider → md；Button 的 xs / xl 只能显式设置。'],
    ['BingForm / BingFormItem', 'Form 的 size → Provider → md；FormItem 继承所在 Form 的解析结果。'],
    ['BingTag / BingTabs / BingTable / BingDropDown', '组件 size → Provider → md（0.12.0 起 props 不再预填 md）。'],
  ] },
  layers: { headers: ['层级', '默认值', '偏移', '使用的组件'], codeColumns: 3, rows: [
    ['dialog', '2000', '+0', 'BingDialog'],
    ['toast', '2100', '+100', 'BingToast 视口'],
    ['filePreview', '2300', '+300', 'BingFilePreview'],
    ['imagePreview', '2400', '+400', 'BingImagePreview'],
    ['colorPicker', '2900', '+900', 'BingColorPicker 面板'],
    ['popover', '3000', '+1000', 'BingSelect、BingTreeSelect、BingAutocomplete、BingDropDown 的面板'],
    ['datePicker', '3100', '+1100', 'BingDatePicker 面板'],
    ['tooltip', '3200', '+1200', 'BingTooltip'],
  ] },
  functions: { headers: ['函数', '类型', '说明'], codeColumns: 2, rows: [
    ['useBingConfig()', '() => { size: ComputedRef<BingConfigSize | undefined>; zIndex: ComputedRef<number>; reducedMotion: ComputedRef<BingReducedMotion> }', '读取最近一层 Provider 合并后的配置；没有 Provider 时 size 为 undefined、zIndex 为 2000、reducedMotion 为 user。需在 Provider 的后代组件 setup 中调用。'],
    ['useReducedMotion(options?)', '(options?: { onChange?: () => void }) => (view?: Pick<Window, \'matchMedia\'> | null) => boolean', '返回实时判断函数，结合 Provider 策略与系统设置。onChange 在系统设置或 reducedMotion 变化时调用，用于重建常驻动画；必须在组件 setup 中调用。'],
    ['prefersReducedMotion(view?)', '(view?: Pick<Window, \'matchMedia\'> | null) => boolean', '只读取系统的 prefers-reduced-motion，不考虑 Provider；服务端或缺少 matchMedia 时返回 false。'],
  ] },
  types: { headers: ['类型', '说明'], codeColumns: 1, rows: [
    ['BingConfigProviderProps', 'Provider 的属性类型，等同 BingConfig。'],
    ['BingConfig', '{ size?: BingConfigSize; zIndex?: number; reducedMotion?: BingReducedMotion }'],
    ['BingConfigSize', "'sm' | 'md' | 'lg'"],
    ['BingReducedMotion', "'user' | 'always' | 'never'"],
  ] },
}
