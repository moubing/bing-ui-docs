::::article{class="doc-page"}
<p class="doc-eyebrow">组件</p>

# BingTableColumnControls {#overview}

独立的列设置入口，与 BingTable 内部面板共用列顺序、显隐、固定与重置规则。适合多个分组共用一份列偏好；组件不依赖表格实例，也不保存到浏览器或服务器。

:::section{id="shared" class="doc-section"}
## 分组共享列设置

为面板和每个表格绑定同一份 columnWidths、columnOrder、hiddenColumnKeys、columnFixed，并关闭表格的 showColumnControls。列宽仍从表头拖动调整，面板的重置会同时恢复列宽；面板没有额外的列宽输入框。

首个分组初始折叠，仍可调整第二个分组；全部折叠后也可操作。固定列按左、普通、右三个区域排列，未知顺序键会被忽略，新增列补到所属区域。显隐操作至少保留一列；外部模型仍可主动隐藏全部列。受控模型需要接收对应 update 事件。

::table-column-controls-shared-example
::

:::

:::section{id="props" class="doc-section"}
## Props
::docs-api-table{name="props"}
::
:::

:::section{id="events" class="doc-section"}
## Events
::docs-api-table{name="events"}
::
:::

:::section{id="expose" class="doc-section"}
## 实例方法
::docs-api-table{name="expose"}
::
:::

:::section{id="types" class="doc-section"}
## 类型与边界
::docs-api-table{name="types"}
::

列结构与事件载荷详见 [BingTable](/docs/components/table)。默认无自定义插槽。面板的排序手柄支持方向键，固定按钮和复选框支持键盘。下拉浮层的位置、Escape 与焦点恢复沿用 BingDropDown。每个共用配置域应只保留一个有明确名称的入口。
:::
::::
