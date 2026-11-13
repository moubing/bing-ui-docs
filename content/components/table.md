::::article{class="doc-page table-doc"}
<p class="doc-eyebrow">组件</p>

# BingTable {#overview}

BingTable 是数据表格组件，用于展示结构化数据，并处理选择、排序、树形展开、分页、虚拟滚动、固定列、列宽调整和列设置。它把行数据、列配置和交互状态拆开管理，适合中后台列表、配置矩阵和带层级的数据视图。

:::section{id="basic" class="doc-section"}
## 基础表格

`columns` 定义列，`data` 提供行数据，`rowKey` 提供稳定行标识。常用状态都可以用 `v-model` 受控，例如选择、展开、分页、排序和列设置。

本例完整绑定选择、展开、分页、排序和列设置。每页 3 条表示 3 个顶层项目，展开子项额外显示；父子选择不级联。表头全选覆盖当前页已展开的未禁用行，包括虚拟列表中尚未挂载的这些行，保留其他页、折叠子行和未知的已有键。

::table-basic-example
::

:::

:::section{id="tree" class="doc-section"}
## 树形行

行数据包含 `children` 时，Table 会按树形结构展平渲染。`treeColumnKey` 可以指定展开按钮和缩进出现在哪一列，`expandedRowKeys` 用于受控展开状态。

树形示例单独维护展开值。rowKey 必须全树唯一且稳定；回调 index 为原始同级序号，path 为原始树路径，不随分页、展开和排序变化。动态数据优先用行字段。默认排序只处理顶层 data，不递归排序 children。

::table-tree-example
::

:::

:::section{id="columns" class="doc-section"}
## 固定列和列设置

列可以通过 `fixed` 固定在左右两侧，也可以通过列设置面板隐藏、排序和固定。`resizableColumns` 开启后，表头右侧的分隔手柄支持拖动和键盘调整列宽。

`reorderableColumns` 只控制列顺序调整，不控制列内容排序、表头说明或列宽调整。下方示例使用局部 `BingCursor`，可切换“允许拖动列顺序”观察表头和排序按钮的光标。

从 `0.9.1` 起，关闭列拖拽时直接使用普通表头，保留 `columnheader` 语义和默认光标，排序按钮仍显示手形并可点击。旧版 `0.9.0` 会将整个表头误标为禁用，导致配合 `BingCursor` 使用时出现禁用光标。

columnControlsPlacement 默认 auto：有分页放页脚，否则优先 toolbar 插槽，最后放表头右上角；显式 toolbar 会创建工具栏，footer 保留旧页脚入口。showColumnControls=false 完全隐藏入口。分页宽度不超过 540px 时隐藏首末页和“每页条数”文字。列面板拖拽使用独立浮层，键盘排序操作“调整列顺序”手柄。

多个分组表格可使用独立的 [BingTableColumnControls](/docs/components/table-column-controls)，把四个列模型绑定到同一份业务状态，并关闭每个表格的 showColumnControls。入口不依赖首个分组是否展开；表格内部也复用同一个组件。

列宽字符串也按 parseFloat 解析为像素；例如 50% 不代表一半宽度。左固定、普通、右固定各自成组，拖拽不能破坏这个分组。列设置面板至少保留一列，但外部 hiddenColumnKeys 可以隐藏全部。分隔手柄的左右键每次调整 12px。

窄屏同时固定多列时，固定区域可能遮住大部分普通列。可在列设置中取消固定；业务也可以按可用宽度传入 columnFixed 覆盖，以 null 取消指定列的固定。

::table-columns-example
::

:::

:::section{id="virtual" class="doc-section"}
## 虚拟滚动

`virtual` 可以设置为 `true`、`false` 或 `auto`。auto 在行数超过 virtualThreshold 后启用；virtualRowHeight 只用于未测量行的预估。

`smoothScroll` 默认开启，作用于主视口的纵向与横向滚动，并同时覆盖列设置列表；设为 `false` 可关闭。直接拖动滚动轨道或开始相关交互时会停止当前平滑动画。

0.7.0 减少了滚动时的重复渲染与单元格测量，列宽拖动按帧更新，松手时提交最终位置。平滑滚动、列拖拽落位、分页过渡、截断文字提示和键盘操作继续保留，无需为使用性能优化而关闭交互。

虚拟化按当前页展开后的集合判断，仅减少 DOM；本地排序仍处理 data。未提供 maxHeight 时回退 520px。size 决定最小行高 36/40/44px，实测高度按 key 缓存，支持换行与变高行并保持滚动锚点。本例估计行高留空时使用尺寸默认值。1 万行是当前计算优化目标；5 万行文本排序可能超过一帧，应考虑 remoteSort，不能把本机计算耗时当作设备保证。

