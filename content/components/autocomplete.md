::::article{class="doc-page"}
<p class="doc-eyebrow">组件</p>

# BingAutocomplete {#overview}

BingAutocomplete 提供原位输入和候选提示，适合 Header 搜索、快速跳转与自动补全。输入框使用 BingInput，滚动使用 BingScrollbar；它只管理输入及候选交互，接口、匹配规则、导航和最近浏览由业务负责。自 0.8.0 提供。

:::section{id="basic" class="doc-section"}
## 输入与选择

默认聚焦即可打开候选，包括空输入。模型是输入文字，select 事件返回候选对象，两者互相独立。默认仅按 label 包含关键字筛选，忽略大小写；description、detail 和 meta 不参与默认搜索。选择后默认补全文字并关闭面板。

从 0.9.0 起可设置 `:open-on-empty="false"`：空字符串或纯空白时，聚焦、方向键和 `focus()` 都不会展开面板；输入有效文字后展开，清空后自动收起。该属性默认 `true`，不改变原有空输入展示候选的行为；是否提供历史记录仍由业务决定。

上下键移动候选并跳过禁用项，Enter 选择，Escape 关闭，点击外部或焦点离开后关闭。中文组词期间 Enter、方向键和 Escape 交给输入法，并保留 BingInput 的平滑光标；确认文字后才更新查询与候选。输入框保持 combobox 语义，候选为 listbox/option。

悬停或方向键高亮时，详情可使用 detail、description、meta 或 option-detail 插槽。从 0.8.2 起，候选面板进出、悬停反馈和详情切换复用 BingSelect 的动效；详情跟随当前选项垂直定位，内容与高度连续过渡。鼠标经过两个面板间的空隙有 120ms 宽限，移入详情继续保留，离开后淡出。滚动候选时先隐藏旧详情，停止后按鼠标所在项恢复；键盘滚动保持当前高亮，不被静止鼠标覆盖。

0.9.0 保留候选逐项交错出现的动画，并为面板与参与动画的可见选项设置合成层提示，减少缩放期间文字重绘造成的轻微抖动。调用方无需为此覆盖组件内部 CSS。

空间充足时详情显示在候选旁边，靠近右边缘时向左展开，并保持在视口内；窄屏改为候选下方的独立滚动区域，与当前候选同时可见。详情只放说明，全局操作放在 footer，单项操作使用下方的行尾按钮。详情为 aria-hidden 的辅助预览，必需信息仍应放在候选可访问名称中；长 label 的完整内容仍作为候选的可访问名称。减少动态效果时跳过动画。

::autocomplete-basic-example
::

:::

:::section{id="controlled" class="doc-section"}
## 业务筛选与异步加载

设置 filter=false 后，组件使用调用方传来的全部候选及顺序。loading 和 error 期间不能选择旧结果；请求取消、较旧响应过滤、权限校验和重试由业务实现。以下示例在本地模拟筛选和失败，不发送请求。

导航型搜索可同时关闭 completeOnSelect 和 closeOnSelect；异步跳转成功后调用 close()，失败时保留输入和候选。以下受控示例还设置 `openOnEmpty=false`，输入前只展示输入框。focus() 可用于业务快捷键，但业务应避开已打开的模态框和中文组词过程；它同样遵守空输入开关。

::autocomplete-controlled-example
::

:::

:::section{id="actions" class="doc-section"}
## 独立行尾操作（0.19.0 起）

设置 `optionActionLabel` 后，每条候选右侧显示独立按钮，可通过 `option-action` 插槽替换为图标。组件负责按钮、禁用态与可访问名称；插槽只放非交互内容，不嵌套按钮或链接。点击结果本身或在输入框按 Enter 仍触发 `select`；按钮通过 `option-action` 事件同步交给业务处理，不补全文字、不触发选择、不关闭候选。新标签页应在该事件内立即调用 `window.open`，避免等待异步请求后丢失浏览器用户激活。

启用按钮时浮层使用两列 `grid / row / gridcell` 语义，将候选内容与操作分开；不启用时仍为 `listbox / option`。输入框按 F2，或上下键选中后按右键，可聚焦当前按钮；按钮内上下键切换并跳过禁用项，Enter / Space 激活，左键、F2 或 Shift+Tab 返回输入，Escape 收起并返回输入，Tab 离开搜索。普通文字编辑中的左右键仍由输入框处理。以下示例仅显示操作结果，真实导航由业务实现。

::autocomplete-actions-example
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
:::section{id="slots" class="doc-section"}
## Slots
::docs-api-table{name="slots"}
::
:::
:::section{id="expose" class="doc-section"}
## Expose
::docs-api-table{name="expose"}
::
:::
:::section{id="types" class="doc-section"}
## 公开类型
::docs-api-table{name="types"}
::
:::
::::
