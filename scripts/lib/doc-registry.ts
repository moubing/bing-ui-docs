import { cursorApi } from '../../shared/docs/cursor.ts'
import { autocompleteApi } from '../../shared/docs/autocomplete.ts'
import { formApi } from '../../shared/docs/form.ts'
import { formItemApi } from '../../shared/docs/form-item.ts'
import { tabsApi } from '../../shared/docs/tabs.ts'
import { checkboxGroupApi } from '../../shared/docs/checkbox-group.ts'
import { radioGroupApi } from '../../shared/docs/radio-group.ts'
import { checkboxApi } from '../../shared/docs/checkbox.ts'
import { radioApi } from '../../shared/docs/radio.ts'
import { buttonApi } from '../../shared/docs/button.ts'
import { tagApi } from '../../shared/docs/tag.ts'
import { textareaApi } from '../../shared/docs/textarea.ts'
import { codeBlockApi } from '../../shared/docs/code-block.ts'
import { iconApi } from '../../shared/docs/icon.ts'
import { inputApi } from '../../shared/docs/input.ts'
import { cardApi } from '../../shared/docs/card.ts'
import { resizableApi } from '../../shared/docs/resizable.ts'
import { scrollbarApi } from '../../shared/docs/scrollbar.ts'
import { toastApi } from '../../shared/docs/toast.ts'
import { tooltipApi } from '../../shared/docs/tooltip.ts'
import { dialogApi } from '../../shared/docs/dialog.ts'
import { dropDownApi } from '../../shared/docs/drop-down.ts'
import { imageApi } from '../../shared/docs/image.ts'
import { imagePreviewApi } from '../../shared/docs/image-preview.ts'
import { filePreviewApi } from '../../shared/docs/file-preview.ts'
import { animatedTextApi } from '../../shared/docs/animated-text.ts'
import { appSwitcherTransitionApi } from '../../shared/docs/app-switcher-transition.ts'
import { carouselTransitionApi } from '../../shared/docs/carousel-transition.ts'
import { deckTransitionApi } from '../../shared/docs/deck-transition.ts'
import { colorPickerApi } from '../../shared/docs/color-picker.ts'
import { configProviderApi } from '../../shared/docs/config-provider.ts'
import { datePickerApi } from '../../shared/docs/date-picker.ts'
import { selectApi } from '../../shared/docs/select.ts'
import { sortableListApi } from '../../shared/docs/sortable-list.ts'
import { dragDropApi } from '../../shared/docs/drag-drop.ts'
import { tableApi } from '../../shared/docs/table.ts'
import { tableColumnControlsApi } from '../../shared/docs/table-column-controls.ts'
import { splitPaneApi } from '../../shared/docs/split-pane.ts'
import { sliderApi } from '../../shared/docs/slider.ts'
import { treeSelectApi } from '../../shared/docs/tree-select.ts'
import type { DocsApiTables } from '../../shared/docs/types.ts'

type ComponentDefinition = {
  title: string
  tables: DocsApiTables
  /** Markdown 中的示例节点名 → examples/<slug>/ 下的 Vue 文件名。顺序与正文一致。 */
  examples: Record<string, string>
  count: string
  note: string
  summary: string
}

