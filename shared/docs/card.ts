import type { DocsApiTables } from './types'

const propsRows = [
  ['title', 'string', 'undefined', '默认头部标题。'],
  ['description', 'string', 'undefined', '默认头部描述。'],
  ['variant', "'plain' | 'soft' | 'accent' | 'sky'", "'soft'", '控制卡片视觉类型。'],
  ['padding', "'none' | 'sm' | 'md' | 'lg'", "'md'", '控制内容区内边距。'],
  ['rounded', "'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'", "'md'", '控制圆角等级。'],
  ['glass', 'boolean', 'true', '开启玻璃拟态背景和模糊。'],
  ['glassBlur', 'string | number', '主题变量，默认 16px', '玻璃模糊长度；数字转换为非负 px，也可传 CSS 长度字符串。'],
  ['glassOpacity', 'number', '主题变量，浅色 0.86 / 深色 0.92', '玻璃底色不透明度，限制在 0 到 1；显式设置会覆盖主题默认值。'],
  ['glassSaturation', 'number', '主题变量，默认 1.05', '玻璃饱和度，最小为 0。'],
  ['interactive', 'boolean', 'true', '控制交互类名和倾斜处理；不会关闭翻面，也不会自动提供按钮或键盘语义。'],
  ['tilt', 'boolean', 'true', '开启指针跟随的 3D 倾斜。'],
  ['tiltMax', 'number', '8', '最大倾斜角度，单位 deg。'],
  ['tiltScale', 'number', '1.015', '指针悬停时的缩放比例。'],
  ['glare', 'boolean', 'true', '开启跟随指针的高光。'],
  ['entrance', "'none' | 'fade-up' | 'bubble' | 'rotate-up' | 'soft-pop'", "'fade-up'", '进入视口时的动画预设。'],
  ['entranceOnce', 'boolean', 'true', '入场动画是否只播放一次。'],
  ['entranceDelay', 'number', '0', '入场动画延迟，单位秒。'],
  ['entranceDuration', 'number', '0.72', '入场动画时长，单位秒。'],
  ['flipAxis', "'x' | 'y' | 'z'", "'x'", '翻转轴。z 轴在反面渲染时会回退到 y 轴。'],
  ['flipTurns', 'number', '2.5', 'rotate-up 入场动画的翻转圈数。'],
  ['flipEase', 'string', "'power4.out'", 'rotate-up 入场动画使用的 GSAP ease。'],
  ['flipTrigger', "'none' | 'click' | 'press'", "'press'", '翻面触发方式。'],
  ['longPressDelay', 'number', '560', '长按触发翻面前的等待时间，单位毫秒，实际最小为 120。'],
  ['longPressRelease', "'restore' | 'stay'", "'restore'", '长按翻面后，松开时恢复正面或停留当前面。'],
  ['disabled', 'boolean', 'false', '禁用自身翻面、倾斜与入场，卡片表面禁止指针事件；不会设置子控件的 disabled，仍需显式禁止子按钮的键盘操作。'],
]

const slotRows = [
  ['default', '卡片正文内容。'],
  ['media', '卡片顶部媒体区域。'],
  ['header', '自定义头部，会替代 title 和 description 渲染出的默认头部。'],
  ['footer', '底部操作区。'],
  ['back', '翻面后的反面内容。未传入时会显示默认反面占位。'],
]

const eventRows = [
  ['enter', '()', '准备入场时触发；entrance=none 或减少动态效果时也会触发，无参数。'],
  ['long-press', '()', '长按达到触发时间时触发，无参数。'],
  ['flip', "'front' | 'back'", '卡片翻面后触发，参数表示当前面。'],
]

export const cardApi: DocsApiTables = {
  props: { headers: ["属性","类型","默认值","说明"], codeColumns: 3, rows: propsRows },
  slots: { headers: ["插槽","说明"], codeColumns: 1, rows: slotRows },
  events: { headers: ["事件","参数","说明"], codeColumns: 2, rows: eventRows },
}
