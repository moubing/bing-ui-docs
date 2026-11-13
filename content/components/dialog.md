::::article{class="doc-page"}
<p class="doc-eyebrow">组件</p>

# BingDialog {#overview}

BingDialog 是模态弹窗组件，用于确认流程、编辑表单、发布提示和需要用户明确处理的内容。它会 Teleport 到 body，渲染为 `role="dialog"` 且带 `aria-modal`，默认锁定页面滚动，并提供默认标题、内容区、关闭按钮、底部取消/确定按钮和遮罩氛围效果。

独立使用需导入 `BingDialog` 和 `@moubing/bing-ui/style.css`。下方七个示例包含完整的导入、状态和处理函数；操作仅产生本地反馈，不会发送发布请求。表单组合示例另外使用 Zod 定义校验规则。

打开时优先聚焦内容区 autofocus 或表单控件，没有合适控件则聚焦面板；initialFocus 支持选择器、元素或 false。Tab/Shift+Tab 在当前弹窗及子浮层间循环，关闭后恢复触发器。嵌套弹窗会将下层设为 inert 并减少重复模糊；Escape 只作用于顶层，最后一个弹窗退出后恢复滚动锁。

:::section{id="basic" class="doc-section"}
## 基础配置

使用 `v-model` 控制打开状态。默认确认按钮只触发 `confirm`，不会自动关闭；需要点击确定后关闭时，打开 `closeOnConfirm`。 内容区默认启用 `smoothScroll`；嵌套可滚动元素会优先消费滚轮，到达内容边界后弹窗会阻止事件继续滚动背景页面，设为 `false` 可关闭平滑处理。

`modelValue` 是受控值，若只传值却不接收 `update:modelValue`，点击关闭仍会发出事件，但弹窗继续打开。`smoothScroll=false` 不会取消边界滚轮拦截；对象配置使用公开的 `BingScrollbarSmoothOptions`，详见 [BingScrollbar](/docs/components/scrollbar)。

::dialog-basic-example
::

:::

:::section{id="slots" class="doc-section"}
## 自定义标题与底部

通过 `title` 插槽替换标题区，通过 `footer` 插槽替换默认操作区。footer 插槽会暴露 `close`、`cancel` 和 `confirm` 方法。

confirm() 发出 confirm，是否关闭仍由 closeOnConfirm 决定；close('confirm') 只请求关闭，不额外发出 confirm。cancel() 发出 cancel 后请求关闭。这些回调遵守 busy 和关闭守卫；自定义 footer 应通过插槽 busy 绑定按钮禁用和加载。直接赋值模型绕过关闭守卫，适用于业务明确完成后的收起。

使用自定义 title 插槽时，示例省略 title 属性并设置 `ariaLabel`。当前同时设置 title 属性与自定义插槽会留下指向已被替换标题节点的 `aria-labelledby`，不能依靠它提供名称。`ariaDescribedby` 则应指向业务真实渲染的描述元素。

::dialog-footer-example
::

:::

:::section{id="ambience" class="doc-section"}
## 遮罩氛围

`overlayBlur` 控制遮罩背景模糊，`glassBlur` 和 `glassSaturation` 会作用到遮罩模糊层；`overlayOrbs` 控制光圈颜色、位置和尺寸。`overlayOrbsAnimated` 开启后，组件会使用 GSAP 让光圈轻微漂移。

关闭 `overlayBlur` 会移除光圈，动画遵循减少动态效果偏好。glass 已弃用且无视觉效果，下个大版本移除；glassOpacity 保留兼容。光圈表中的默认值是自定义光圈省略字段时的回退值，默认 overlayOrbs 为空数组，不会显示光圈；下例显式配置三枚彩色光圈用于演示。

`showPeek` 显示“按住查看背景”按钮，支持指针按住或键盘 Enter/空格。按住期间面板缩小并降至 `peekOpacity`，遮罩透明，松开或失焦后恢复；模型仍为 true，滚动锁仍保留，并未关闭弹窗。

