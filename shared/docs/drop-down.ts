import type { DocsApiTables } from './types'

const propsRows = [
  ['hoverOpenDelay', 'number', '80', '主菜单悬停打开延迟，单位毫秒；子菜单独立等待 100ms，防止掠过误开。'],
  ['hoverCloseDelay', 'number', '110', '悬停离开关闭延迟，单位毫秒；向子菜单斜向移动时保留进入机会。'],
  ['typeahead', 'boolean', 'true', '菜单项聚焦时按文字前缀定位；自定义输入框的按键不拦截。外部编辑器管理键盘时可关闭。'],
  ['highlightMotion', 'BingDropDownHighlightMotion', "'liquid'", '菜单高亮使用 liquid 或 slide；减少动态效果时直接更新。'],
  ['open', 'boolean | null', 'null', '控制菜单打开状态。null 表示内部自管理，boolean 表示受控模式。'],
  ['context', 'unknown | null', 'undefined（内部为 null）', '上下文数据；内部会立即更新，再发送 update:context。关闭动画结束后清为 null。'],
  ['trigger', "'click' | 'hover' | 'contextmenu'", "'click'", '触发方式。contextmenu 需要使用 getTriggerProps(context)。'],
  ['placement', 'BingDropDownPlacement', "'bottom-start'", '面板相对锚点的方向和对齐方式。bottom/top 的 end 右边缘对齐，left/right 的 end 底边对齐；空间不足时翻转或避让边缘。'],
  ['anchor', 'BingDropDownAnchor | null', 'undefined', '0.15.0：真实元素或提供 getBoundingClientRect() 的虚拟锚点，优先于根节点/右键坐标。返回客户端视口矩形；替换对象、滚动或 resize 后重新定位。'],
  ['boundary', 'BingDropDownAnchor | null', 'undefined', '0.15.0：菜单可用区域，与窗口取交集、四周留 12px；限制宽度和高度，空间不足时翻转，选项通过 BingScrollbar 滚动。仅限制主菜单，不限制 Teleport 子菜单。'],
  ['size', "'sm' | 'md' | 'lg'", "undefined（继承 ConfigProvider，否则 'md'）", '菜单项最小高度 sm/md/lg 为 28/32/36px；说明等额外内容可增高。'],
  ['width', 'string | number', 'undefined', '面板固定宽度，数字会转成 px。'],
  ['minWidth', 'string | number', 'undefined', '面板最小宽度，数字会转成 px；主题回退为 220px，内部 body 不再强制 264px 最小宽度。'],
  ['maxWidth', 'string | number', 'undefined', '默认最大 380px；与 minWidth、width 一起受可用区域限制，长内容在 BingScrollbar 中滚动。'],
  ['panelClass', 'string', 'undefined', '追加到浮层面板上的 class，适合局部覆盖菜单宽度、阴影或内部间距。'],
  ['block', 'boolean', 'false', '根节点是否撑满父容器。'],
  ['closeOnOutside', 'boolean', 'true', '外部 pointerdown 是否请求关闭；同一菜单的子菜单也算内部。'],
  ['closeOnEscape', 'boolean', 'true', '按 Escape 时是否关闭。'],
  ['autoFocus', 'boolean', 'false', '开启后聚焦第一项。方向键、键盘右键及普通区域右键会主动聚焦；默认在编辑区鼠标右键时保留输入焦点。'],
  ['loop', 'boolean', 'true', '当前菜单上下键到边界时循环；跳过 disabled 项。'],
  ['ariaLabel', 'string', "'下拉菜单'", '传给菜单面板的可访问名称。'],
  ['glass', 'boolean', 'true', '是否开启玻璃效果。'],
  ['glassBlur', 'string | number', 'undefined（主题默认 16）', '玻璃模糊强度；数字转换为 px。'],
  ['glassOpacity', 'number', 'undefined（浅色 0.86 / 深色 0.92）', '玻璃底色不透明度。'],
  ['glassSaturation', 'number', 'undefined（主题默认 1.05）', '玻璃饱和度。'],
]

const itemRows = [
  ['type', 'BingDropDownItemType', "'item'", 'item 普通操作；radio 互斥当前值；checkbox 开关。选中值由业务维护。'],
  ['checked', 'boolean', 'false', 'radio / checkbox 的选中状态及 aria-checked；点击只通知业务，不自动修改。'],
  ['textValue', 'string', 'undefined', '前缀匹配文本，默认 title；可填写拼音或别名。'],
  ['title', 'string', 'undefined', '菜单项主标题，也可以直接用默认插槽替代。'],
  ['description', 'string', 'undefined', '菜单项辅助说明。'],
  ['shortcut', 'string | string[]', 'undefined', '用键帽展示快捷键；不注册快捷键操作。'],
  ['icon', 'Component', 'undefined', '左侧图标组件。'],
  ['href', 'string', 'undefined', '存在 href 且未禁用时，菜单项会渲染为链接。'],
  ['target', 'string', 'undefined', '链接打开方式。'],
  ['rel', 'string', 'undefined', '链接 rel；target 为 _blank 时默认补 noreferrer noopener。'],
  ['tone', "'default' | 'primary' | 'secondary' | 'danger' | 'success' | 'warning'", "'default'", '菜单项语义色。'],
  ['disabled', 'boolean', 'false', '禁用菜单项。'],
  ['active', 'boolean', 'false', '样式与 aria-current 标记；不维护选中模型。0.15.0 起指定 boundary 时，当前项变化会在菜单内部滚动揭示，不移动输入焦点。'],
  ['closeOnClick', 'boolean', 'undefined', '无子菜单时默认关闭，false 保留；click 中 preventDefault 也可阻止自动关闭。当前有 submenu 时即使传 true 也不会自动关闭。'],
  ['ariaLabel', 'string', 'undefined', '菜单项可访问名称。'],
]

