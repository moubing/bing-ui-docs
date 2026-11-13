::::article{class="doc-page textarea-doc"}
<p class="doc-eyebrow">组件</p>

# BingTextarea {#overview}

BingTextarea 是多行文本输入组件，适合备注、描述、反馈和长文案编辑。它支持平滑光标、自动高度、字数统计、最大长度、清除按钮、尺寸、状态、resize 控制，以及通过 ref 暴露原生 textarea 操作方法。

:::section{id="playground" class="doc-section"}
## 基础配置

使用 `v-model` 绑定文本值，通过 `rows`、`autosize`、`resize`、`showCount` 和 `clearable` 控制输入体验。

模型始终使用字符串，空值用 `''`，不要传 null。`input` 回调接收 `(value: string, event: Event)` 两个参数，`v-model` 用于同步外部状态。

`readonly` 保留聚焦和文本选择，同时阻止编辑并隐藏清除按钮；`disabled` 则不可聚焦。Textarea 的模型仍是字符串，0.18.0 起 clearable 默认 false，需要清除入口时显式开启。

从 0.10.0 起，`smoothCaret` 默认开启，与 BingInput 使用相同的约 90ms 光标位移。输入、退格、方向键、换行和自动折行时跟随原生插入点；输入值即时更新，不对文字做防抖。自动高度、内部滚动和容器宽度变化时重新校准，中文输入法组词期间只读取原生选区焦点端，不改动选区或候选窗口。

可用 `:smooth-caret="false"` 关闭。选择普通文本、只读、禁用、触屏、减少动态效果、高对比度、双向文字或无法可靠测量时回到原生光标；失焦和卸载时清理动画与测量节点。下方“平滑光标”开关可对照体验，多行输入和原生键盘行为保持一致。

::textarea-basic-example
::

:::

:::section{id="autosize-count" class="doc-section"}
## 自动高度与字数统计

`autosize` 为 `true` 时会使用 `rows` 作为最小行数；传入对象时可以用 `minRows` 和 `maxRows` 限制高度范围。

行数与高度限制使用有效正数，且 minRows 不大于 maxRows。`showCount` 按 JavaScript 字符串 length 统计，部分 emoji 会计为 2；maxLength 是原生输入限制，不会截断程序赋值。可用 countFormatter 自定义文案；计数只在接近或达到上限时播报，组词草稿实时改变计数和高度，确认后才发布模型。

`autosizeTransition` 默认开启 120ms 过渡；一次超过三行、到达 maxRows、宽度变化或减少动态效果时直接设高。滚动条根据最终高度决定，不随过渡中的临时溢出闪现。`resize(height)` 在初次测量和实际高度稳定后各通知一次，参数仅含 textarea 高度，不含计数区和外框。浮层可在回调读取自身外框，窗口和锚点变化仍由业务监听。

0.6.0 关闭 autosize 会清理组件管理的行内高度及 overflow-y，恢复 rows 和 resize 的原生行为，无需用 key 重建。容器宽度改变时会重新测量换行后的高度。开启 showCount 时计数位于底栏，不遮挡正文。

::textarea-autosize-example
::

:::

:::section{id="resize-status" class="doc-section"}
## Resize、Block 与状态

`resize` 直接控制原生 CSS resize 行为；`block` 让组件撑满父容器。`status` 用于展示校验反馈，也可以从 BingFormItem 继承。

状态样式不包含校验规则。三个示例分别绑定各自的文本，输入或清除会同步更新模型。

::textarea-resize-example
::

:::

:::section{id="events-demo" class="doc-section"}
## 清除与事件

输入时会触发 `update:modelValue` 和 `input`。清除按钮会把值更新为空字符串，触发 `clear`，并重新聚焦 textarea。

清除不触发 input；需要同时处理输入和清除时监听模型更新。clear 没有参数，清除后焦点留在控件内的 5 秒内可 Ctrl / ⌘+Z 撤销；新输入、离开控件或超时后失效。开启清除固定预留槽位，首字输入不重新折行。内部按钮与滚动条间移动不触发 blur 校验。

::textarea-events-example
::

:::

:::section{id="submit" class="doc-section"}
## 提交快捷键与高度通知

`submitOn` 的公开类型为 `BingTextareaSubmitOn = 'none' | 'enter' | 'mod-enter'`。默认 none 保持换行；enter 用于短标注，Shift+Enter 仍换行；mod-enter 用于长说明，以 Ctrl / ⌘+Enter 提交。`submit(value,event)` 不在输入法确认前触发，业务 keydown.preventDefault 可阻止提交。快捷键需要可见说明及 aria-describedby。

::textarea-submit-example
::
:::

:::section{id="expose" class="doc-section"}
## 实例方法

组件通过 `defineExpose` 暴露原生 textarea 和 `focus()`、`blur()`、`select()`，适合弹窗打开后自动聚焦、批量编辑时选中文本。

::textarea-methods-example
::

:::

:::section{id="props" class="doc-section"}
## 属性

::docs-api-table{name="props"}
::

:::

:::section{id="events-expose" class="doc-section"}
## 事件与暴露方法

### 事件 {#events}

::docs-api-table{name="events"}
::

### 暴露方法 {#expose-list}

::docs-api-table{name="expose"}
::

:::

::::
