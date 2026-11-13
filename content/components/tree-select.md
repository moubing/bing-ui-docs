::::article{class="doc-page"}
<p class="doc-eyebrow">组件</p>

# BingTreeSelect {#overview}

BingTreeSelect 是层级数据选择器，适合组织架构、资源目录、组件分组这类带父子关系的选项。它支持单选、多选级联、严格选择、搜索、批量选择、展开收起、节点详情和虚拟滚动，能在表单里直接作为复杂选择控件使用。

本文与正式发布的 `@moubing/bing-ui@0.17.0` 一致，包含字符定位、搜索命中高亮、搜索展开状态恢复和标签折叠交互。

:::section{id="basic" class="doc-section"}
## 基础选择

单选场景使用普通的 `v-model` 即可。下面的示例可以调整尺寸、搜索策略、状态、清空按钮和面板高度，同时观察 `change`、展开和收起事件。

示例中的 options 是演示配置，不是组件默认值。完整树、选择状态、事件处理和必要样式都在代码中，可复制到普通 Vue 项目。单选空值为 null，多选空值为 []；请同步 v-model，组件不会替业务保存选择。

模型使用节点原始 value，数字 1 和字符串 1 不同。显示会移除未知值、去重并按全树前序排列；这些归一化不会主动回写外部模型，下一次用户选择才输出新值。单选误传数组时只识别第一项。默认多选先展开传入值的可选子树，并在所有可选后代已选时补齐父节点；业务反馈展示的原始值与触发器归一化结果因此可能不同。

::tree-select-basic-example
::

:::

:::section{id="cascade" class="doc-section"}
## 多选与级联

`multiple` 开启多选。默认模式会做父子级联，选中父节点会带上可选子节点；开启 `checkStrictly` 后，父节点和子节点互不影响。

级联会输出父节点与可选后代的完整值集合，不是仅输出叶子。选中父节点会补齐子树；取消某个子节点会取消不再全选的可选祖先。disabled/selectable=false 只约束本节点，不传递到子节点。严格模式保留外部传入的已知禁用/不可选值；默认级联会重新计算它们的可选分支。

本例切换 checkStrictly 时主动重置示例值，便于对照。组件本身切换此属性只重新计算显示，不主动更新外部模型。若可选父节点的全部后代都不可选，当前级联归一化仍会移除该父节点；需要单独选择它时使用严格模式。

侧栏是全选/清空当前范围的切换按钮，不是反选。无搜索时覆盖整棵树，包含折叠和虚拟列表尚未挂载的节点；有搜索时先找自身匹配的可选节点，级联模式再包含其可选后代。因此搜索只显示一个匹配父节点时，批量选择仍可能选中未显示的子节点，并补齐祖先。范围外选择通常保留，但未知值会在归一化时移除，级联祖先也会重新计算。

右侧清除按钮清空整个模型；clearable=false 仅隐藏这个按钮，不禁止 Tag 删除或侧栏清空。0.17.0 起根据触发器实际宽度显示能容纳的 Tag，其余折叠为 +N；容器或字体变化会重新测量。删除父 Tag 会取消其级联子树，批量清空的标签退场结束后才显示占位文字。

::tree-select-cascade-example
::

:::

:::section{id="custom-node" class="doc-section"}
## 节点内容与详情

每个节点可以携带 `description` 和 `meta`。当节点有说明或使用 `node-detail` 插槽时，悬停节点会展示详情面板；`value` 和 `node` 插槽可以接管触发器文本和节点行内容。

搜索是同步本地筛选，覆盖自身 label、value、description 以及非空 meta 的键和值，忽略大小写和拉丁重音，多个词需都匹配。0.17.0 起支持英文/中文拼音首字母，默认标签按 `highlightMatches` 高亮匹配片段。自定义 `node` 插槽通过 `matchRanges` 获取 UTF-16 起止位置（end 不包含在片段内），自行渲染高亮；关闭高亮只影响片段，不改变筛选。搜索不会自动拼接祖先路径，没有远程查询事件或异步子节点加载。

搜索结果保留匹配节点的祖先路径，但匹配父节点不会让所有不匹配子节点显示。0.17.0 起在开始搜索时保存展开快照，每次修改查询自动展开匹配路径，随后可手动收起；清空查询恢复搜索前的展开状态，并在需要时展开当前活动节点的祖先。收起包含活动节点的分支时，活动节点先移到父级。详情浮层 aria-hidden=true，只适合补充展示，关键说明需同时放在普通行或正文中，勿在详情里放交互控件。

::tree-select-custom-example
::

:::

:::section{id="virtual" class="doc-section"}
## 搜索与虚拟滚动

当层级节点很多时，开启 `virtual` 可以只渲染视口附近的节点；搜索会匹配节点标签、值、说明和 `meta` 字段，适合大目录里快速定位。

`smoothScroll` 默认只作用于下拉面板的选项树；设为 `false` 可关闭。节点展开、收起、搜索或数据结构变化时，会先停止当前动画，再校正滚动位置与虚拟视口。

本例生成 28 个父节点、每个 14 个子节点，共 420 个节点。virtual=true 只挂载可见范围附近的节点，auto 则用展开/搜索后的可见数量与阈值比较；不是全树数量。虚拟化不会减少搜索、树展开和级联计算的数据量。默认 sm/md/lg 节点行高为 28/32/36px，虚拟行高不能小于当前尺寸的默认值；插槽内容需保持固定高度。本例省略自定义行高，参数留空时继续跟随尺寸。