::dialog-ambience-example
::

:::

:::section{id="close-behavior" class="doc-section"}
## 关闭行为

`close` 事件会返回关闭请求的来源。关闭按钮是 `close`，取消按钮是 `cancel`，点击遮罩是 `overlay`，Escape 是 `escape`，确认自动关闭时是 `confirm`，移动端下滑是 `swipe`。

取消时顺序是 `cancel → update:modelValue(false) → close('cancel')`；自动确认关闭时是 `confirm → update:modelValue(false) → close('confirm')`。这些事件在关闭动画结束前发出，不能把 close 当作“已销毁”回调。直接将业务模型设为 false 不会补发这些事件。

beforeClose(reason) 可返回布尔值或 Promise。false、异常或超过 30 秒会保留弹窗并发出 close-prevented；等待期间不会重复调用。confirmLoading 默认同时启用 busy，拦截取消、关闭按钮、遮罩、Escape 和移动端下滑关闭；显式 busy=false 可保留加载时关闭。默认确认行为仍由 closeOnConfirm 决定。

在 KeepAlive 缓存页面停用时主动将打开状态设为 false，避免 Teleport 弹窗留在页面外；文档预览保留此处理。普通独立组件卸载时，Dialog 会清理动画、监听器并恢复自己的滚动锁。

::dialog-behavior-example
::

:::

:::section{id="nested" class="doc-section"}
## 表单与多层浮层

在默认插槽内组合 Form、Input、Select 和子 Dialog。先提交空名称可观察默认错误聚焦；选择器打开后，Escape 只关闭选择面板并返回触发器。二次确认弹窗退出后返回“二次确认”按钮，父弹窗和滚动锁继续保留。

子浮层保持在父 Dialog 的 Vue 组件树中，即使实际 DOM 经 Teleport 渲染，也能参与同一套焦点管理。请为每层提供明确名称，避免让焦点恢复目标在弹窗打开期间被业务删除。

::dialog-nested-example
::

:::

:::section{id="frame" class="doc-section"}
## 固定尺寸与头部分类

通过 `height` 指定整体高度，`maxHeight` 设上限；数字单位为 px，字符串需带有效 CSS 单位。头部和 footer 保持可见，只有中部内容滚动。`header-addon` 位于标题行下方，适合放置分类 Tabs，不能把固定分类放进默认内容插槽。

需要 900×600 设置框时传 width=900、maxWidth=900、height=600；账号表单使用 width=480、height=480。显式尺寸受可用视口限制，桌面每侧留白 24px，宽度不超过 560px 时铺满宽度并贴底显示；视口缩小不会撑开页面。移动端为底部弹窗，支持从标题区域下滑关闭，并跟随 visualViewport 避让键盘；短距离拖动会回弹，busy 或守卫拒绝时保留弹窗。

::dialog-frame-example
::

:::

:::section{id="guard" class="doc-section"}
## 方向入场与关闭拦截

transitionOrigin 默认 auto，从当前焦点元素浮起；可设 center、元素或客户端坐标。关闭被拒绝时默认播放反馈，已有自定义反馈的业务可设置 rejectFeedback=false。示例使用即时 Promise 模拟关闭检查，不发送请求。面板圆角由 --bing-dialog-radius 控制，内容滚动时显示头尾分隔提示。

::dialog-guard-example
::

:::

:::section{id="props" class="doc-section"}
## Props

::docs-api-table{name="props"}
::

:::

:::section{id="overlay-orb" class="doc-section"}
## BingDialogOverlayOrb

::docs-api-table{name="orb"}
::

:::

:::section{id="slot-api" class="doc-section"}
## Slots

::docs-api-table{name="slots"}
::

:::

:::section{id="events" class="doc-section"}
## Events

::docs-api-table{name="events"}
::

:::

:::section{id="api-types" class="doc-section"}
## 公开类型

::docs-api-table{name="types"}
::

没有公开的 Dialog 实例方法；打开、关闭使用模型，footer 回调仅在插槽作用域内有效。

:::

::::
