::::article{class="doc-page checkbox-doc"}
<p class="doc-eyebrow">组件</p>

# BingCheckbox {#overview}

BingCheckbox 是基础布尔选择组件，用于开关类确认、批量选择项和表单勾选项。它支持选中、半选、禁用、不同尺寸、圆角/圆形形状、主色/辅助色 tone，并能在 CheckboxGroup 与 FormItem 中继承上下文。

:::section{id="playground" class="doc-section"}
## 基础配置

使用 `v-model` 绑定布尔值；`indeterminate`用于展示“部分选中”的视觉状态，常见于父级批量选择。

独立使用时 `modelValue` 是 boolean，`change` 接收 `(value: boolean, event: Event)` 两个参数。放入 CheckboxGroup 后，为子项提供唯一 `value`，由 Group 的数组模型决定选中状态；不要再给子项分别绑定布尔模型，监听数组变化应使用 Group 的 change。

::checkbox-basic-example
::

:::

:::section{id="states" class="doc-section"}
## 选中、半选与禁用

半选态由 `indeterminate` 单独控制，不会自动改变 `modelValue`。如果需要根据子项自动计算半选态，应该在业务层或 `BingCheckboxGroup` 外部处理。

组件没有 `update:indeterminate` 事件，也不会替业务计算“全选”。常用规则是：全部子项选中时父项 modelValue 为 true；已选数量大于 0 且少于总数时 indeterminate 为 true。父项点击后更新子项数组，再重新计算两个值。下面的固定半选项只用于展示独立的布尔值与半选外观。

::checkbox-states-example
::

:::

:::section{id="sizes-tones" class="doc-section"}
## 尺寸、形状与颜色

`size` 可以使用 `sm`、`md`、`lg` 预设，方框尺寸依次为 16/18/20px，带标签时的最小点击高度为 32/36/40px；默认继承 Group/Form，没有上下文时使用 md。也可以传入数字自定义方框像素尺寸。`tone` 用于区分主色和辅助色。

新版会自动生成唯一 ID，点击各自标签可准确切换对应项。整组禁用后，子项即使显式设置 `disabled=false` 仍不可操作。

::checkbox-sizes-example
::

:::

:::section{id="decorative" class="doc-section"}
## 装饰模式

`decorative` 模式只渲染视觉状态，不渲染原生 `input`。它适合在 Select、Table 等复杂组件内部作为只读选择标记。

装饰标记带有 aria-hidden，保留选中动画，但没有悬停幽灵勾、按压缩放或扩展命中区。它不会取得焦点、切换状态或参与原生表单提交；外部按钮负责语义和键盘操作。

::checkbox-decorative-example
::

:::

:::section{id="events-demo" class="doc-section"}
## 事件反馈

单独使用时，点击会触发 `update:modelValue` 和 `change`。放在 CheckboxGroup 中时，子项会交给 Group 更新数组值。

::checkbox-events-example
::

:::

:::section{id="interaction" class="doc-section"}
## 交互与三态切换

未选、半选、选中共用可打断的 SVG 过渡，快速连点会落到最新状态。普通复选框支持按压与悬停预览；禁用只减淡控件，错误状态保留勾选颜色和外部错误轮廓。无文字时扩展命中区，不改变布局尺寸；相邻无文字控件需留足间距。可用 --bing-checkbox-stroke 调整勾线粗细，sm/md/lg 默认为 1.5/1.75/2px。减少动态效果直接更新状态。

::checkbox-interaction-example
::

:::

:::section{id="props" class="doc-section"}
## 属性

::docs-api-table{name="props"}
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
