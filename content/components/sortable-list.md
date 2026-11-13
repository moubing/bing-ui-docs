::::article{class="doc-page sortable-doc"}
<p class="doc-eyebrow">组件</p>

# BingSortableList {#overview}

BingSortableList 是可排序列表组件，用于让用户通过拖拽或键盘调整列表、列、步骤和配置项的顺序。它只负责顺序交互，不限制每一项的视觉结构；你可以把 `handleProps` 绑定到专门手柄，也可以绑定到整张卡片。

:::section{id="basic" class="doc-section"}
## 基础排序

传入 `items` 和 `itemKey` 后，通过 `v-model:order` 接收最新顺序。`reorderMode` 可以决定是在释放拖拽后提交，还是在拖拽过程中实时提交。

手柄接收焦点后直接按对应方向键、Home 或 End 排序，不需要先按 Space 进入拖拽。必须把完整 handleProps 绑定到一个真实元素，保留 ref 与键盘处理；不能对这个可聚焦手柄设置 aria-hidden。示例为每项提供明确名称。

::sortable-list-basic-example
::

:::

:::section{id="disabled-handle" class="doc-section"}
## 禁用项和拖拽手柄

单项禁用可以用 `itemDisabled` 从数据中读取，也可以用 `disabledKeys` 按 key 指定。如果希望整张卡片都能拖拽，把 `handleProps` 绑定到卡片根元素即可。

这里的锁定表示不能主动拖动或按键排序，并不保证固定在第一个位置。其他项移动到它前面、或外部重写 order，都可以改变它的位置。若业务要求固定索引，应在业务层校验最终顺序。整卡作为手柄时，不要在内部嵌套按钮或输入控件。

::sortable-list-disabled-example
::

:::

:::section{id="horizontal" class="doc-section"}
## 横向排序

设置 `axis="horizontal"` 后，列表会按横向排列，并使用左右方向键排序。这个模式适合表格列、筛选标签、看板泳道这类横向配置。

::sortable-list-horizontal-example
::

:::

:::section{id="controlled-order" class="doc-section"}
## 受控顺序

`order` 是组件和业务状态之间的边界。外部可以直接改写它，组件会对顺序做归一化：无效 key 会被移除，缺失 key 会按 `items` 原始顺序补回。

归一化还会去重；这些修正只用于有效渲染顺序，不主动发送 update:order。外部 order 不被组件修改。默认 id 字段缺失会回退索引，动态增删时不可靠；建议稳定、同一类型且字符串表示也不冲突的键。

::sortable-list-controlled-example
::

:::

:::section{id="drag-overlay" class="doc-section"}
## 拖拽浮层

`dragOverlay` 默认关闭。开启后，组件以独立浮层呈现正在拖动的内容，并复用默认插槽；原列表继续保留项目布局。下方可以切换两种反馈方式，释放指针后再提交顺序。

浮层带有 `aria-hidden` 和 `inert`，不参与交互或键盘焦点；浮层插槽中的 active/dragging 为 true，handleProps 的 tabindex 为 -1、aria-disabled 为 true，ref 与按键处理为空操作。仍应完整绑定 handleProps，不要自行把浮层手柄恢复为可交互状态。

默认插槽会同时用于原项目和浮层，避免硬编码 DOM ID，也不要在插槽子组件挂载时提交业务操作。浮层只负责视觉反馈，保存与更新始终通过原列表的 order 和事件完成。

::sortable-list-overlay-example
::

:::

:::section{id="props" class="doc-section"}
## Props

::docs-api-table{name="props"}
::

:::

:::section{id="slots-events" class="doc-section"}
## 插槽与事件

### 默认插槽参数 {#slot-props}

::docs-api-table{name="slots"}
::

### handleProps {#handle-props}

::docs-api-table{name="handle"}
::

### 事件 {#events}

::docs-api-table{name="events"}
::

:::

:::section{id="types" class="doc-section"}
## 类型与交互边界

::docs-api-table{name="types"}
::

组件和以上泛型类型均从 @moubing/bing-ui 导入；没有实例方法、分组跨列表传输、业务保存或撤销接口。itemKey/itemDisabled 的回调索引来自 items，插槽、手柄标签和事件索引来自当前顺序。

drop 在拖动时只投影位置，释放后才提交；live 可以在一次拖动中多次提交，from 保持本次拖拽起点。取消操作不会发送 drag-end；live 模式已经提交的值不会回滚，业务可在 drag-start 保存快照以实现自己的取消逻辑。

items 数据本身不会重排；业务保存应读取 order 或按它映射原始数据。仅传 order 而不响应更新会让显示继续以外部值为准。

减少动态效果会跳过外部 order 的 FLIP 与落位动画；排序项移动过渡仍由 flip/duration 控制。若需要完全关闭排序与落位过渡，同时设置 flip=false、duration=0、settleDuration=0。本页离开缓存页面时卸载所有预览，清理拖拽管理器和动画。

:::

::::
