::::article{class="doc-page"}
<p class="doc-eyebrow">组件</p>

# BingDragDrop {#overview}

BingDragDrop 用于把条目从一个区域拖到另一个区域，例如看板换列、归档、移入分组或拖到删除区。它由四个组件组合：`BingDragDrop` 管理一次拖动，`BingDraggable` 包住可拖动的条目，`BingDropZone` 声明放置区域，`BingDragOverlay` 渲染跟随指针的浮层。组件只报告“哪个条目从哪里放到了哪里”，数据更新、保存和撤销由业务完成。

同一区域内调整顺序请使用 BingSortableList。BingDragDrop 不处理区域内排序，也不提供键盘拖动。

:::section{id="basic" class="doc-section"}
## 跨区域拖动

`BingDraggable` 的 `zone` 写条目当前所在区域的 id，`BingDropZone` 的 `id` 与之对应。松手时指针在另一个区域上方，`BingDragDrop` 发出 `drop`，载荷包含条目 `id`、`data`、来源 `from` 和目标 `to`；业务据此修改数据，条目随数据重新渲染到新区域。

落点只按指针位置判断：松手时指针不在任何区域内，条目回到原处；放回原区域默认只发出 `drag-end`，不发出 `drop`。区域嵌套时取最内层的区域。`BingDragOverlay` 可选，提供后原条目留在原处作为占位，浮层带轻微倾斜跟随指针，松手后先回到落点，再在同一帧内把位置交还给条目（浮层收起、占位样式解除），不会闪出空槽；放下后条目不再显示时（例如 `drop` 里把它移出列表、落到「已完成」「回收站」或当前隐藏的列），浮层保持拖动时的尺寸，缩小淡出地收进它落下的区域，区域也已移除时就地收拢；浮层带有 `aria-hidden` 和 `inert`。

鼠标和触控笔按下后移动超过 `dragThreshold`（默认 6px）才开始拖动，单击条目中的链接仍正常打开。触屏需要长按 `touchDelay`（默认 300ms）才开始，长按前滑动照常滚动页面。按下点落在条目内的按钮、输入框、下拉框、可编辑区域或带 `data-bing-drag-ignore` 的元素上时不会开始拖动；条目本身是链接或按钮时不受影响。拖动中按 Escape 取消。拖到滚动容器或窗口边缘时自动滚动，可用 `autoScroll` 关闭。

拖动只支持指针，没有键盘操作和读屏说明。示例在每张卡片上放了“移到…”菜单，键盘和读屏用户通过它完成同样的移动；业务中请始终提供这样的非拖动入口。

::drag-drop-basic-example
::

:::

:::section{id="rules" class="doc-section"}
## 放置规则与事件

`BingDropZone` 的 `accept(item)` 返回 false 时不接受该条目，拖动期间区域状态为 `disabled`，松手也不会落到这里；来源区域不调用 `accept`，总是可以放回。`disabled` 的区域不接受任何条目。`BingDraggable` 的 `disabled` 让单个条目不能拖动，`BingDragDrop` 的 `disabled` 停用整组拖动。

区域通过默认插槽的 `state` 和 `is-${state}` 类名显示状态：`idle` 没有拖动，`source` 是条目来源，`target` 可以放置，`over` 指针正在上方、松手即放置，`disabled` 不接受当前条目。元素上同时带有 `data-bing-drop-state`。

事件顺序为 `drag-start` → 若干 `drag-over` → `drop`（仅在落到其他区域时）→ `drag-end`。`drag-over` 只在指针所在的可放置区域变化时发出，离开所有区域时 `over` 为 null。`drag-end` 总会发出，`canceled` 表示按 Escape 或其他方式取消，此时 `to` 为 null。开启 `dropOnSource` 后，放回原区域也会发出 `drop`。

`BingDragDrop` 默认插槽的 `active` 在拖动期间为当前条目，可用来只在拖动时显示删除区等额外区域；后代组件也可以调用 `useBingDragDrop()` 读取同样的状态并调用 `cancel()`。

::drag-drop-rules-example
::

:::

:::section{id="props" class="doc-section"}
## Props

### BingDragDrop {#drag-drop-props}

::docs-api-table{name="props"}
::

### BingDraggable {#draggable-props}

::docs-api-table{name="draggable"}
::

### BingDropZone {#drop-zone-props}

::docs-api-table{name="zone"}
::

### BingDragOverlay {#overlay-props}

::docs-api-table{name="overlay"}
::

:::

:::section{id="slots-events" class="doc-section"}
## 插槽与事件

### 事件 {#events}

::docs-api-table{name="events"}
::

### 插槽参数 {#slot-props}

::docs-api-table{name="slots"}
::

### 实例方法与组合式函数 {#methods}

::docs-api-table{name="methods"}
::

:::

:::section{id="types" class="doc-section"}
## 类型与使用边界

::docs-api-table{name="types"}
::

组件与类型均从 @moubing/bing-ui 导入。`BingDraggable`、`BingDropZone` 和 `BingDragOverlay` 必须放在 `BingDragDrop` 内部，否则抛错；服务端渲染时只输出条目和区域，浮层在客户端拖动时才出现。

`zone` 只用于识别来源区域和填写载荷中的 `from`，不会自动让条目在区域之间移动；没有 `zone` 的条目不会被识别为任何区域的来源。条目 id 在同一个 `BingDragDrop` 内必须唯一，区域 id 同样如此。

`data` 会原样出现在事件载荷和浮层插槽中，组件不复制也不修改它。拖动期间不要卸载正在被拖动的条目；需要清空时先调用 `cancel()`。减少动态效果时浮层不倾斜，也不播放落位动画；该设置在每次松手时读取，运行中切换立即生效。

:::

::::
