::::article{class="doc-page radio-doc"}
<p class="doc-eyebrow">组件</p>

# BingRadio {#overview}

BingRadio 是单选项组件，用于在一组选项中选择一个值。它支持主文案、描述文案、尺寸、禁用、状态和 GSAP 选中动效；独立使用时直接更新自己的`v-model`，放进 BingRadioGroup 后会自动接入组内的值、name、尺寸和状态。

:::section{id="playground" class="doc-section"}
## 基础配置

单个 Radio 的核心是 `modelValue` 与 `value` 的比较。当二者相等时，当前项就是选中状态；点击当前项会把它的 `value` 写回 `v-model`。

`BingRadioValue` 为 `string | number | boolean`，比较使用严格相等。`value="0"` 是字符串，`:value="0"` 才是数字；布尔值同样使用绑定，例如 `:value="false"`。模型可设为 `null` 表示未选择；再次点击已选项不会反选。

新版会为每个 Radio 自动生成唯一 ID，无须为了避免重复而手工指定。同一组独立 Radio 仍需共用模型和 `name`，不同业务组选用不同 `name`；需要统一键盘导航和组级状态时使用 RadioGroup。

RadioGroup 的 `options` 模式也会生成唯一子项 ID。需要业务指定的子项 ID 时，可采用下方的默认插槽写法。

::radio-basic-example
::

:::

:::section{id="states" class="doc-section"}
## 尺寸、描述与状态

`description` 会让 Radio 进入带说明的排版，控件与文案顶部对齐。`status` 常用于表单校验，独立使用或在 RadioGroup 中都可以继承到视觉状态。

`status` 只控制视觉状态，不会自动建立必选规则。下面五项共用一个选中值，用于对比尺寸与状态。sm/md/lg 的圆点控件为 16/18/20px，带标签的最小点击高度为 32/36/40px；默认继承 RadioGroup/Form，最终回退到 md。

::radio-states-example
::

:::

:::section{id="inside-group" class="doc-section"}
## 放在 RadioGroup 中

当 BingRadio 放进 BingRadioGroup 时，子项会通过上下文读取 Group 的 `modelValue`、`disabled`、`size`、`status` 和 `name`。这种写法适合每个选项都需要自定义内容的场景。

组内只给 Group 绑定 `v-model`，每个 Radio 提供不同的 `value`，从 Group 监听 `change(value, event)`；组内 Radio 不再单独发出 `update:modelValue` 或 `change`。不要为子项设置不同的 name，避免破坏原生单选分组。整组禁用优先于子项的 `disabled=false`。

::radio-group-example
::

:::

:::section{id="events-demo" class="doc-section"}
## 事件反馈

独立使用时，Radio 被选中才会触发 `update:modelValue` 和 `change`。如果它已经处于选中状态，再点击不会产生新的值变化。

`change` 处理函数接收 `(value: BingRadioValue, event: Event)` 两个参数。原生 input 的字符串 value 与组件发出的模型类型不同，业务优先读取第一个参数。

::radio-events-example
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
