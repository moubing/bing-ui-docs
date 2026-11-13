::::article{class="doc-page select-doc"}
<p class="doc-eyebrow">组件</p>

# BingSelect {#overview}

BingSelect 是选择器组件，用于单选、多选、搜索筛选和大量选项选择。它内置清除、全选、默认 Tag 展示、键盘导航、选项详情浮层和虚拟列表，适合表单、筛选器和配置面板。

:::section{id="playground" class="doc-section"}
## 基础配置

通过 `options` 提供选项，使用 `v-model` 绑定选中值。`size`、`searchable`、`status` 和 `clearable`是最常用的配置。

示例中的 options 是演示配置。值使用严格相等比较；单选空值为 null，多选空值为 []。未知模型值不会自动清除，显示与 change.options 只包含能在选项表中找到的项。请保证每个 value 唯一，业务负责同步 v-model。

::select-basic-example
::

:::

:::section{id="multiple" class="doc-section"}
## 多选与全选

设置 `multiple` 后，`modelValue` 使用数组。默认展示已选 Tag，选项较多时会自动折叠成 `+N`。

0.17.0 将全选入口移入面板头部，显示三态复选框和“已选 / 可用总数”。搜索时文案为“全选结果”，作用范围同步收窄。选中项使用勾选与字重区分，背景只表示当前高亮项。标签以 0.18 秒进入、0.12 秒离开，`+N` 滚动更新；减少动态效果时直接切换。

大量选项全选时，触发器直接显示容器内可见的标签和 `+N`，不会先展开全部标签再折叠。调整宽度或标签内容后会重新计算可见数量。清空时标签原地退场，结束后再显示占位文字；减少动态效果时直接切换。

全选和清空当前结果只影响搜索结果中未禁用的项，保留结果外、禁用和未知的已有值。触发器右侧清除按钮则清空整个模型。clearable=false 只隐藏该按钮，仍可删除 Tag 或清空结果。

::select-multiple-example
::

:::

:::section{id="detail" class="doc-section"}
## 搜索与选项详情

选项可以带 `description`、`detail` 和 `meta`。当选项有详情信息或传入 `option-detail` 插槽时，悬停选项会显示详情面板。

搜索是内置同步筛选，覆盖 label、value、description、detail 与非空 meta 的键和值；忽略大小写和拉丁重音，多个词需全部匹配，支持英文单词首字母。0.17.0 起支持中文拼音首字母，例如 `cq` 匹配“重庆”。不做任意散字模糊匹配，也没有远程搜索事件。auto 根据原始选项数大于 8 决定是否出现搜索框。

0.17.0 新增 `highlightMatches`（默认 `true`），默认标签用 `<mark class="bing-picker__match">` 标记文字或首字母对应的原文。若只命中详情或 meta，标签不强行高亮。自定义 `#option` 不会被改写，插槽额外收到 `matchRanges: Array<{ start: number; end: number }>`；区间使用 UTF-16 偏移，end 不包含在内，可用 `option.label.slice(start, end)` 读取。

详情浮层仅供视觉补充，aria-hidden=true。关键说明应同时出现在普通选项或正文中，勿在详情内放按钮或表单。

::select-detail-example
::

:::

:::section{id="virtual" class="doc-section"}
## 虚拟列表

当选项数量很多时，可以开启 `virtual`，只渲染视口附近的选项。`virtualItemHeight` 需要和选项实际高度接近，滚动体验才会稳定。

`smoothScroll` 默认只作用于下拉面板的选项区；设为 `false` 可回退为即时滚动。键盘导航的选项定位始终即时，不会等待平滑动画。

auto 以过滤后的条目数严格大于阈值为准；搜索后可能回到普通列表。虚拟列表只减少 DOM，搜索仍遍历完整 options。默认行高随 sm / md / lg 为 28 / 32 / 36px，自定义 option 插槽增加 16px；description 显示在详情浮层，不增加默认行高。显式 virtualItemHeight 最小为 28px，向下取整；本例留空时使用组件默认值，自定义内容需约束高度。

::select-virtual-example
::

:::

:::section{id="panel-position" class="doc-section"}
## 弹层定位

