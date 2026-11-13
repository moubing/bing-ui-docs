::::article{class="doc-page"}
<p class="doc-eyebrow">Components</p>

# BingForm {#overview}

BingForm 是表单容器，负责响应式布局、统一尺寸/禁用上下文、Zod schema 校验、提交事件和表单方法。具体字段标签、错误消息和控件关联由 BingFormItem 承接。

`schema` 使用从包入口导出的 `BingFormSchema` 类型，只要求 `safeParseAsync(data: unknown)` 返回校验结果 Promise：成功为 `{ success: true, data }`，失败为 `{ success: false, error: { issues: [{ path, message }] } }`。`path` 是字符串、数字或 symbol 组成的字段路径数组，`message` 是错误文本。现有 Zod schema 可直接传入，同步、异步规则和转换均兼容；使用 Zod 示例时需自行安装 `zod@^4`。从 0.12.4 起，公共声明不再引用 Zod，未安装 Zod 的项目也能在 `skipLibCheck: false` 下检查组件类型。

:::section{id="layout-validation" class="doc-section"}
## 布局与校验

`layout` 提供 grid、stack、inline 三种排布；`columns` 控制 grid 列数，`gap` 控制间距（stack 只使用行间距）。尺寸 sm/md/lg 对应主要输入控件高度 32/36/40px，字段和控件默认继承 Form 的尺寸。

`BingFormItem.required` 只显示必填星号，不会自动增加校验规则。实际约束写在 Form 的 Zod `schema` 中，`FormItem.prop` 与 `model`、schema 的字段路径对应。例如数组至少选一项，需要 `z.array(z.string()).min(1, '至少选择一个通知渠道')`，并将同一个数组通过 `v-model` 传给 `BingCheckboxGroup`。

提交校验失败时仍会触发 `submit`，随后触发 `invalid`。业务回调必须先判断 `payload.valid`，失败时直接返回，避免执行保存。提交按钮使用 `BingButton` 的 `html-type="submit"`。

默认 `validateTrigger` 为 `'auto'`：首次输入时不立刻报错，离开字段或提交时校验；字段已有错误后，修改内容会自动复查。需要每次输入都校验时，显式设置 `['change', 'blur', 'submit']`。

如果配置中既没有 `auto` 也没有 `submit`，例如 `['manual']`，提交事件不会自动执行 schema 校验，`payload.valid` 会直接为 true。保存前应保留提交校验，或主动调用 `await formRef.value?.validate()`，只有返回 true 才执行保存。未传入 `schema` 时也不会执行规则校验。

默认 `focusOnError=true`，提交失败后聚焦页面顺序中的首个可用错误字段；`scrollToError` 独立控制滚动。异步校验期间继续编辑或改变焦点时不会再把焦点拉回。手动 `validate()` 可滚动定位错误，但不会主动聚焦；`validateField()` 只更新相关错误。

::form-layout-example
::
:::

:::section{id="methods" class="doc-section"}
## 表单方法

通过 ref 可以主动触发表单校验、单字段校验、清空错误和重置字段。`validateField` 会保留其他字段的错误，只替换当前字段相关的错误。

::form-methods-example
这个示例里邮箱字段包含异步 refinement，Form 内部统一使用 `safeParseAsync`，所以同步和异步 Zod 规则可以混合使用。示例使用 `['manual']`，通过按钮主动调用校验方法；异步规则在本地模拟邮箱占用检查，没有请求远程接口。

`clearValidate()` 只清除错误，不修改字段值；`resetFields()` 将字段恢复到表单挂载时的初始快照，并清除错误，不等于把所有字段清空。方法示例重置后邮箱为 `taken@example.com`、昵称为 `Bo`。
::
:::

:::section{id="auto-focus" class="doc-section"}
## 自动校验与键盘提示

此示例省略 `validateTrigger` 和 `focusOnError`，直接使用新版默认行为。先输入一个字符再按 Tab，可观察首次失焦报错；继续补全时错误自动消失。提交失败会定位首个错误字段。

实验性 `nextStepHint` 默认关闭，勾选后提示实际下一个 Tab 落点；它不会跳过浏览器的正常焦点顺序，也不代表字段已校验通过。焦点离开表单、表单禁用或关闭开关时提示消失；本例校验通过后主动关闭提示。含清除按钮、弹层或自定义控件时，下一落点可能仍在当前字段内，此时不显示跨字段提示。

::form-auto-focus-example
::
:::

:::section{id="props" class="doc-section"}
## 属性

::docs-api-table{name="props"}
::
:::

:::section{id="events-expose" class="doc-section"}
## 事件与方法

### 事件 {#events}

::docs-api-table{name="events"}
::

### 暴露方法 {#expose}

::docs-api-table{name="expose"}
::
:::
::::
