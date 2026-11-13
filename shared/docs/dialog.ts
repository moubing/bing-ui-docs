import type { DocsApiTables } from './types'

const propsRows = [
  ['transitionOrigin', 'BingDialogTransitionOrigin', "'auto'", 'auto 从当前焦点元素浮起；center 居中，或传元素 / 客户端坐标 { x, y }。'],
  ['initialFocus', 'BingDialogInitialFocus', "'auto'", '优先内容区 autofocus、表单控件，再聚焦面板；支持选择器、元素，false 沿用浮层默认焦点。'],
  ['busy', 'boolean', 'undefined（跟随 confirmLoading）', '拦截用户关闭和重复确认；显式 false 允许加载期间关闭。程序修改模型不受限制。'],
  ['rejectFeedback', 'boolean', 'true', '关闭受阻时播放缩放及描边反馈；自带拒绝反馈的业务可关闭。'],
  ['beforeClose', '(reason: BingDialogCloseReason) => boolean | Promise<boolean>', 'undefined', '用户关闭前检查；false、异常或超过 30 秒均保留弹窗。等待中不重复调用；程序改模型绕过此钩子。'],
  ['modelValue', 'boolean', 'false', '受控打开状态；接收 update:modelValue 或使用 v-model 才会响应关闭请求。'],
  ['title', 'string', 'undefined', '默认标题及 aria-labelledby；自定义标题示例省略此属性，改用 ariaLabel。'],
  ['width', 'string | number', "'520px'", '弹窗宽度；数字会转为 px。移动端会自动撑满可用宽度。'],
  ['maxWidth', 'string | number', 'undefined（CSS 默认 720px）', '覆盖最大宽度，仍受容器和视口约束。900px 宽弹窗需同时设置 width=900、maxWidth=900。'],
  ['height', 'string | number', 'undefined', '固定整体高度，数字为 px；头部和 footer 固定，中部内容滚动。显式高度受可用视口限制。'],
  ['maxHeight', 'string | number', 'undefined', '最大高度，数字为 px，不能超过可视视口减去留白。height/maxHeight 均省略时默认桌面 min(82vh, 760px)、移动端 min(88dvh, 可视视口高度)。'],
  ['zIndex', 'number', "undefined（基准 + 0，默认 2000）", '根节点 z-index；未传时使用 ConfigProvider 的 zIndex 基准。'],
  ['lockScroll', 'boolean', 'true', '打开时锁定 body/html 滚动并补偿滚动条宽度；关闭动画结束后恢复。多个实例共同维护滚动锁，最后一个退出后恢复。'],
  ['smoothScroll', 'boolean | BingScrollbarSmoothOptions', 'true', '内容区平滑滚动；false 关闭插值，对象参数见 BingScrollbar。边界滚轮仍会阻止背景滚动。'],
  ['closeOnOverlay', 'boolean', 'true', '点击遮罩层是否关闭。'],
  ['closeOnEsc', 'boolean', 'true', '按 Escape 是否关闭。'],
  ['closeOnConfirm', 'boolean', 'false', '默认确定按钮或 footer confirm() 是否在发出 confirm 后请求关闭。'],
  ['showClose', 'boolean', 'true', '是否显示右上角关闭按钮。'],
  ['showFooter', 'boolean', 'true', '是否显示默认底部操作区。传入 footer 插槽时仍会渲染自定义底部。'],
  ['cancelText', 'string', "'关闭'", '默认取消按钮文案。'],
  ['confirmText', 'string', "'确定'", '默认确定按钮文案。'],
  ['confirmLoading', 'boolean', 'false', '默认确定按钮加载态，且 busy 未指定时同时保护所有用户关闭入口。'],
  ['confirmDisabled', 'boolean', 'false', '仅禁用默认确定按钮；自定义 footer 按钮需自行禁用。'],
  ['glass', 'boolean', 'true', '已弃用，无视觉效果，下个大版本移除；背景模糊使用 overlayBlur。'],
  ['glassBlur', 'string | number', 'undefined（主题默认 16）', 'overlayBlur 开启时遮罩模糊强度。数字会转为 px。'],
  ['glassOpacity', 'number', 'undefined', '兼容字段；当前主体面板渲染不读取此值。'],
  ['glassSaturation', 'number', 'undefined（主题默认 1.05）', 'overlayBlur 开启时遮罩饱和度。'],
  ['overlayBlur', 'boolean', 'true', '是否启用遮罩背景模糊。关闭后不会渲染 overlayOrbs。'],
  ['overlayOrbs', 'BingDialogOverlayOrb[]', '[]', '遮罩光圈配置；默认无光圈，传入数组后显示。'],
  ['overlayOrbsAnimated', 'boolean', 'false', '是否使用 GSAP 让遮罩光圈小幅漂移。'],
  ['showPeek', 'boolean', 'true', '是否显示“按住查看背景”的按钮。'],
  ['peekOpacity', 'number', '0', '按住查看背景时面板保留的不透明度，限制在 0 到 1；遮罩暂时透明，不改变模型与滚动锁。'],
  ['ariaLabel', 'string', 'undefined', '无 title 或自定义标题时提供 dialog 名称；二者均省略时回退为“对话框”。'],
  ['ariaDescribedby', 'string', 'undefined', '描述元素的 id，业务必须渲染对应元素；可用空格分隔多个 id。'],
]

