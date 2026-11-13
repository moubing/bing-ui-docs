::::article{class="doc-page"}
<p class="doc-eyebrow">组件</p>

# BingCarouselTransition {#overview}

BingCarouselTransition 是轮播式面板过渡容器。它把每个 item 渲染为一页，通过 GSAP 移动横向 track，适合展示连续的状态页、看板卡片或需要保留左右方向感的内容切换。

:::section{id="basic" class="doc-section"}
## 滑动轨道

组件内部由 `viewport` 和横向 `track` 组成，当前面板通过`xPercent` 移动到视口中。默认会显示顶部 BingTabs，用于点击或键盘切换。

::carousel-transition-basic-example
::

:::

:::section{id="controls" class="doc-section"}
## 受控切换和配置

当需要把切换交给外部工具栏或表单控制时，可以隐藏 `showTabs`。`disabled` 阻止内部选择，外部修改模型仍可切换；`loop` 控制边界；`respectReducedMotion`会在系统要求减少动效时直接定位到目标面板。

内部选择依次发出 `update:modelValue` 和 `change`，外部赋值不会补发事件；`change` 不表示动画完成。受控模式必须同步更新，使用 `v-model`；忽略更新会让轨道位置与模型和 aria-hidden 不一致。内部标签可以中断动画选择新面板，横向滚轮则在动画期间被忽略。

::carousel-transition-controls-example
::

:::

:::section{id="wheel" class="doc-section"}
## 横向滚轮

当横向滚动量大于纵向滚动量时，组件会阻止默认滚动，并让 track 先产生一段预览偏移。偏移累计超过阈值后会切换面板，否则回到当前面板。这个行为主要服务触控板横向滑动。

当前版本累计原始 `deltaX`，横向滚动停止约 72ms 后，绝对累计量严格大于 42 才尝试切换一项；预览偏移为累计量除以 7 并限制到 ±32%。较小位移回弹，不发 change。不会按 deltaMode 换算，也不会把 Shift 加纵向滚轮转换成横向。边界和动画期间仍可能阻止默认滚动。

**禁用项限制：当前滚轮结束逻辑无论选择是否成功，都会移动轨道。邻项禁用时，模型不变且没有更新事件，画面仍可能滑向禁用项。** 需要禁用项的业务可在外层用 `@wheel.capture.stop` 拦截滚轮，改用标签或外部控制；内置标签键盘会跳过禁用项。本页滚轮示例的所有项目均可用。

::carousel-transition-wheel-example
::

:::

:::section{id="slots" class="doc-section"}
## 默认插槽

默认插槽接收当前 item、索引、激活状态和动画状态。全部面板持续挂载，示例中的计数会保留。隐藏卡片只有 aria-hidden，组件不自动提供 inert、tabpanel 关联或内容焦点管理；示例为业务内容设置 `:inert="!active"`。面板内容建议保持稳定高度。业务字段为 unknown，使用前先缩窄类型。

::docs-api-table{name="slots"}
::

:::

:::section{id="props" class="doc-section"}
## 属性

::docs-api-table{name="props"}
::

:::

:::section{id="item" class="doc-section"}
## Item 结构

::docs-api-table{name="item"}
::

:::

:::section{id="events" class="doc-section"}
## 事件

::docs-api-table{name="events"}
::

:::

:::section{id="types" class="doc-section"}
## 公开类型与使用边界

::docs-api-table{name="types"}
::

类型从 `@moubing/bing-ui` 导入。组件没有公开实例方法，也不提供自动播放、拖拽或自定义动画时长属性。默认插槽省略时显示 item.label；ariaLabel 只为顶部标签栏命名。

未提供模型时，初始使用首个未禁用项。模型必须命中有效项，value 以 Object.is 比较，字符串化后也应唯一。无效模型可能显示首个面板，但没有激活项且所有面板 aria-hidden；空列表应渲染业务空态。

组件没有监听列表重排来重新定位轨道；替换、增删或重排 items 后应选定有效值并通过业务 key 重建。所有面板常驻，后台任务需按 active 自行管理。文档站在 KeepAlive 页面离开时卸载实例，取消动画和滚轮计时，返回时保留外部状态重新挂载。

respectReducedMotion 默认尊重系统减少动态效果偏好，切换时直接定位；不保证偏好变化立即取消已运行的动画。disabled 同样不会自行清理正在运行的动画。loop=false 只控制内部索引边界，外部模型仍由业务负责。

:::

::::