::table-virtual-example
::

:::

:::section{id="controls-loading" class="doc-section"}
## 单元格控件与加载

列默认启用 ellipsis。实际文字被截断时，悬停或聚焦单元格可查看全文，提示读取插槽最终渲染的文字。含按钮、输入框或选择器的单元格保留控件和焦点框，不自动包裹全文提示；控件自己的宽度仍需与列宽配合。

开启 selectOnRowClick 后，点击控件不会顺带切换行选择。row-click 仍会先发送，若业务监听它来打开详情，应自行过滤控件来源，或在独立操作上使用 @click.stop。自定义非原生操作区可加 data-bing-table-row-click-ignore，阻止自动选择和激活。

下面按“开始加载 → 接收新数据 → 结束加载”模拟请求的三个阶段。loading 期间保留上次稳定的数据与表格高度，滚动区域设为 inert，分页和页大小控件暂停交互；接收到的新 data 在加载结束后显示。加载提示延迟约 150ms 出现，出现后至少保留约 250ms，短请求也会立即进入忙碌状态。顶部业务工具栏、底部列设置与实例方法不由 loading 统一禁用。

::table-controls-example
::

:::

:::section{id="expose" class="doc-section"}
## 实例方法

通过 ref 可以从外部控制选择、展开、列状态和滚动位置。这些方法适合接入批量操作、快捷按钮或表单校验后的定位逻辑。

::table-methods-example
::

::docs-api-table{name="expose"}
::

:::

:::section{id="remote" class="doc-section"}
## 远程排序与分页

`remoteSort` 与 `remotePagination` 独立：前者只停止本地排序，仍保留排序状态和事件；后者只停止本地分页切片。服务器提供排序后的当前页数据时同时开启两者，并传入真实 `total`。监听一次 `page-change` 发请求，不再同时监听两个页码模型更新发请求。排序变更后由业务重置页码并发起查询。

示例模拟服务端按字符串排序，REQ-10 排在 REQ-2 前。表格不再对该顺序做二次排序。请求中保留旧行；关闭补位后末页只显示实际行，空结果显示空状态。取消排序会传出 key/order 均为 null。

::table-remote-example
::

:::

:::section{id="keyboard" class="doc-section"}
## 键盘导航与单元格编辑

| 操作 | 按键 |
| --- | --- |
| 进入 / 离开网格 | Tab / Shift+Tab |
| 移动单元格 | 方向键 |
| 行首 / 行尾 | Home / End |
| 表头起点 / 最后行末尾 | Ctrl / ⌘+Home / End |
| 按视口移动 | PageUp / PageDown |
| 切换选择 / 范围选择 | Space / Shift+Space |
| 选择当前页 | Ctrl / ⌘+A |
| 激活普通行 / 进入控件 | Enter / F2 |
| 编辑模式内循环 / 返回单元格 | Tab、Shift+Tab / Esc |
| 树行展开 / 收起 | 右 / 左 |
| 列头排序 | Enter / Space |
| 同固定分组内移列 | Ctrl / ⌘+Shift+左 / 右 |
| 列头调宽 | Alt+左 / 右，Shift 为 48px（默认 12px） |
| 宽度手柄 | 左 / 右、Shift+左 / 右、Home / End；双击自适应 |

排序列保留 aria-sort，sortDirections 默认 asc / desc / null。自适应只测量表头和已渲染内容，受 minWidth / maxWidth 约束。

::table-keyboard-example
::
:::

:::section{id="cascade" class="doc-section"}
## 级联与范围选择

selectionStrategy 默认 independent；cascade 聚合可选后代，仅叶子 key 进入模型。禁用节点不计入选择但不阻断其可选后代，单选保持独立。Shift 点击复选框、行选择或 Shift+Space 按当前可见顺序选择，排序、分页和数据变化会清除范围锚点。

::table-cascade-example
::
:::

:::section{id="remote-selection" class="doc-section"}
## 远程跨页全选

toolbar 提供 selectAllPages / clearSelection / selectionCount。远程全选返回 allPages=true 与 excludedKeys，keys 不枚举未知数据；后端应以查询条件和排除项执行批量操作。示例筛选变化时退出全选，可用 allPagesSelected / excludedRowKeys 受控。

::table-remote-selection-example
::
:::

:::section{id="active" class="doc-section"}
## 活动行与批量选择

activeRowKey / row-activate 用于当前查看项，与复选框选择独立。普通内容点击或 Enter 激活；嵌套控件和禁用行不激活，row-click 的 preventDefault 可取消默认激活。0.18.2 包含全文提示节点与外层可聚焦滚动容器的点击修复，升级时直接使用该补丁版本。

::table-active-example
::
:::

