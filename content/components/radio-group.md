::::article{class="doc-page radio-group-doc"}
<p class="doc-eyebrow">组件</p>

# BingRadioGroup {#overview}

BingRadioGroup 是单选组容器，用于在多个互斥选项中选择一个值。它支持 `options` 自动渲染、默认插槽自定义 Radio、方向/尺寸/状态统一下发、整组禁用、焦点事件和键盘方向键切换，适合表单单选、设置项和模式切换。

:::section{id="playground" class="doc-section"}
## 基础配置

使用 `v-model` 保存当前选中的单个值；`direction` 控制排列方式，`size` 和 `status` 会传给组内所有 Radio。

`BingRadioValue` 是 `string | number | boolean`，可用 `ref<BingRadioValue | null>(null)` 表示初始未选择。0 和 false 都可以是合法选项值，判断是否为空应与 null 比较。模板中的数字或布尔值使用绑定语法，例如 `:value="0"`、`:value="false"`，不要写成字符串属性。点击已选中的 Radio 不会反选；外部赋值为 null 才能清空。

新版为 Group 和每个 Radio 自动生成唯一 ID，默认 name 也会隔离不同组；普通多实例使用可省略 id/name，以下示例保留名称便于业务识别。`options` 渲染仍以 `String(value)` 作为 Vue key，因此同一 options 数组应避免混用 0 与 "0" 等字符串化后相同的值。

尺寸默认继承 Form，最终回退到 md；sm/md/lg 的圆点控件为 16/18/20px，带标签的最小点击高度为 32/36/40px。整组禁用优先于子项的 `disabled=false`。

::radio-group-basic-example
::

:::

:::section{id="options" class="doc-section"}
## Options 自动渲染

`options` 适合结构统一的单选项。每个选项至少需要 `label` 和 `value`，可选的 `description` 会显示为辅助说明。

::radio-group-options-example
::

:::

:::section{id="custom-slot" class="doc-section"}
## 自定义选项内容

需要更复杂的选项排版时，可以在默认插槽里手写 `BingRadio`。子项只需要提供 `value`，选中状态和事件会交给 Group 统一处理。

::radio-group-slot-example
::

:::

:::section{id="keyboard-events" class="doc-section"}
## 键盘切换与事件

Group 会监听 `ArrowRight`、`ArrowDown`、`ArrowLeft` 和`ArrowUp`。当焦点在组内时，方向键会移动到下一个可用 Radio，并跳过禁用项。

方向键移动焦点时会同时选中目标，首尾循环；此组件没有 Tabs 的 manual 激活模式或 loop 属性。`change` 接收 `(value: BingRadioValue, event: Event)` 两个参数，不是 payload 对象。focus/blur 按整个组的边界触发，组内换焦点不会重复触发。

`status="error"` 只表示状态样式，必选规则仍需由 Form schema 或业务校验；在 FormItem 中使用时，模型字段和 schema 路径需通过 FormItem 的 `prop` 对应。

::radio-group-keyboard-example
::

:::

:::section{id="props" class="doc-section"}
## 属性

::docs-api-table{name="props"}
::

:::

:::section{id="options-api" class="doc-section"}
## Option 结构

::docs-api-table{name="option"}
::

:::

:::section{id="slots-events" class="doc-section"}
## 插槽与事件

### 插槽 {#slots}

::docs-api-table{name="slots"}
::

### 事件 {#events}

::docs-api-table{name="events"}
::

:::

::::
