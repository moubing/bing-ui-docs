::::article{class="doc-page tag-doc"}
<p class="doc-eyebrow">组件</p>

# BingTag {#overview}

BingTag 是轻量状态标签，用于展示分类、状态、数量摘要和可移除筛选项。它支持三种尺寸、六种语义 tone、glass/soft 两种视觉风格、可关闭状态、禁用状态和默认插槽自定义内容。

:::section{id="playground" class="doc-section"}
## 基础配置

使用 `label` 设置文案，`tone` 表达语义颜色，`variant` 控制边框与圆角风格。开启 `closable` 后会显示关闭按钮并触发 `close` 事件。

基础示例仅统计关闭次数，标签会继续显示。要真正移除标签，在 close 回调中更新列表或控制组件是否渲染；Tag 没有 visible/v-model 协议。

::tag-basic-example
::

:::

:::section{id="tones-variants" class="doc-section"}
## 颜色与风格

`tone` 用于表达状态含义。默认 `glass` 在新版中采用细边框和紧凑圆角；`soft` 使用无可见边框的胶囊形状。两者都使用主题语义底色，Tag 没有 Card 那样的背景模糊参数。

::tag-tones-example
::

:::

:::section{id="sizes" class="doc-section"}
## 尺寸

`sm/md/lg` 的高度分别为 20/24/28px。`sm` 适合表格单元格和状态列表，`md` 是默认尺寸，`lg` 适合强调当前筛选或页面摘要。

::tag-sizes-example
::

:::

:::section{id="closable" class="doc-section"}
## 可关闭标签

可关闭标签不会自己删除，需要业务侧在 `close` 事件里移除数据。当 `disabled` 为 true 时，关闭按钮会禁用，也不会触发 `close`。

::tag-closable-example
::

:::

:::section{id="custom-slot" class="doc-section"}
## 自定义内容

默认插槽可以覆盖 `label`，适合放入状态点、图标或组合文本。组件内部会对标签内容做省略处理，避免长文本撑破布局。

关闭按钮的默认名称只读取 label，不会读取插槽文字：有 label 时是 `移除 <label>`，否则为 `移除标签`。仅通过插槽显示文案且可关闭时，建议显式设置 `closeAriaLabel`。

::tag-slot-example
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
