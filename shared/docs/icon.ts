import type { DocsApiTables } from './types'

const propsRows = [
  ['icon', 'Component', '必填', '具体图标组件，通常来自 lucide-vue-next 或项目内固化的 SVG/Vue 图标。'],
  ['size', "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number | `${number}px`", "'md'", '图标尺寸。token 会映射为固定 px，数字会转成 px，px 字符串会直接使用。'],
  ['tone', "'inherit' | 'muted' | 'primary' | 'secondary' | 'danger' | 'success' | 'warning'", "'inherit'", '图标语义颜色。inherit 会继承当前文字颜色，其余值使用主题变量。'],
  ['strokeWidth', 'number', '1.75', '线性图标描边粗细，通过图标元素的 CSS stroke-width 设置。'],
  ['decorative', 'boolean', 'true', '是否为装饰性图标。装饰性图标会设置 aria-hidden。'],
  ['label', 'string', 'undefined', '非装饰性图标的可访问名称。decorative=false 且提供 label 时，组件会渲染 role="img"。'],
]

export const iconApi: DocsApiTables = {
  props: { headers: ["属性","类型","默认值","说明"], codeColumns: 3, rows: propsRows },
}