const orbRows = [
  ['id', 'string', '可选唯一标识，用作 v-for key。'],
  ['color', 'string', '必填，光圈颜色；其余字段可选。'],
  ['x', 'number', '横向位置百分比；默认 50。'],
  ['y', 'number', '纵向位置百分比；默认 50。'],
  ['size', 'number | string', '光圈大小；数字会转成 px。默认 360。'],
  ['opacity', 'number', '默认 0.18；限制在 0 到 1。'],
  ['blur', 'number', '模糊半径 px，默认 64，最小 0。'],
  ['motionX', 'number', '动画横向漂移 px，默认 48，可为负数。'],
  ['motionY', 'number', '动画纵向漂移 px，默认 34，可为负数。'],
  ['duration', 'number', '动画时长秒，默认 12，最小 4。'],
  ['delay', 'number', '动画延迟秒，默认索引乘 0.28，最小 0。'],
]

const slotsRows = [
  ['default', '-', '弹窗主体内容。'],
  ['title', '-', '替换整个默认标题节点；需另外提供有效可访问名称。'],
  ['header-addon', '-', '标题行下方的固定区域，适合分类栏、搜索和摘要，不随正文内容滚动。'],
  ['footer', '{ close: (reason: BingDialogCloseReason) => void; cancel: () => void; confirm: () => void; busy: boolean }', 'showFooter=false 时仍渲染。回调遵守 busy 与关闭守卫；自定义按钮仍需用插槽 busy 绑定禁用及加载。'],
]

const eventRows = [
  ['close-prevented', 'BingDialogCloseReason', '用户关闭因 busy、关闭选项或 beforeClose 被拦截；不代表发生模型更新。'],
  ['update:modelValue', 'boolean', '组件请求关闭时传 false，先于 close。业务直接改变模型不会触发此事件。'],
  ['close', 'BingDialogCloseReason', '关闭请求的原因；即使父级没有接收更新也触发，不表示 DOM 已移除或动画已结束。直接设置模型不触发。'],
  ['cancel', '-', '点击默认取消按钮或调用 footer slot 的 cancel 时触发。'],
  ['confirm', '-', '点击默认确定按钮或调用 footer slot 的 confirm 时触发。'],
]

export const dialogApi: DocsApiTables = {
  props: { headers: ["Prop","Type","Default","说明"], codeColumns: 3, rows: propsRows },
  orb: { headers: ["字段","Type","说明"], codeColumns: 2, rows: orbRows },
  slots: { headers: ["Slot","参数","说明"], codeColumns: 2, rows: slotsRows },
  events: { headers: ["Event","Payload","说明"], codeColumns: 2, rows: eventRows },
  types: { headers: ['类型', '说明'], codeColumns: 1, rows: [
    ['BingDialogTransitionOrigin', "'auto' | 'center' | HTMLElement | { x: number; y: number }。"],
    ['BingDialogInitialFocus', "'auto' | string | HTMLElement | false。"],
    ['BingDialogProps', '组件属性类型；从 @moubing/bing-ui 根入口导入。'],
    ['BingDialogEmits', 'update:modelValue、close、close-prevented、cancel、confirm 的载荷元组声明。'],
    ['BingDialogCloseReason', "'close' | 'cancel' | 'overlay' | 'escape' | 'confirm' | 'swipe'。"],
    ['BingDialogOverlayOrb', '遮罩光圈类型，color 必填，其余字段可选。'],
  ] },
}