`panelPlacement` 控制面板优先出现的位置，`panelAlign` 控制相对触发器的对齐方式，`panelGap` 控制两者间距。`auto` 会根据视口空间自动翻转到可见区域。

磨砂参数默认继承主题：模糊 16px、浅色不透明度 0.86、深色 0.92、饱和度 1.05。通常只需设置 glass；显式 glassOpacity 会固定不透明度，无法自动跟随主题。

::select-panel-example
::

:::

:::section{id="sizes-status" class="doc-section"}
## 尺寸与状态

触发器 sm / md / lg 高度为 32 / 36 / 40px，选项行高另行计算。`status` 可以和表单校验状态同步。在 `BingForm` 里使用时，Select 会继承表单项的尺寸、禁用和状态，显式属性优先。

::select-sizes-example
::

:::

:::section{id="events-demo" class="doc-section"}
## 事件反馈

`change` 会返回当前值、触发选项和所有已选选项。`open`、`close` 和 `clear` 适合做埋点或轻量状态反馈。

::select-events-example
::

:::

:::section{id="props" class="doc-section"}
## 属性

::docs-api-table{name="props"}
::

:::

:::section{id="option-shape" class="doc-section"}
## 选项结构

::docs-api-table{name="option"}
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
## 公开类型与键盘行为

::docs-api-table{name="types"}
::

触发器使用 button 元素，0.17.0 增加 `role="combobox"`，带 aria-haspopup="listbox"。Enter、Space、上下键打开；面板中上下键循环跳过禁用项，Home/End 到首尾，Enter 选择。可搜索时打开后聚焦搜索框，斜杠键可以重新聚焦；打开动画期间焦点若已被移到组件外，不会被拉回搜索框（0.12.3 起；此前版本会在随后两帧内抢回焦点）。搜索框内第一次 Escape 清除非空查询，查询为空时 Escape 关闭并返回触发器。0.17.0 起选项均为 tabindex=-1，由触发器或搜索框通过 aria-activedescendant 管理高亮；全选行可通过 Tab 到达并用空格/Enter 操作，继续 Tab 离开时关闭面板，没有焦点陷阱。

0.17.0 新增 `typeahead`（默认 `true`）。面板打开且焦点不在搜索框时，输入可打印字符定位选项：500ms 内连续字符组成前缀，重复同一字符循环匹配，先匹配 label 前缀再匹配英文/拼音首字母，跳过禁用项并滚动到可见位置。关闭面板时输入不改变值；输入法组词和 Ctrl/Cmd/Alt 组合键不会被接管。可用 `:typeahead="false"` 关闭。

键盘导航后，静止鼠标不会因为列表滚动而抢走高亮；指针实际移动超过 2px、且键盘滚动结束后才接管。虚拟选项带 aria-setsize / aria-posinset，表示筛选后完整集合中的总数和位置。

面板和详情浮层传送到 body。0.17.0 起全选行位于面板内部，`.bing-select__action-rail` 保留为新行容器的别名；现有 `bing-select__*` 类名保留，同一外壳元素增加 `bing-picker__*`。0.6.0 按实例生成唯一的 listbox / option ID，触发器的 aria-controls 与当前列表对应；业务自定义 id 时仍应保证唯一。本页在缓存页面离开时卸载预览以清理浮层、监听器与滚动任务。

可在组件根节点覆盖 `--bing-select-option-height`（默认 sm / md / lg 为 28 / 32 / 36px）和 `--bing-select-panel-radius`（默认 `var(--bing-radius-popover, 8px)`）；打开面板时同步到 Teleport 浮层。虚拟列表需要与实际行高一致，显式 `virtualItemHeight` 优先。

没有公开 focus/openPanel/closePanel 实例方法、受控 open 或 teleportTo 属性。额外业务字段在 BingSelectOption 上为 unknown，先做类型判断再传给其他组件。

:::

:::section{id="smooth-options" class="doc-section"}
## 面板滚动配置

::docs-api-table{name="smooth"}
::

仅选项滚动区域使用这些配置；键盘选项定位即时完成。示例无需另外导入滚动库。

:::

::::
