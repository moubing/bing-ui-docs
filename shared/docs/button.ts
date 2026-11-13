import type { DocsApiTables } from './types'

const propsRows = [
  ['textSwap', 'boolean', 'false', '文案变化时逐字过渡，按钮宽度平滑伸缩；独立于 textEffect，默认关闭。'],
  ['variant', "'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger' | 'success' | 'warning'", "'primary'", '控制按钮视觉类型。'],
  ['size', "'xs' | 'sm' | 'md' | 'lg' | 'xl'", "继承 FormItem / Form / ConfigProvider，否则 'md'", '高度依次为 28 / 32 / 36 / 40 / 44px；显式设置优先。ConfigProvider 只提供 sm / md / lg，xs / xl 需显式设置。'],
  ['rounded', "'none' | 'sm' | 'md' | 'lg' | 'full'", "'md'", '控制圆角等级。'],
  ['htmlType', "'button' | 'submit' | 'reset'", "'button'", '映射原生 button 的 type。'],
  ['disabled', 'boolean', '继承 FormItem / Form，否则 false', '禁用按钮并阻止 click；显式 false 可覆盖继承。'],
  ['loading', 'boolean', 'false', '按钮不可点击；有文字时临时使用循环 jump，纯图标按钮显示加载图标。'],
  ['block', 'boolean', 'false', '按钮宽度撑满父容器。'],
  ['throttle', 'boolean', 'false', '显式开启后拦截间隔内的重复点击。'],
  ['throttleDelay', 'number', '600', '点击节流间隔，单位毫秒。'],
  ['textEffect', "'none' | 'shine' | 'jump'", 'undefined', '未设置时 primary 默认 shine；有文字的 loading 状态临时覆盖为 jump。'],
  ['textEffectTrigger', "'always' | 'hover'", 'undefined', '文字动效触发方式。jump 默认 hover，shine 会根据 textShine 推导。'],
  ['textShine', "'none' | 'hover' | 'always'", 'primary: always; others: none', 'shine 文字效果的快捷配置。'],
  ['shineColor', 'string', 'undefined', '文字扫光高光颜色。'],
  ['shineBaseColor', 'string', 'undefined', '文字扫光基础颜色。'],
  ['shineSpeed', 'number', '1.6', '文字扫光单次时长，单位秒。'],
  ['shineDelay', 'number', '0', '文字扫光首次播放前的延迟，单位秒。'],
  ['shineInterval', 'number', '2.4', 'always 模式下每次扫光之间的间隔，单位秒。'],
  ['shineDirection', "'left' | 'right'", "'left'", '文字扫光方向。'],
  ['shineAngle', 'number', '120', '文字扫光渐变角度。'],
  ['textJumpY', 'number', '-6', '字符跳动的垂直位移，单位 px。'],
  ['textJumpStagger', 'number', '0.035', '字符之间的错峰时间，单位秒。'],
  ['textJumpDuration', 'number', '0.34', '单个字符跳起并回落的总时长。'],
  ['textJumpEase', 'string', "'power2.out'", '字符上跳阶段使用的 GSAP ease。'],
  ['textJumpReturnEase', 'string', "'back.out(2.4)'", '字符回落阶段使用的 GSAP ease。'],
  ['textJumpRepeatDelay', 'number', '1.2', 'always 模式下每轮跳动之间的间隔。'],
  ['ariaLabel', 'string', 'undefined', '图标按钮或无可见文本按钮的可访问名称。'],
]

const slotRows = [
  ['default', '按钮主内容，会经过 BingAnimatedText 渲染。'],
  ['prefix', '按钮左侧内容，通常放图标或状态标记。'],
  ['suffix', '按钮右侧内容，通常放箭头或辅助图标。'],
]

const eventRows = [
  ['click', 'MouseEvent', '按钮可用且未被节流拦截时，在原事件中同步触发；不等待碎屑播放结束。'],
  ['throttled', '{ event: MouseEvent; remaining: number }', '连续点击被节流拦截时触发。'],
  ['focus', 'FocusEvent', '按钮获得焦点时触发。'],
  ['blur', 'FocusEvent', '按钮失去焦点时触发。'],
]

export const buttonApi: DocsApiTables = {
  props: { headers: ["属性","类型","默认值","说明"], codeColumns: 3, rows: propsRows },
  slots: { headers: ["插槽","说明"], codeColumns: 1, rows: slotRows },
  events: { headers: ["事件","参数","说明"], codeColumns: 2, rows: eventRows },
}