defaultExpandedValues 只在首次初始化读取。defaultExpandAll=true 时，选项数据或默认展开配置变化可重新全展开；切换为 false 只保留仍有效的展开键，不代表收起全部。单个节点展开事件不覆盖全部展开/收起操作，因此不能靠这两个事件重建受控展开状态。

::tree-select-virtual-example
::

:::

:::section{id="keyboard" class="doc-section"}
## 键盘与层级提示

打开后用 ↑ / ↓ 移动活动节点，Home / End 定位首尾，Enter 选择，Escape 先清空查询、再次关闭。无搜索框时，`typeahead=true` 在 500ms 内累计字符匹配可见标签前缀或英文/拼音首字母；重复字符在匹配节点间循环，不自动选择。

| 按键 | 搜索框中的行为 |
| --- | --- |
| → | 光标折叠且位于末尾时展开当前节点；已展开则移到第一个可用子节点 |
| ← | 光标折叠且位于开头时收起当前节点；已收起则移到父节点 |
| Alt + ← / → | 无论光标位置，都执行树导航 |
| * | 查询为空时展开当前节点的同级分支 |
| 空格 | 查询为空时切换多选或确认单选；有查询时保留文本输入 |

光标在中间、有文字选区或输入法正在组词时保留编辑行为。节点展开按钮只供鼠标使用，不进入 Tab 顺序；多选树以 `aria-checked=true/false/mixed` 表达状态，单选用 `aria-selected`。普通树与虚拟树的节点都提供层级、同级总数与序号，搜索框和触发器通过活动后代指向当前节点。

展开时新节点轻微下移淡入，收起时后代先淡出再移除；普通面板高度随内容过渡，虚拟树立即更新滚动高度。减少动态效果偏好下即时更新。选中节点以勾选和字重区分；详情图标仅在悬停、活动或聚焦时出现，触摸设备始终显示。

层级引导线使用 `--bing-tree-select-indent`（默认 `16px`）和 `--bing-tree-select-guide-color`（默认 `--bing-border`），活动节点的祖先路径使用 `--bing-border-strong`。变量可放在主题、组件根元素或 `.bing-tree-select__panel` 上；根元素上的配置在面板定位时同步到 Teleport 面板。

受控 `expandedValues`、懒加载和 `showCheckedStrategy` 属于后续范围，当前版本未提供。

:::

:::section{id="panel-position" class="doc-section"}
## 弹层定位

`panelPlacement` 控制面板优先出现的位置，`panelAlign` 控制面板相对触发器的对齐方式，`panelGap` 控制间距。空间不足时，`auto` 会自动选择更合适的方向。

auto 只在上方与下方之间选择；显式 left/right/top/bottom 不自动翻面，但坐标仍限制在视口内。面板最小宽度通常为 280px，视口较窄时缩到可用宽度。高度字符串以 parseFloat 解析为像素，不能用百分比表达比例。侧栏与详情可能挤占窄屏空间，关键操作不要只依赖悬浮详情。

默认磨砂跟随主题：浅色不透明度 0.86、深色 0.92，模糊 16px，饱和度 1.05。显式设置 glassOpacity 等参数会覆盖主题默认值。

::tree-select-panel-example
::

:::

:::section{id="props" class="doc-section"}
## Props

::docs-api-table{name="props"}
::

:::

:::section{id="node-shape" class="doc-section"}
## 节点数据

::docs-api-table{name="node"}
::

:::

:::section{id="slots" class="doc-section"}
## Slots

::docs-api-table{name="slots"}
::

:::

:::section{id="events" class="doc-section"}
## Events

::docs-api-table{name="events"}
::

:::

:::section{id="types" class="doc-section"}
## 公开类型与键盘操作

::docs-api-table{name="types"}
::

类型从 @moubing/bing-ui 入口导入；弹层位置、对齐与 meta 类型使用上表推导方式。没有公开 openPanel、closePanel、focus 实例方法，没有受控 open/expandedValues、teleportTo 或数据请求属性。

触发器为 button，aria-haspopup="tree"。Enter、Space、上下键可以打开；上下键循环跳过不可选和禁用节点，Home/End 到首尾可选节点，Enter/Space 选择。触发器或面板根部收到右键时只展开当前分支，不自动进入第一个子节点；左键先收起当前分支，否则定位父节点。搜索输入框接管文字编辑，左右键不会操作树，Space 输入空格；Enter 选择，上下键与 Home/End 定位。

可搜索时打开后聚焦搜索框，斜杠键可重新聚焦；打开动画期间焦点若已被移到组件外，不会被拉回搜索框（0.12.3 起；此前版本会在随后两帧内抢回焦点）。搜索框内 Escape 先清除非空查询，再次 Escape 关闭并回到触发器。Tab 关闭并继续正常焦点顺序，没有独立的焦点陷阱。不可选父节点的 aria-disabled 表示不能选择，展开按钮仍可操作。

面板、侧栏和详情传送到 body。本页在缓存离开时卸载预览，清理浮层、监听与滚动任务，业务模型留在页面状态中。显式 id 控制触发器，新版内部 tree/node ID 已按实例隔离；Dialog 中的树面板参与浮层管理，Escape 先处理当前树面板。

:::

:::section{id="smooth-options" class="doc-section"}
## 面板滚动配置

::docs-api-table{name="smooth"}
::

这些参数只控制面板内滚动。键盘节点定位即时完成，搜索、展开或数据变化会停止当前滚动任务，示例不需要额外安装滚动库。

:::

::::
