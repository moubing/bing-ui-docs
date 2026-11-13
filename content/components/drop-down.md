::::article{class="doc-page"}
<p class="doc-eyebrow">组件</p>

# BingDropDown {#overview}

BingDropDown 是浮层菜单组件，用于按钮菜单、工具栏操作、资源右键菜单和带子菜单的复杂操作面板。组件负责触发方式、定位、键盘导航、关闭逻辑和 GSAP 入场动画，菜单内容通过 BingDropDownItem 或自定义插槽组织。

独立使用需导入 `BingDropDown`、`BingDropDownItem` 和 `@moubing/bing-ui/style.css`。带图标的示例还需显式安装 `lucide-vue-next`，这里验证版本为 1.0.0。示例中的删除、复制、下载和发布仅记录本地操作，不会处理文件、写剪贴板或发送请求；链接项单独展示真实链接的语义。

:::section{id="basic" class="doc-section"}
## 基础菜单

`trigger` 控制菜单打开方式，`placement` 控制首选面板方向，`size` 控制菜单密度。普通按钮菜单把 `triggerProps` 整体绑定到 BingButton 或原生按钮，包含事件与 aria-expanded/aria-haspopup，不要只取 click。示例禁用 BingButton 节流以便连续开关。

hover 默认进入 80ms 后打开、离开 110ms 后关闭，可通过 hoverOpenDelay / hoverCloseDelay 调整。触摸不触发悬停；contextmenu 支持 500ms 长按，移动超过 8px、滚动或第二指取消。主菜单支持上下键、Home/End 并跳过禁用项；触发器方向键打开并聚焦首尾项，普通点击 autoFocus 默认 false。

主菜单在 body 上定位，空间不足时可翻转，窗口滚动与 resize 会重新定位。普通模式使用整个 DropDown 根节点的矩形，多触发器共享根节点时不能假定跟随最后点击按钮；资源行应使用下方的右键模式。

卡片右侧的操作入口可用 `placement="bottom-end"`：菜单优先在按钮下方展开，右边缘与锚点右边缘对齐。`top-end` 同样右对齐，`left-end` / `right-end` 则让菜单底边与锚点底边对齐；靠近视口边缘时会避让。下方基础示例默认演示右侧按钮和 `bottom-end`。

::drop-down-basic-example
::

:::

:::section{id="context-menu" class="doc-section"}
## 右键菜单

当 `trigger` 为 `contextmenu` 时，触发器 slot 提供 `getTriggerProps(context)`。每行绑定自己的数据，默认插槽据此渲染操作。右键鼠标、Shift+F10 和 ContextMenu 键均可打开；键盘操作以当前触发器左下角定位并聚焦首项，鼠标以指针定位，面板还会增加偏移并避让视口边缘。默认在仍有焦点的编辑区内鼠标右键时保留正文焦点，防止入场结束后光标消失；autoFocus=true 可显式转移焦点。

`context` 类型是 unknown，示例验证字段后再访问。内部会先更新上下文，再发出 `update:context` 和 `context-open`；菜单已打开时右键另一行会就地更新内容。关闭动画结束后上下文清为 null，业务若要长期保留选择结果，应在自己的状态中另存一份。

::drop-down-context-example
::

:::

:::section{id="items" class="doc-section"}
## 菜单项能力

BingDropDownItem 支持图标、说明、快捷键、语义色、链接和子菜单。带 `submenu` 的菜单项默认不会点击后关闭，适合继续展开二级操作。

`shortcut` 仅显示键帽，不注册快捷键；`active` 只是当前项的样式和 ARIA 标记，不是选择模型。普通项在 click 回调后自动关闭，设置 `closeOnClick=false` 或对点击事件调用 preventDefault 可保留菜单。preventDefault 还会阻止链接的默认跳转，closeOnClick=false 本身不拦截链接。无需在每个普通菜单项的 click 中再调用 close。

带 submenu 的父项即使 closeOnClick=true 也不会自动关闭。悬停延迟后打开；键盘聚焦本身不展开，ArrowRight 或 Enter 展开并进入首项。子菜单支持上下键、Home/End，ArrowLeft 返回父项；斜向移动到子菜单时保留安全进入区域。