:::section{id="variable" class="doc-section"}
## 可变行高与定位

focusCell / scrollToRow 仅操作当前页可见树行，不自动换页或展开祖先；focusCell(null, column) 定位表头。column 可为列 key 或含选择列的零基序号。

::table-variable-example
::
:::

:::section{id="error" class="doc-section"}
## 错误、空数据与重试

error 与 emptyText 分开表达失败及正常空数据。默认重试按钮发出 retry；empty 插槽无参数，error 插槽接收 { error, retry }，由业务加载数据。

::table-error-example
::
:::

:::section{id="skeleton" class="doc-section"}
## 首次加载骨架

loadingVariant=skeleton 只在首次没有稳定数据时展示骨架，刷新保留旧行。减少动态效果时装饰停止，加载和错误通过同一隐藏 live region 通知。

::table-skeleton-example
::
:::

:::section{id="focus" class="doc-section"}
## 焦点、滚动与列设置位置

焦点环位于单元格内；方向键与定位方法避开固定列、表头和滚动条。scrollbarGutter 默认 auto，仅溢出时预留，stable 保留原双向留白。强制颜色模式使用系统颜色。

::table-focus-example
::
:::

:::section{id="theme" class="doc-section"}
## 公开主题变量

变量可设置在组件或祖先上，避免依赖内部 --_table-*。行状态优先级：禁用、活动、选中、悬停、斑马纹、基础背景。选中底色维持约 7%，通过复选框、活动标记和焦点环辨识；悬停不改变正文颜色。

| 变量 | 默认含义 |
| --- | --- |
| --bing-table-bg | --bing-surface-solid |
| --bing-table-header-bg | --bing-surface-muted |
| --bing-table-striped-bg | --bing-surface-muted |
| --bing-table-row-hover-bg | --bing-surface-hover |
| --bing-table-row-selected-bg | accent 7% 混合表格底色 |
| --bing-table-row-active-bg | --bing-surface-active |
| --bing-table-row-active-accent | --bing-accent |
| --bing-table-line | --bing-border |
| --bing-table-line-strong | --bing-border-strong |
| --bing-table-focus-ring | --bing-focus-ring |
| --bing-table-radius | 8px |
| --bing-table-row-height | sm / md / lg：36 / 40 / 44px 最小高度 |
| --bing-table-cell-padding-x | 10 / 12 / 14px |
| --bing-table-cell-padding-y | 4 / 6 / 8px |
| --bing-table-head-height | 32 / 36 / 40px 最小高度 |

全局 --bing-focus-ring 默认引用 --bing-accent，保留原 --bing-focus 柔和光晕。

::table-theme-example
::
:::

:::section{id="props" class="doc-section"}
## Props

::docs-api-table{name="props"}
::

:::

:::section{id="column-shape" class="doc-section"}
## 列结构

::docs-api-table{name="column"}
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

:::section{id="types" class="doc-section"}
## 类型与数据边界

::docs-api-table{name="types"}
::

全部类型从 @moubing/bing-ui 导入。BingTableRow 是 Record<string, unknown>；单元格 value 和业务扩展字段需要类型判断。没有过滤器、单元格编辑、异步树加载或数据请求属性。示例数据与数据生成函数均已内置。

远程分页需同时开启 pagination、remotePagination，传入当前页 data 与整体 total，绑定 page/pageSize 并处理 page-change。组件不请求接口；服务器排序另开 remoteSort。selection-change.rows 缓存已加载且仍选中的行；未知远程数据无法生成行对象，不能把 rows 当作全部结果。

受控属性需要响应对应更新，default 属性主要用作初始化；列默认值也供 resetColumns 使用。sortKey/sortOrder 的 undefined 使用内部值，null 明确清空，即使存在冲突的 default 值也不回退。defaultExpandAll 例外：数据或 childrenKey 变化会重新展开非受控树。

主结构保留 th scope=col 与 columnheader，排序列提供 aria-sort；keyboardNavigation 默认 true，普通表为 grid、树表为 treegrid，提供单一 Tab 入口。行含全局 aria-rowindex，远程总行数为 total+1；树行含层级、展开状态和同级位置。焦点按行 key 保留，删除 / 换页时回退到相邻序号，虚拟焦点行不会被卸载。keyboardNavigation=false 恢复自然 Tab 顺序。缓存页离开时卸载预览并清理浮层与任务。

height/maxHeight 的字符串必须带有效 CSS 单位，例如 280px；示例通过动态绑定传入数值 280，不传无单位的字符串。

:::

:::section{id="smooth-options" class="doc-section"}
## 滚动配置

::docs-api-table{name="smooth"}
::

主视口与列设置使用滚动配置；示例无需额外导入滚动库。

:::

::::
