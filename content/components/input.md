::::article{class="doc-page input-doc"}
<p class="doc-eyebrow">组件</p>

# BingInput {#overview}

BingInput 用于文本、搜索、邮箱、密码、电话、URL 和数值输入。它内置尺寸、状态、图标、清除按钮、防抖事件和平滑光标，并能在 BingFormItem 中继承尺寸、禁用和校验状态。

:::section{id="playground" class="doc-section"}
## 基础配置

使用 `v-model` 绑定输入值，通过 `type`、`size`、`status`、`clearable` 和 `block` 控制常用行为。

模型与更新事件均为 `BingInputValue = string | number | null`，从包根导入；公开类型不会根据 `type` 自动收窄。示例用 `ref<BingInputValue>` 接收更新；业务必须保存字符串时，可使用 `:model-value` 配合 `@update:model-value="value = String($event ?? '')"`。`autocomplete` 默认为 `off`。图标示例使用 `lucide-vue-next 1.0.0`，运行前显式安装该依赖。

::input-basic-example
::

:::

:::section{id="states" class="doc-section"}
## 尺寸与状态

`sm / md / lg` 的高度分别为 32 / 36 / 40px，`status` 用于展示校验状态。放在表单里时，尺寸和状态可以由 `BingFormItem` 统一下发；显式属性优先于继承值。

::input-states-example
::

:::

:::section{id="icon-clear" class="doc-section"}
## 图标与清除

通过 `icon` prop 可以传入图标组件，也可以使用 `icon` 插槽完全自定义左侧内容。只有 `search` 类型默认开启清除；文本等其他类型需要显式 `clearable`。开启后固定预留清除槽位，空值按钮隐藏并退出 Tab 顺序，首次输入不会挤动文本。

禁用或只读时不会显示清除按钮。iconLabel 只命名图标，不会命名输入框；输入框应关联 label 或提供 ariaLabel。自定义 icon 插槽优先于 icon prop，插槽内容的可访问性由使用方设置。

::input-icons-example
::

:::

:::section{id="number" class="doc-section"}
## 数值输入

`type="number"` 提供增加、减少按钮，支持点击、长按、方向键和 Shift 十倍步进，达到边界后对应按钮禁用。`clampOnBlur` 默认 true，失焦或 Enter 时根据 `min / max / step` 规整，`step="any"` 不对齐。负号、小数、指数中间态保留为显示草稿，不通知业务；父级拒绝更新后恢复已接受值。

0.18.0 起数字模型只发布 `number / null`，清空从 `''` 改为 `null`；`input` 和 `debounced-input` 仍返回字符串。不要用真假判断丢掉数字 `0`。`enter(value,event)` 在规整后发送，原生 `change` 仍接收 Event。需要提交时优先用 enter，避免自行处理组词按键。本例显式开启清除，并将防抖设为 0。

::input-number-example
::

:::

:::section{id="editing" class="doc-section"}
## 密码、计数与前缀拖动

密码框默认有显隐按钮，切换保留焦点和选区；已有业务显隐入口时设置 `passwordToggle=false`。保留 `current-password / new-password` 等自动填充语义。`prefix / suffix` 支持字符串与插槽，计数采用等宽数字，只在接近或达到上限时播报；loading 不接管查询。

::input-editing-example
::

`scrub` 需要 number 与 prefix，横拖每 4px 一个步长，Shift 十倍。拖动连续发布模型，释放时为已接受的变化发送一次原生 change；Esc、窗口失焦、指针取消会撤销。受控拒绝时保留手势预览，结束后回到父级值。内部按钮间焦点移动不会触发 blur 校验，离开整个控件后才校验。

::input-controlled-example
::
:::

:::section{id="readonly-caret" class="doc-section"}
## 只读与平滑光标

`readonly` 保留聚焦和选择文本的能力，同时阻止编辑、清除和数值步进。`disabled` 则不可聚焦。

`smoothCaret` 默认开启。它在支持精确定位的文本输入中平滑移动光标，原生输入框仍负责编辑和选区。从 0.8.2 起，中文等输入法组词期间也保持同一条平滑光标，根据原生文本与选区焦点端定位，不修改真实选区或候选窗口。测量合并到每帧一次；确认或取消组词后继续跟随实际插入点。

从 0.9.0 起，聚焦时立即定位平滑光标，普通鼠标按下也会保留它，避免先出现原生光标再切换的短暂闪动。拖动选择文本仍使用原生选区反馈，业务不需要自行隐藏原生光标或增加聚焦延迟。

密码、邮箱、数字输入，以及普通非折叠选区、触摸、减少动态效果、无法可靠测量等场景使用原生光标；也可以显式设置 `smoothCaret=false`。

::input-readonly-example
::

:::

:::section{id="debounce-events" class="doc-section"}
## 防抖与事件

普通输入会即时触发模型与 `input` 更新，`debounced-input` 按照 `debounceDelay` 延迟触发，适合搜索建议、远程查询和自动保存。

中文等输入法组词期间，原生输入框继续显示正在输入的文字，组件暂停模型、`input`、表单校验和防抖通知，避免拼音片段反复触发搜索或重绘。确认后只发布一次最终值，`input` 的 event 此时可能是 `compositionend`；取消且内容未改变时不发布模型更新，并恢复组词开始前待发的防抖通知。失焦时若仍有未结束的组词，按输入框最终内容收尾。

有效输入会立即更新模型和 input，只有 debounced-input 延迟。后续输入重置计时；延迟向下取整且最小为 0，0 表示立即通知。清除取消待发通知，发送文本空串或数字 null 的模型、clear()、debounced-input('')，并聚焦输入框，不触发 input。卸载取消待发通知。外部程序改值不主动触发 input 或 debounced-input，也不替代已排队的原生输入通知；组词期间重渲染不覆盖显示草稿。

::input-debounce-example
::

:::

:::section{id="expose" class="doc-section"}
## 实例方法

组件通过 `defineExpose` 暴露了原生 input 和三个方法，适合在复杂表单、弹窗打开后自动聚焦、批量编辑时控制输入框。

ref 在挂载后才可调用。select() 使用原生选择行为；此例用 text 类型读取 selectionStart/selectionEnd，email 等类型不一定支持文本选区。禁用状态下原生输入框无法获得焦点。

::input-methods-example
::

:::

:::section{id="props" class="doc-section"}
## 属性

::docs-api-table{name="props"}
::

:::

:::section{id="slots-events" class="doc-section"}
## 插槽、事件与暴露方法

### 插槽 {#slots}

::docs-api-table{name="slots"}
::

### 事件 {#events}

::docs-api-table{name="events"}
::

### 暴露方法 {#expose-list}

::docs-api-table{name="expose"}
::

:::

::::