Escape 在子菜单只返回上一层，主菜单关闭并恢复触发器焦点；Dialog 中先关闭菜单。Tab / Shift+Tab 关闭整棵菜单，继续触发器后的或前面的焦点顺序。typeahead 默认开启，可用 textValue 提供拼音或别名；输入框和外部编辑器的文本输入保留原行为。链接 target=_blank 默认补 noreferrer noopener，disabled 项不能跳转或发出 click。

::drop-down-items-example
::

:::

:::section{id="controlled" class="doc-section"}
## 受控状态与方法

省略 open 或传 null 使用内部状态；传 boolean 进入受控模式，使用 `v-model:open` 接收更新，不能写成普通 v-model。若没有接收更新，触发器和方法仅发出请求，面板状态不会改变，也不会发出对应的 open/close。

通过 ref 调用 `openPanel()`、`close()`、`toggle()` 和 `focusFirstItem()`。实例在挂载后可用，focusFirstItem 不会自动打开菜单；需要先打开并等待 DOM 更新，或者开启 autoFocus。下方工具栏阻止自身 pointerdown 冒泡，避免外部关闭先发生、随后 toggle 又把菜单打开。

菜单关闭会清理监听器和动画；在 KeepAlive 页面停用时，文档站卸载全部预览实例并清空受控状态，避免 body 中的菜单继续显示。重新进入页面保留配置。没有“全局唯一菜单”保证，多个实例可独立打开。

::drop-down-controlled-example
::

:::

:::section{id="caret" class="doc-section"}
## 光标锚点与局部视口（0.15.0）

`anchor` 接收真实元素或带 `getBoundingClientRect()` 的虚拟对象，矩形使用客户端视口坐标。可用于光标、文字选区或画布命中区域；无需添加隐藏触发器或合成右键事件。`boundary` 指定主菜单的可用区域，组件与窗口取交集，留出 12px 边距并限制宽高，空间不足时翻到上方，过长选项在 BingScrollbar 内滚动。子菜单仍按窗口定位。

业务通过 `v-model:open` 控制显示；替换锚点对象或窗口滚动/resize 会重测。默认不抢输入焦点，输入型菜单可在内容容器上使用 `@mousedown.prevent`，自行处理方向键、Enter/Tab 和输入法，使用 Item 的 `active` 标记当前项。当前项变化仅滚动菜单内部，不调用页面的 scrollIntoView。锚点滚出业务区域、编辑器隐藏或进入只读时由业务关闭菜单。

::drop-down-caret-example
::

:::

:::section{id="selection" class="doc-section"}
## 分组、勾选与滑动高亮

BingDropDownGroup 使用 label 或 label 插槽标注分组，BingDropDownDivider 提供分隔线。业务当前值使用 type="radio" 与 checked，开关使用 checkbox；点击后由业务更新值。active 继续表示导航高亮，外部编辑器命令菜单保留它，不应转成选中态。highlightMotion 可选 slide；所有面板使用 BingScrollbar 并受可用尺寸约束。

::drop-down-selection-example
::

:::

:::section{id="props" class="doc-section"}
## 属性

::docs-api-table{name="props"}
::

:::

:::section{id="item-props" class="doc-section"}
## DropDownItem 属性

::docs-api-table{name="item"}
::

:::

:::section{id="slots-events" class="doc-section"}
## 插槽、事件与方法

### 插槽 {#slots}

::docs-api-table{name="slots"}
::

### 事件 {#events}

::docs-api-table{name="events"}
::

### 暴露方法 {#expose}

::docs-api-table{name="expose"}
::

:::

:::section{id="api-types" class="doc-section"}
## 公开类型

以下类型都从 `@moubing/bing-ui` 根入口导入，无需引用包内私有路径。trigger 插槽的 close 与 default 插槽一致，可传 restoreFocus；公开实例类型的 close 只声明无参调用。

::docs-api-table{name="types"}
::

:::

::::
