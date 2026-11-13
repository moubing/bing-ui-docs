import type { DocsApiTables } from './types'

const propsRows = [
  ['hoverTarget', 'string | HTMLElement | null', 'undefined', 'hover 与键盘焦点的感应区域；选择器从文字向上 closest 查找，默认文字自身。'],
  ['followPointer', 'boolean', 'true', 'hover 时 jump 从最近字符扩散，shine 从指针进入侧扫入；false 使用固定方向。'],
  ['swap', 'boolean', 'false', '纯文本更新时保留字符平移、删除字符淡出、新增字符翻入；不延迟数据更新。'],
  ['effect', "'none' | 'shine' | 'shimmer' | 'jump'", "'none'", 'shine 保持原色扫光；shimmer 减淡常态文字并扫过原色光带；jump 逐字跳跃。'],
  ['trigger', "'always' | 'hover' | 'once'", "'always'", '控制动画播放时机。'],
  ['disabled', 'boolean', 'false', '停止动画并清理装饰副本，保留原始文本。'],
  ['shineColor', 'string', 'undefined', 'shine 高光颜色。'],
  ['shineBaseColor', 'string', 'undefined', 'shine 基础文字颜色。'],
  ['shineSpeed', 'number', '1.6', 'shine 扫光时长，秒，最小 0.1。'],
  ['shineDelay', 'number', '0', '首轮扫光等待时间，单位秒，负值按 0；hover 每次触发也等待此值，always 后续轮次不使用此延迟。'],
  ['shineInterval', 'number', '2.4', 'always 下两轮扫光之间的间隔，秒，最小 0。'],
  ['shineDirection', "'left' | 'right'", "'left'", 'shine 扫光方向。'],
  ['shineAngle', 'number', '120', 'shine 渐变角度。'],
  ['jumpY', 'number', '-6', '字符跳动偏移，单位 px；负值向上，正值向下。组件只按向上的距离预留空间。'],
  ['jumpStagger', 'number', '0.035', '字符之间的错峰，秒，最小 0。'],
  ['jumpDuration', 'number', '0.34', '单字符一轮时长，秒，至少 0.1；上行占 45%，回落占 55%，全轮另加错峰时间。'],
  ['jumpEase', 'string', "'power2.out'", '字符上行时使用的 GSAP ease。'],
  ['jumpReturnEase', 'string', "'back.out(2.4)'", '字符回落时使用的 GSAP ease。'],
  ['jumpRepeatDelay', 'number', '1.2', 'always 下两轮 jump 之间的间隔，秒，最小 0。'],
]

export const animatedTextApi: DocsApiTables = {
  props: { headers: ["属性","类型","默认值","说明"], codeColumns: 3, rows: propsRows },
  slots: { headers: ['插槽', '参数', '说明'], codeColumns: 2, rows: [
    ['default', '-', '文本内容；jump 拆成词/字符。优先用短纯文本，避免把交互控件放进被拆分的区域。'],
  ] },
  types: { headers: ['公开类型', '取值或说明'], codeColumns: 1, rows: [
    ['BingAnimatedTextExpose', 'play(origin?: BingAnimatedTextPlayOrigin): void，手动播放当前效果。'],
    ['BingAnimatedTextPlayOrigin', '{ clientX: number; clientY: number }；可直接传 MouseEvent / PointerEvent。'],
    ['BingAnimatedTextProps', '19 项可选属性，见上表。'],
    ['BingAnimatedTextEffect', "'none' | 'shine' | 'shimmer' | 'jump'。"],
    ['BingAnimatedTextTrigger', "'always' | 'hover' | 'once'。"],
    ['BingAnimatedTextShineDirection', "'left' | 'right'。"],
  ] },
}
