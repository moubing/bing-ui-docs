::::article{class="doc-page"}
<p class="doc-eyebrow">组件</p>

# BingScrollbar {#overview}

从 0.7.2 起，启用的滚动方向固定预留轨道空间，内容溢出时只改变轨道可见性，不挤动正文。默认纵向占右侧，可通过公开 CSS 变量 `--bing-scrollbar-gutter-left: var(--bing-scrollbar-gutter)` 同时预留左侧空间，使居中页面保持对称。自定义 viewport 的布局由调用方负责，同样应始终预留空间。

BingScrollbar 是自定义滚动容器，用于在保留原生滚动能力的同时，提供更统一的滚动条视觉和默认开启的平滑滚动。它支持纵向和横向滚动、hover/滚动时显示轨道、拖拽滑块、点击轨道跳转，以及通过 expose 方法主动滚动。

滚动内容放在默认插槽。独立使用时从 `@moubing/bing-ui` 导入组件，并导入 `@moubing/bing-ui/style.css`。类型使用公开导出的 `BingScrollbarProps`、`BingScrollbarSmoothOptions` 和 `BingScrollbarExpose`。

:::section{id="basic" class="doc-section"}
## 基础滚动

默认启用纵向滚动。设置 `height` 或 `maxHeight` 后，如果内容超过容器高度，组件会计算滑块大小和位置，并隐藏浏览器原生滚动条。

`vertical` 和 `horizontal` 控制对应自定义轨道与组件插值，原生 viewport 仍为 `overflow: auto`；关闭轴开关不等于禁止该方向滚动。`disabled` 才会隐藏 overflow 并移除轨道和 tabindex，但实例方法仍可滚动。可聚焦条件是启用方向存在超过容差的溢出、`focusable=true` 且未禁用；容差最小为 1px。

::scrollbar-basic-example
::

:::

:::section{id="horizontal" class="doc-section"}
## 横向滚动

横向滚动需要显式设置 `horizontal`。如果内容宽度超过 viewport，组件会显示横向轨道；按住 Shift 使用滚轮时，会把滚轮位移映射到横向滚动。

::scrollbar-horizontal-example
::

:::

:::section{id="smooth-scroll" class="doc-section"}
## 平滑滚动与原生回退

`smooth` 默认为 `true`，鼠标滚轮和聚焦后的键盘输入会经过脉冲缓动与连续输入加速。传入配置对象可以覆盖默认参数；传 `false` 时普通纵向输入由浏览器处理。当前仍保留横向 Shift+滚轮兼容处理及其插值，不能把 `smooth=false` 理解为所有输入都停止插值。

0.7.0 将滑块位置更新与内容渲染分离，滚动时无需因为滑块位移重新渲染默认插槽。默认平滑滚动、轨道点击、滑块拖动和键盘操作保持原有行为。

默认不会二次处理高精度触控板输入，并且默认尊重 `prefers-reduced-motion`；放在 BingConfigProvider 中时改由其 `reducedMotion` 策略决定。事件来自内部可滚动元素时，内部元素优先消费；到达边界后，滚动可以继续交给外层容器。

0.11.2 修复了 Chromium 页面缩放后鼠标档位取整引起的误判，例如 110% 下 `wheelDeltaY=-109`、`deltaY≈90.909` 不再回退为原生滚动。组件仍使用事件给出的 CSS 像素距离，不放大步长；触控板及 Ctrl+滚轮缩放手势保留原有处理。可在下方示例中切换 100%、110%、125% 页面缩放比较惯性。

::scrollbar-smooth-example
::

:::

:::section{id="expose" class="doc-section"}
## 主动滚动

通过 ref 可以调用 `scrollTo`、`scrollBy` 和 `update`。这些方法适合目录定位、日志面板跳到底部、内容异步变化后重新计算滑块。

数字参数立即设置纵向位置或增量；对象参数转给浏览器原生方法。`stop()` 只取消组件自己的插值，不能停止 `scrollTo({ behavior: 'smooth' })` 产生的浏览器动画。组件会自动观察尺寸；修改 Vue 内容后如需手动更新，应先 `await nextTick()`。

`handleWheel(event)` 可转交外部滚轮事件，返回是否消费，消费时组件内部会调用 `preventDefault()`。外部监听不要设为 passive，也不要无条件使用 `.prevent`，否则无法保留未消费事件的默认行为。示例的虚线区域可实际演示这一点。

::scrollbar-methods-example
::

:::

:::section{id="custom-viewport" class="doc-section"}
## 自定义滚动元素

0.6.0 新增 `viewport` 插槽，可以把自定义滚动条接到原生 textarea 等真实滚动元素。将 `viewportRef` 作为 ref 回调、`viewportAttrs` 整体绑定到同一个 DOM 元素；不要把组件实例或包裹层当作视口。

此插槽替换默认 viewport，组件不再额外创建 region 或 tabindex。业务负责原生元素的标签、尺寸、overflow、readonly/disabled 及焦点样式。原生输入框保留文本编辑和光标方向键，不会被改造成普通滚动区域；输入会触发轨道更新，程序修改文本后可等待 nextTick 再调用 update()。

下面的编辑器可输入、切换只读、追加内容和程序滚动；自定义滚动条只负责同步已有视口。

::scrollbar-viewport-example
::

:::

:::section{id="props" class="doc-section"}
## Props

::docs-api-table{name="props"}
::

:::

:::section{id="smooth-options" class="doc-section"}
## 平滑配置

`smooth` 传入 `BingScrollbarSmoothOptions` 对象时支持以下字段。未提供的字段继续使用默认值。

::docs-api-table{name="smoothOption"}
::

:::

:::section{id="events" class="doc-section"}
## Events

::docs-api-table{name="events"}
::

:::

:::section{id="expose-api" class="doc-section"}
## Expose

::docs-api-table{name="expose"}
::

:::

:::section{id="slots" class="doc-section"}
## 插槽

`BingScrollbarSlots` 与 `BingScrollbarViewportSlotProps` 均从包根导出。

::docs-api-table{name="slots"}
::

:::

::::