const slotRows = [
  ['BingDropDownGroup.default / label', '-', '默认插槽包含菜单项；label 插槽替代同名 label 属性，提供可访问分组标题。'],
  ['BingDropDownDivider', '-', '分隔线组件，无业务属性或插槽，渲染 separator。'],
  ['trigger', '{ open, context, triggerProps, getTriggerProps, openPanel, close, toggle }', '渲染触发器。普通模式直接绑定 triggerProps；右键菜单用 getTriggerProps(context)。'],
  ['default', '{ context: unknown; close: (restoreFocus?: boolean) => void }', '渲染菜单内容；context 先做类型检查。close(true) 可请求恢复最近记录的触发器焦点。'],
  ['header', '-', '面板头部区域。'],
  ['footer', '-', '面板底部区域。'],
  ['BingDropDownItem.default', '-', '替代 title 属性展示标题内容。'],
  ['BingDropDownItem.prefix', '-', '自定义菜单项左侧内容。'],
  ['BingDropDownItem.description', '-', '自定义菜单项说明。'],
  ['BingDropDownItem.suffix', '-', '自定义菜单项右侧内容。'],
  ['BingDropDownItem.submenu', '-', '渲染子菜单内容。'],
]

const eventRows = [
  ['update:open', 'boolean', '组件请求改变状态时触发；受控模式需接收更新。外部直接修改 open 不补发。'],
  ['update:context', 'unknown | null', '右键打开或换目标时发出；关闭动画完成后非空上下文会再更新为 null。'],
  ['open', '-', '有效打开状态从 false 变为 true 时触发；初始 open=true 不发出初次 open。'],
  ['close', '-', '有效打开状态从 true 变为 false 时触发，早于关闭动画结束。'],
  ['context-open', 'BingDropDownContextOpenPayload', '每次右键或键盘右键打开时触发，包含事件、上下文及原始 clientX/clientY 或触发器左下角坐标；实际面板还会偏移和避让。'],
  ['after-enter', '-', '打开动画结束后触发。'],
  ['after-leave', '-', '关闭动画结束后触发。'],
  ['BingDropDownItem.click', 'MouseEvent', '未禁用时点击触发，先于自动关闭；只通知业务，不自动执行同名操作。'],
]

const exposeRows = [
  ['openPanel()', '打开面板。'],
  ['close()', '关闭面板。'],
  ['toggle()', '切换打开状态。'],
  ['focusFirstItem()', '聚焦已挂载主菜单的第一个启用项；不负责打开，方法打开后等 nextTick 再调用或使用 autoFocus。'],
]

export const dropDownApi: DocsApiTables = {
  props: { headers: ["属性","类型","默认值","说明"], codeColumns: 3, rows: propsRows },
  item: { headers: ["属性","类型","默认值","说明"], codeColumns: 3, rows: itemRows },
  slots: { headers: ["插槽","参数","说明"], codeColumns: 2, rows: slotRows },
  events: { headers: ["事件","参数","说明"], codeColumns: 2, rows: eventRows },
  expose: { headers: ["方法","说明"], codeColumns: 1, rows: exposeRows },
  types: { headers: ['类型', '说明'], codeColumns: 1, rows: [
    ['BingDropDownHighlightMotion', "'liquid' | 'slide'。"],
    ['BingDropDownItemType', "'item' | 'radio' | 'checkbox'。"],
    ['BingDropDownGroupProps', '{ label?: string }，组名也可用 label 插槽；默认插槽放置菜单项。'],
    ['BingDropDownAnchor', '0.15.0：{ getBoundingClientRect: () => Pick<DOMRect, "top" | "right" | "bottom" | "left" | "width" | "height"> }，可直接传 HTMLElement。'],
    ['BingDropDownPlacement', 'bottom-start | bottom-end | top-start | top-end | left-start | left-end | right-start | right-end。'],
    ['BingDropDownSize', 'sm | md | lg。'],
    ['BingDropDownTrigger', 'click | hover | contextmenu。'],
    ['BingDropDownItemTone', 'default | primary | secondary | danger | success | warning。'],
    ['BingDropDownProps / BingDropDownItemProps', '菜单与菜单项属性类型。'],
    ['BingDropDownEmits / BingDropDownItemEmits', '菜单与菜单项事件载荷元组。'],
    ['BingDropDownExpose', '公开实例方法；其中 close 类型为 () => void。'],
    ['BingDropDownContextOpenPayload', '{ event: MouseEvent | KeyboardEvent; context: unknown | null; x: number; y: number }。'],
  ] },
}
