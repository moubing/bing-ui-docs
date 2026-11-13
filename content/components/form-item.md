::::article{class="doc-page"}
<p class="doc-eyebrow">Components</p>

# BingFormItem {#overview}

BingFormItem 是 BingForm 里的字段容器，负责标签、必填标记、字段跨度、帮助/错误消息、可访问性属性和控件上下文注入。它不会自己定义校验规则，而是通过`prop` 连接 Form 的 schema 错误。

`prop` 必须与 Form 的 model/schema 字段路径对应，控件的 `v-model` 也绑定同一字段。没有 Form schema 时，`required` 只显示星号，不会产生必填校验。若通过 Form 的 `submit` 回调保存数据，必须先判断 `payload.valid`；校验失败时该回调仍会触发。

:::section{id="label-message" class="doc-section"}
## 标签与消息

`labelPosition` 可以覆盖单个字段的标签位置；`help` 和校验错误共用消息槽，出现错误时会用第一条错误替换帮助文本，并过渡消息内容与高度。清空错误后重新显示帮助文本，字段值保留；减少动态效果偏好下消息直接更新。

`showMessage=false` 只隐藏消息区域，不会清除错误或关闭校验，插槽的 `invalid` 仍可为 true。`disabled`、`size` 和 `labelWidth` 由 Form 传入，均不是 FormItem 的属性。

::form-item-message-example
::
:::

:::section{id="span-layout" class="doc-section"}
## 字段跨度

`span` 用于 Form 的 grid 布局。它可以是数字，也可以按 `base`、`sm`、`md`、`lg`、`xl` 提供响应式值，并会自动限制在当前列数以内。

类型中的 `BingFormBreakpoint` 就是 `'base' | 'sm' | 'md' | 'lg' | 'xl'`；缺省断点继承前一个较小断点的值，从 1 开始。示例显式设置 Form 的列数为 `{ base: 1, sm: 2, xl: 3 }`，这是演示配置；Form 组件默认列数为 `{ base: 1, sm: 2, xl: 5 }`。

断点按 Form 容器宽度计算，`sm/md/lg/xl` 分别从 640/768/1024/1280px 起生效。因此宽屏页面里的窄预览区也可能只显示一列。新版 `stack` 会自动让字段占满单列，切换布局时可以保留原有 span，不会再产生隐式列。

::form-item-span-example
::
:::

:::section{id="slot-scope" class="doc-section"}
## 默认插槽参数

Input、Select、Textarea 等 Bing 控件会自动读取 FormItem 注入的上下文。原生 input 或自定义控件需要自行绑定 `v-model`，并从默认插槽读取 `id`、`status`、`ariaDescribedby`、`invalid`、`disabled` 和 `size`。

原生 input 不会自动通知 FormItem 校验；下面用 `@blur` 调用 `await formRef.value?.validateField('custom')`，提交时由 Form 校验。`size` 是 `sm/md/lg` 语义尺寸，不能直接赋给原生 input 的数字型 `size` 属性；示例通过 `custom-input--lg` 等样式类适配尺寸，通过 `custom-input--error` 展示错误状态。

0.6.0 发布包的插槽运行时名称仍为 `ariaDescribedby`，类型声明仍写成 `aria-describedby`。示例保留 `descriptionId` 兼容两种名称；传到 DOM 时使用 `aria-describedby`。

新版已为不同字段、控件及消息生成独立 ID。单个 Bing 控件会注册自己的实际 ID，字段标签可正确关联显式 id；CheckboxGroup/RadioGroup 使用 `aria-labelledby` 关联字段标签。原生或自定义控件仍需按下例绑定插槽 id 和消息属性；同一字段含多个独立控件时，要为每个控件提供独立的可访问名称。

::form-item-slot-example
::
:::

:::section{id="props" class="doc-section"}
## 属性

::docs-api-table{name="props"}
::
:::

:::section{id="slot-props" class="doc-section"}
## 插槽参数

::docs-api-table{name="slots"}
::
:::
::::
