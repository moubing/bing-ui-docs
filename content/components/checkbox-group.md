::::article{class="doc-page checkbox-group-doc"}
<p class="doc-eyebrow">组件</p>

# BingCheckboxGroup {#overview}

BingCheckboxGroup 是多选组容器，用于把多个 BingCheckbox 组合成同一个`v-model` 数组。它可以通过 `options` 快速生成选项，也可以用默认插槽手写复杂选项内容，并统一下发尺寸、禁用、状态、name、焦点和表单校验上下文。

:::section{id="playground" class="doc-section"}
## 基础配置

最常见的用法是传入 `options`，每个选项用 `value` 写入数组。`direction` 控制排列方式，`size` 和 `status` 会同步影响组内所有选项。

`BingCheckboxGroupValue` 是 `string | number`，选中模型必须是数组，例如 `ref<BingCheckboxGroupValue[]>([])`；它不是每项一个布尔值。每个选项使用唯一值，数字与字符串应保持类型一致。禁用控制用户操作，业务仍可通过赋值更新模型；“全选可用项”显式排除了禁用选项。

::checkbox-group-basic-example
::

:::

:::section{id="options" class="doc-section"}
## Options 自动渲染

`options` 适合结构统一的多选项。选项可以带 `description`，也可以在单个选项上设置 `disabled`，禁用状态会和 Group 的禁用状态一起计算。

::checkbox-group-options-example
::

:::

:::section{id="custom-slot" class="doc-section"}
## 自定义选项内容

需要更复杂的排版时，可以在默认插槽里手写 `BingCheckbox`。子 Checkbox 会自动读取 Group 的 `modelValue`、`disabled`、`size`、`status` 和 `name`，因此只需要提供自己的 `value`。

::checkbox-group-slot-example
::

:::

:::section{id="status-events" class="doc-section"}
## 状态与事件

Group 会在根节点上设置 `role="group"` 与状态类名。当用户切换任意子项时，Group 会发出完整数组；焦点进入或离开整组时，也会分别触发`focus` 和 `blur`。

`change` 回调接收两个参数 `(value: BingCheckboxGroupValue[], event: Event)`，第一个是完整选中数组，不是本次点击的单个值或 payload 对象。焦点在同组子项之间移动时，不会重复触发组级 focus/blur。

`status="error"` 只控制状态样式，不会自动校验必选或最少数量。在 FormItem 中使用时，Form 的模型和 schema 路径通过 FormItem 的 `prop` 对应；例如 Zod 数组规则 `.min(1)` 才会要求至少一项。

::checkbox-group-events-example
::

::checkbox-group-status-example
::

:::

:::section{id="batch" class="doc-section"}
## 刷选、范围选择与全选

dragSelect 和 rangeSelect 默认均为 false。开启后鼠标或触控笔可以跨项刷选，Shift + 点击从上次点击项选择范围，跳过禁用项；触摸保留原生滚动。刷选过程中模型即时更新，松开后发出一次 change；范围选择也只发出一次 change。全选和半选由业务计算，模型更新立即完成，级联仅影响显示节奏。

::checkbox-group-batch-example
::

:::

:::section{id="props" class="doc-section"}
## 属性

新版为 Group 与子 Checkbox 自动生成唯一 ID，默认 name 在组内统一、组间独立。示例显式提供名称便于业务识别，普通多实例使用可省略 id/name。`ariaLabel` 提供组名，`ariaDescribedby` 关联说明元素的 ID。

尺寸默认继承 Form，最终回退到 md；sm/md/lg 的方框为 16/18/20px，带标签的最小点击高度为 32/36/40px。整组禁用优先于子项的 `disabled=false`，启用组后，单项禁用仍然生效。

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