// 已接入导出链路的页面；是否通过目标版本验收由 shared/docs/migration.ts 单独记录。
export const componentDefinitions = {
  autocomplete: {
    title: 'BingAutocomplete', tables: autocompleteApi,
    examples: { 'autocomplete-basic-example': 'basic', 'autocomplete-controlled-example': 'controlled', 'autocomplete-actions-example': 'actions' },
    count: '三个', note: '候选与处理函数完整内置；受控示例模拟失败，行尾操作示例只显示反馈。真实请求、权限、导航和历史由业务负责。',
    summary: '原位搜索、业务筛选、键盘与中文输入、独立行尾操作、候选详情和异步状态',
  },
  form: {
    title: 'BingForm', tables: formApi,
    examples: { 'form-layout-example': 'layout', 'form-methods-example': 'methods', 'form-auto-focus-example': 'auto-focus' },
    count: '三个',
    note: '布局示例中的 options 是示例选择的参数，不代表组件默认值；组件默认值以属性表为准。业务接口由使用方接入，示例不会发送保存请求。',
    summary: '默认自动校验、错误聚焦、下一项提示、布局、方法和 API',
  },
  'form-item': {
    title: 'BingFormItem', tables: formItemApi,
    examples: { 'form-item-message-example': 'message', 'form-item-span-example': 'span', 'form-item-slot-example': 'slot' },
    count: '三个',
    note: '前两个示例中的 options 是演示参数，不代表组件默认值；组件默认值以属性表为准。第三个示例演示原生 input 接入。业务保存只在本地显示结果，不发送请求。',
    summary: '标签、消息、跨度、自定义控件和 API',
  },
  tabs: {
    title: 'BingTabs', tables: tabsApi,
    examples: {
      'tabs-basic-example': 'basic', 'tabs-variants-example': 'variants',
      'tabs-item-slot-example': 'item-slot', 'tabs-keyboard-example': 'keyboard',
    },
    count: '四个',
    note: '基础示例中的 options 是演示参数，不代表组件默认值。Tabs 只管理标签栏，内容面板由业务渲染；四个文件各自持有状态。文档站为了方便对照，将基础区和手动激活区的选中值关联，这不是组件自动共享状态。',
    summary: '选中状态、键盘激活、自定义标签、示例和 API',
  },
  'checkbox-group': {
    title: 'BingCheckboxGroup', tables: checkboxGroupApi,
    examples: {
      'checkbox-group-basic-example': 'basic', 'checkbox-group-options-example': 'options',
      'checkbox-group-slot-example': 'slot', 'checkbox-group-events-example': 'events',
      'checkbox-group-status-example': 'status',
      'checkbox-group-batch-example': 'batch',
    },
    count: '六个',
    note: '基础示例的 options 是演示配置，不代表组件默认值。modelValue 是值数组；status 仅控制样式，实际校验规则由 Form schema 或业务提供。五个示例各自持有独立状态。',
    summary: '多选数组、配置选项、默认插槽、整组状态和事件',
  },
  'radio-group': {
    title: 'BingRadioGroup', tables: radioGroupApi,
    examples: {
      'radio-group-basic-example': 'basic', 'radio-group-options-example': 'options',
      'radio-group-slot-example': 'slot', 'radio-group-keyboard-example': 'keyboard',
    },
    count: '四个',
    note: '基础示例中的 options 是演示配置，不代表组件默认值。RadioGroup 使用单值模型，null 表示未选中；各组使用不同的 name 以保持独立。status 仅表示状态样式，实际校验规则由 Form schema 或业务提供。',
    summary: '单值模型、默认插槽、方向键切换、焦点事件和 API',
  },
  checkbox: {
    title: 'BingCheckbox', tables: checkboxApi,
    examples: {
      'checkbox-basic-example': 'basic', 'checkbox-states-example': 'states',
      'checkbox-sizes-example': 'sizes', 'checkbox-decorative-example': 'decorative',
      'checkbox-events-example': 'events',
      'checkbox-interaction-example': 'interaction',
    },
    count: '六个',
    note: '基础示例中的 options 是演示配置，不代表组件默认值。独立 Checkbox 使用布尔模型；组内 value 用于标识数组成员。indeterminate 由业务控制，decorative 仅呈现只读视觉标记。',
    summary: '布尔模型、半选、尺寸形状、装饰模式和事件',
  },
  radio: {
    title: 'BingRadio', tables: radioApi,
    examples: {
      'radio-basic-example': 'basic', 'radio-states-example': 'states',
      'radio-group-example': 'group', 'radio-events-example': 'events',
    },
    count: '四个',
    note: '基础示例中的 options 是演示配置，不代表组件默认值。Radio 比较模型与 value 的值和类型；同组共用模型及 name，每项 id 唯一。组内选择由 RadioGroup 更新和发出变化事件。',
    summary: '单选值与类型、尺寸状态、组内插槽、独立事件和 API',
  },
  button: {
    title: 'BingButton', tables: buttonApi,
    examples: {
      'button-basic-example': 'basic', 'button-variants-example': 'variants',
      'button-busy-example': 'busy',
      'button-sizes-example': 'sizes', 'button-text-effect-example': 'text-effect',
      'button-throttle-example': 'throttle',
      'button-swap-example': 'swap',
      'button-flex-row-example': 'flex-row',
    },
    count: '八个',
    note: '基础与文字效果示例的 options 是演示配置；label 通过默认插槽展示，customShine 只决定是否覆盖主题配色。throttle 默认 false，节流示例显式开启；它按时间间隔拦截重复点击，不代表异步请求完成。示例只显示本地反馈，没有网络请求。',
    summary: '按钮类型、尺寸圆角、文字效果、加载禁用、节流和事件',
  },
  tag: {
    title: 'BingTag', tables: tagApi,
    examples: {
      'tag-basic-example': 'basic', 'tag-tones-example': 'tones', 'tag-sizes-example': 'sizes',
      'tag-closable-example': 'closable', 'tag-slot-example': 'slot',
    },
    count: '五个',
    note: '基础示例中的 options 是演示参数，不代表默认值。close 只通知业务，不会自动删除标签；列表示例通过更新数据移除和恢复标签。插槽替代 label 时按需设置关闭按钮的可访问名称。',
    summary: '颜色尺寸、可关闭标签、列表删除恢复、默认插槽和 API',
  },
  textarea: {
    title: 'BingTextarea', tables: textareaApi,
    examples: {
      'textarea-basic-example': 'basic', 'textarea-autosize-example': 'autosize',
      'textarea-resize-example': 'resize', 'textarea-events-example': 'events',
      'textarea-submit-example': 'submit', 'textarea-methods-example': 'methods',
    },
    count: '六个',
    note: '模型使用字符串；clearable 默认 false，开启后可在焦点仍在控件内的 5 秒内撤销清除。组词草稿只改变显示、计数和高度。submitOn 默认 none，enter 保留 Shift+Enter 换行；resize 只报告 textarea 的稳定高度。字数按 UTF-16 长度统计。',
    summary: '多行输入与平滑光标、自动高度、字数限制、清除事件和实例方法',
  },
  'code-block': {
    title: 'BingCodeBlock', tables: codeBlockApi,
    examples: {
      'code-block-basic-example': 'basic', 'code-block-highlight-example': 'highlight',
      'code-block-wrap-example': 'wrap', 'code-block-resizable-example': 'resizable',
      'code-block-tokens-example': 'tokens',
    },
    count: '五个',
    note: '基础 options 是演示参数。code 字符串仅被展示，不会执行；五个示例内置文本，没有缺失的 ?raw 文件。行高亮不修改复制内容，区间包含首尾。Token API 示例保留纯文本失败回退并丢弃过期结果。',
    summary: '代码预览、复制、主题、滚动尺寸与可复用的语言和 Token 高亮 API',
  },
  icon: {
    title: 'BingIcon', tables: iconApi,
    examples: { 'icon-basic-example': 'basic', 'icon-sizes-example': 'sizes', 'icon-tones-example': 'tones', 'icon-accessibility-example': 'accessibility' },
    count: '四个',
    note: '完整示例使用 lucide-vue-next 1.0.0，需要项目显式安装该依赖；也可以传入支持属性透传的本地 SVG/Vue 组件。options 是演示配置；语义图标需要 decorative=false 和非空 label，图标本身不是按钮。',
    summary: '图标组件传入、尺寸和语义色、描边、装饰与可访问名称',
  },
  input: {
    title: 'BingInput', tables: inputApi,
    examples: { 'input-basic-example': 'basic', 'input-states-example': 'states', 'input-icons-example': 'icons', 'input-number-example': 'number', 'input-editing-example': 'editing', 'input-controlled-example': 'controlled', 'input-readonly-example': 'readonly', 'input-debounce-example': 'debounce', 'input-methods-example': 'methods' },
    count: '九个',
    note: '模型与更新均为 BingInputValue（string | number | null）；数字清空为 null，默认失焦 / Enter 规整，input 和 debounced-input 仍为字符串。passwordToggle 默认 true；已有自绘显隐时关闭。scrub 拖动结束提交一次原生 change，取消不提交。加载开关仅演示外观，没有请求。图标示例显式依赖 lucide-vue-next 1.0.0。',
    summary: '文本与数字输入、只读和平滑光标、尺寸状态、清除防抖和实例方法',
  },
  card: {
    title: 'BingCard', tables: cardApi,
    examples: { 'card-basic-example': 'basic', 'card-variants-example': 'variants', 'card-entrance-example': 'entrance', 'card-presets-example': 'presets', 'card-flip-example': 'flip', 'card-slots-example': 'slots' },
    count: '六个',
    note: 'options 为演示参数。翻面由组件内部管理，flip 只通知当前面；interactive=false 不关闭翻面。disabled 阻止表面指针事件，但子按钮仍需显式禁用。0.6.0 的反面仍一直 aria-hidden，重要说明需另有可访问入口。',
    summary: '内容插槽、玻璃与尺寸、入场预设、点击长按翻面、事件和限制',
  },
  resizable: {
    title: 'BingResizable', tables: resizableApi,
    examples: { 'resizable-basic-example': 'basic', 'resizable-modes-example': 'modes', 'resizable-constraints-example': 'constraints', 'resizable-methods-example': 'methods', 'resizable-controlled-example': 'controlled' },
    count: '五个',
    note: 'options 是演示配置。受控尺寸与位置需要接收各自更新事件；默认值在重置时重新应用。示例使用数值像素和有尺寸的父容器；contain 与比例、最小尺寸冲突时无法同时保证所有限制。',
    summary: '拖拽和键盘调整、吸附与比例约束、受控模式、完整参数和实例方法',
  },
  scrollbar: {
    title: 'BingScrollbar', tables: scrollbarApi,
    examples: { 'scrollbar-basic-example': 'basic', 'scrollbar-horizontal-example': 'horizontal', 'scrollbar-smooth-example': 'smooth', 'scrollbar-methods-example': 'methods', 'scrollbar-viewport-example': 'viewport' },
    count: '五个',
    note: 'options 是演示配置。纵横轴开关控制自定义轨道与组件插值，不能据此判断原生内容不可滚动。实例方法挂载后调用；stop 取消组件插值，不取消浏览器原生 smooth 动画。',
    summary: '纵横滚动、平滑配置、自定义 viewport 插槽、滚轮转交与实例方法',
  },
  toast: {
    title: 'BingToast', tables: toastApi,
    examples: { 'toast-basic-example': 'basic', 'toast-types-example': 'types', 'toast-loading-example': 'loading', 'toast-action-example': 'action', 'toast-positions-example': 'positions' },
    count: '五个',
    note: 'options 是演示配置。每个示例单独运行；业务应用只保留一个全局视口。服务入口共享队列，同 id 更新是整条替换；示例取消定时任务并在卸载时关闭自己创建的提示。操作示例用定时器模拟异步撤销，勾选时下一次撤销失败，用来演示保留提示供重试。',
    summary: '全局消息、类型与计时、同 id 替换、撤销等操作按钮、位置、关闭事件及服务 API',
  },
  tooltip: {
    title: 'BingTooltip', tables: tooltipApi,
    examples: { 'tooltip-basic-example': 'basic', 'tooltip-rich-example': 'rich', 'tooltip-placement-example': 'placement', 'tooltip-manual-example': 'manual',
      'tooltip-toolbar-example': 'toolbar',
    },
    count: '五个',
    note: 'options 是演示配置。多个实例共享浮层，实际可见性用默认插槽 open 判断；显式模型需同步更新。提示自动关联实际目标，多目标使用 triggerProps 指定。外部手动切换示例关闭 closeOnOutside，保留 Escape。',
    summary: '悬停与点击、共享浮层和受控状态、可访问关联、定位边界与实例方法',
  },
  dialog: {
    title: 'BingDialog', tables: dialogApi,
    examples: { 'dialog-basic-example': 'basic', 'dialog-footer-example': 'footer', 'dialog-ambience-example': 'ambience', 'dialog-behavior-example': 'behavior', 'dialog-nested-example': 'nested', 'dialog-frame-example': 'frame',
      'dialog-guard-example': 'guard',
    },
    count: '七个',
    note: 'options 是演示配置。Dialog 使用受控模型，默认确认只发送通知；close 表示关闭请求，业务直接设置模型不会补发事件。示例仅有本地反馈。支持初始焦点、嵌套 inert、busy、异步 beforeClose 与移动端下滑；自定义标题仍需显式名称。',
    summary: '受控弹窗、标题和底部插槽、遮罩与查看背景、关闭事件顺序和使用限制',
  },
  'drop-down': {
    title: 'BingDropDown', tables: dropDownApi,
    examples: { 'drop-down-basic-example': 'basic', 'drop-down-context-example': 'context', 'drop-down-items-example': 'items', 'drop-down-controlled-example': 'controlled', 'drop-down-caret-example': 'caret',
      'drop-down-selection-example': 'selection',
    },
    count: '六个',
    note: 'options 是演示配置。带图标的示例依赖 lucide-vue-next 1.0.0。使用 v-model:open 接收受控更新，context 先做类型检查；除示例链接外，操作仅记录本地反馈。shortcut 不注册快捷键。',
    summary: '普通与右键菜单、虚拟锚点与局部边界、上下文检查、菜单项与子菜单、受控模型及键盘边界',
  },
  image: {
    title: 'BingImage', tables: imageApi,
    examples: { 'image-basic-example': 'basic', 'image-fallback-example': 'fallback', 'image-crop-example': 'crop', 'image-preview-example': 'preview', 'image-slots-example': 'slots' },
    count: '五个',
    note: 'options 是演示配置。所有示例图片均内置；损坏数据用于验证回退与重试。模型由组件内部管理，通过事件读取加载状态；图库初始索引由业务明确传入。',
    summary: '图片尺寸与裁剪、加载回退、状态事件、错误重试和预览图库',
  },
  'image-preview': {
    title: 'BingImagePreview', tables: imagePreviewApi,
    examples: { 'image-preview-basic-example': 'basic', 'image-preview-gallery-example': 'gallery', 'image-preview-behavior-example': 'behavior', 'image-preview-glass-example': 'glass' },
    count: '四个',
    note: 'options 是演示配置。图片全部内置，预览与外部索引用 v-model 同步。change 表示切图请求，不是图片加载完成；download 只通知将发起原生链接下载。关闭工具栏和遮罩入口时，行为示例会保留 Escape 退出。',
    summary: '全屏图库、索引同步、缩放旋转、关闭与下载事件、焦点和滚动限制',
  },
  'file-preview': {
    title: 'BingFilePreview', tables: filePreviewApi,
    examples: { 'file-preview-basic-example': 'basic', 'file-preview-limits-example': 'limits', 'file-preview-office-example': 'office', 'file-preview-nested-example': 'nested' },
    count: '四个',
    note: 'options 是演示配置。文本、JSON、CSV、PDF、DOCX 和静态转换页面全部内置，没有缺失的示例文件。file.type 优先于独立 type；文本截断不限制网络读取量。下载和外部打开使用原生浏览器动作，事件不代表成功。',
    summary: '文件合并与类型识别、文本和 CSV 限制、PDF/Office 预览、文件操作、嵌套焦点及图片分支边界',
  },
  cursor: {
    title: 'BingCursor', tables: cursorApi,
    examples: { 'cursor-basic-example': 'basic', 'cursor-states-example': 'states', 'cursor-appearance-example': 'appearance', 'cursor-native-example': 'native', 'cursor-scope-example': 'scope' },
    count: '五个',
    note: '示例自带控件与样式，局部光标只影响演示区；全局示例默认关闭并在缓存页面停用时卸载。元素 data-bing-cursor 不是组件属性。图片由浏览器原生绘制，不提供跟随层、形变或自定义 cursor 插槽；控件仍需真实语义、焦点与可访问名称。',
    summary: '原生 CSS 光标、自动识别、16 种状态、配色尺寸与热点、全局局部作用域及系统回退与清理',
  },
  'animated-text': {
    title: 'BingAnimatedText', tables: animatedTextApi,
    examples: { 'animated-text-basic-example': 'basic', 'animated-text-shine-example': 'shine', 'animated-text-jump-example': 'jump', 'animated-text-disabled-example': 'disabled',
      'animated-text-motion-example': 'motion',
    },
    count: '五个',
    note: 'options 是演示配置，text 通过默认插槽显示。文字、禁用和参数变化由同一实例直接响应，拆字仅操作装饰副本。组件已封装 GSAP/SplitText，无需在业务示例中注册插件；hover 支持父容器与键盘聚焦，once 等待进入视口；swap 默认关闭，play 可手动播放。disabled 不保留播放进度。',
    summary: '扫光与拆字跳动、触发和延迟、动态内容重建、减少动态效果与插槽 API',
  },
  'app-switcher-transition': {
    title: 'BingAppSwitcherTransition', tables: appSwitcherTransitionApi,
    examples: { 'app-switcher-transition-basic-example': 'basic', 'app-switcher-transition-controls-example': 'controls', 'app-switcher-transition-slots-example': 'slots' },
    count: '三个',
    note: 'options 是演示配置。受控模型必须同步；外部赋值不会发出 change。全部卡片持续挂载，示例给隐藏内容设置 inert。业务字段先做类型检查，动态列表需有效选择和 key 重建。',
    summary: '应用面板、受控选择与事件、横向滚轮、插槽状态和动态列表限制',
  },
  'carousel-transition': {
    title: 'BingCarouselTransition', tables: carouselTransitionApi,
    examples: { 'carousel-transition-basic-example': 'basic', 'carousel-transition-controls-example': 'controls', 'carousel-transition-wheel-example': 'wheel' },
    count: '三个',
    note: 'options 是演示配置。受控模型必须同步，外部赋值不触发 change。全部面板常驻，示例为隐藏内容设置 inert。滚轮示例使用全部可用的项目；0.5.3 滚轮遇禁用项会造成轨道与模型不一致，详见正文。',
    summary: '横向轨道、受控选择、滚轮预览与回弹、插槽状态和禁用项限制',
  },
  'deck-transition': {
    title: 'BingDeckTransition', tables: deckTransitionApi,
    examples: { 'deck-transition-basic-example': 'basic', 'deck-transition-playground-example': 'playground', 'deck-transition-controls-example': 'controls' },
    count: '三个',
    note: 'options 是演示配置。next 来自 controls 插槽，不是公开实例方法。外部赋值直接定位，不发 change；滚轮正负方向均前进。卡片常驻，示例为隐藏内容设置 inert，并给非循环自定义按钮明确的终点状态。',
    summary: '卡组洗牌、受控定位、自定义下一张、滚轮方向、插槽与使用边界',
  },
  'color-picker': {
    title: 'BingColorPicker', tables: colorPickerApi,
    examples: { 'color-picker-basic-example': 'basic', 'color-picker-presets-example': 'presets', 'color-picker-sizes-example': 'sizes', 'color-picker-events-example': 'events' },
    count: '四个',
    note: 'options 是演示配置，色板数据完整内置。v-model 只更新六位 HEX；事件示例用 change.rgba 保存透明度。面板的格式切换只影响展示和复制。实例方法通过挂载后的 ref 调用。',
    summary: '颜色格式与透明度、预设与尺寸、延迟提交、复制反馈、面板与实例方法',
  },
  'config-provider': {
    title: 'BingConfigProvider', tables: configProviderApi,
    examples: { 'config-provider-size-example': 'size', 'config-provider-layers-example': 'layers', 'config-provider-motion-example': 'motion' },
    count: '三个',
    note: 'Provider 自 0.12.0 起提供，只给未显式传入对应 props 的组件提供默认值；嵌套 Provider 只覆盖自身设置的字段。层级示例的第三方挂件只在弹窗打开时显示。reducedMotion 只影响 JS 动效，CSS 媒体查询仍跟随系统。useBingConfig / useReducedMotion 需在 Provider 的后代组件中调用。',
    summary: '全局尺寸、浮层层级基准、JS 动效策略、嵌套覆盖与组合式函数',
  },
  'date-picker': {
    title: 'BingDatePicker', tables: datePickerApi,
    examples: { 'date-picker-basic-example': 'basic', 'date-picker-singles-example': 'singles', 'date-picker-ranges-example': 'ranges', 'date-picker-rules-example': 'rules', 'date-picker-methods-example': 'methods' },
    count: '五个',
    note: 'options 是演示配置。模型保存字符串或完整二元组，null 表示空值。每个实例提供唯一 id；配置变化时关闭或重建面板。日期规则与营业时间边界完整内置，清空方法示例先关闭面板。',
    summary: '五类日期时间、单值与范围、显示和保存格式、禁用规则、事件与实例方法',
  },
  select: {
    title: 'BingSelect', tables: selectApi,
    examples: { 'select-basic-example': 'basic', 'select-multiple-example': 'multiple', 'select-detail-example': 'detail', 'select-virtual-example': 'virtual', 'select-panel-example': 'panel', 'select-sizes-example': 'sizes', 'select-events-example': 'events' },
    count: '七个',
    note: 'options 是示例参数，所有选项数据与事件处理器完整内置。模型使用原始 value，搜索是本地筛选；全选只作用于当前可选结果。虚拟行高和磨砂参数默认随尺寸及主题变化，listbox/option ID 按实例唯一生成。面板位置类型从公开 Props 推导。',
    summary: '单选多选、本地搜索、选项详情、虚拟列表、弹层定位、事件与键盘行为',
  },
  'sortable-list': {
    title: 'BingSortableList', tables: sortableListApi,
    examples: { 'sortable-list-basic-example': 'basic', 'sortable-list-disabled-example': 'disabled', 'sortable-list-horizontal-example': 'horizontal', 'sortable-list-controlled-example': 'controlled', 'sortable-list-overlay-example': 'overlay' },
    count: '五个',
    note: 'options 是演示配置，数据、排序状态、事件和必要样式完整内置。items 不会被重排，保存时读取 order。禁用项仅禁止发起排序，不固定位置；手柄保留可访问语义。',
    summary: '指针与键盘排序、拖拽浮层、提交时机、禁用项、手柄、受控键顺序和泛型 API',
  },
  'drag-drop': {
    title: 'BingDragDrop', tables: dragDropApi,
    examples: { 'drag-drop-basic-example': 'basic', 'drag-drop-rules-example': 'rules' },
    count: '两个',
    note: '数据、事件处理和样式完整内置。组件只报告来源与目标，示例在 drop 中自行修改数据。拖动只支持指针，基础示例用下拉菜单提供键盘可用的移动入口。',
    summary: '跨区域拖动、指针落点、触屏长按、放置规则、区域状态、拖动浮层与事件',
  },
  table: {
    title: 'BingTable', tables: tableApi,
    examples: { 'table-basic-example': 'basic', 'table-tree-example': 'tree', 'table-columns-example': 'columns', 'table-virtual-example': 'virtual', 'table-controls-example': 'controls', 'table-methods-example': 'methods', 'table-remote-example': 'remote', 'table-keyboard-example': 'keyboard', 'table-cascade-example': 'cascade', 'table-remote-selection-example': 'remote-selection', 'table-active-example': 'active', 'table-variable-example': 'variable', 'table-error-example': 'error', 'table-skeleton-example': 'skeleton', 'table-focus-example': 'focus', 'table-theme-example': 'theme' },
    count: '十六个',
    note: 'options 是演示参数，数据和列定义完整内置。树形例子独立维护展开值。组件不加载远程数据，分页按顶层行计算；所有受控状态均须同步对应更新。',
    summary: '键盘网格、级联与跨页选择、活动行、变高虚拟行、错误骨架、焦点滚入与主题变量',
  },
  'table-column-controls': {
    title: 'BingTableColumnControls', tables: tableColumnControlsApi,
    examples: { 'table-column-controls-shared-example': 'shared' }, count: '一个',
    note: '示例使用单份列模型，初始第一个分组未挂载。列宽从表头调整，面板重置也会恢复列宽；组件不保存偏好。',
    summary: '独立列设置、分组共用、固定分区、显隐、键盘重排与重置',
  },
  'split-pane': {
    title: 'BingSplitPane', tables: splitPaneApi,
    examples: { 'split-pane-basic-example': 'basic' }, count: '一个',
    note: '示例为了文档视口显式设置较小的最小宽度，不代表组件默认值。偏好与实际宽度分离，示例只显示提交结果。',
    summary: '水平分栏、右侧偏好宽度、拖动取消、键盘、边界与重置',
  },
  slider: {
    title: 'BingSlider', tables: sliderApi,
    examples: { 'slider-basic-example': 'basic', 'slider-range-example': 'range', 'slider-vertical-example': 'vertical', 'slider-controlled-example': 'controlled' }, count: '四个',
    note: '范围和步长是正文宽度演示参数，保存仅写入本地响应式变量，没有请求或 Cookie。',
    summary: '单值与范围滑块、刻度气泡、横竖方向、双击恢复、受控回弹和键盘触屏',
  },
  'tree-select': {
    title: 'BingTreeSelect', tables: treeSelectApi,
    examples: { 'tree-select-basic-example': 'basic', 'tree-select-cascade-example': 'cascade', 'tree-select-custom-example': 'custom', 'tree-select-virtual-example': 'virtual', 'tree-select-panel-example': 'panel' },
    count: '五个',
    note: '0.17.0 新增 typeahead/highlightMatches、搜索展开快照、混合勾选 ARIA 和宽度折叠标签。options 是演示配置，树数据、回调和样式完整内置。级联输出包含父节点和可选后代；搜索批量范围可能包含未显示子节点，未知值会在下一次操作时移除。',
    summary: '层级选择、级联与严格模式、搜索范围、节点详情、虚拟树、展开状态和键盘行为',
  },
} satisfies Record<string, ComponentDefinition>

export type ComponentSlug = keyof typeof componentDefinitions
export const componentSlugs = Object.keys(componentDefinitions) as ComponentSlug[]
