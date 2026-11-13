::::article{class="doc-page"}
<p class="doc-eyebrow">组件</p>

# BingDatePicker {#overview}

BingDatePicker 是日期时间选择器，用于选择日期、日期时间、月份、年份或时间。它支持单值和范围模式、内置快捷选择、最小最大值、禁用日期/时间规则，并且可以接入 BingFormItem 的尺寸、禁用和校验状态。

:::section{id="types" class="doc-section"}
## 类型和范围

`type` 决定面板结构和输出格式；`range` 会把值变成二元组。单值 `date/month/year` 选择后直接提交，`datetime/time` 和所有范围选择都需要点击“确定”。`smoothScroll` 默认只作用于 `time` 和 `datetime` 面板的时、分、秒选项列；设为 `false` 可关闭。

新版 sm/md/lg 触发器高度为 32/36/40px。日历默认语言为 zh-CN，月份和星期显示中文；可切换 locale 观察差异，操作按钮仍使用中文。空间不足时快捷选择移入面板内部，窄屏也可以保持开启。

单值与范围的空值统一使用 null。示例根据 type/range 初始化匹配格式，并在切换类型、范围或禁用配置时用 key 重建面板。每个实例显式提供唯一 id，避免当前版本自动生成 id 重复。

::date-picker-basic-example
::

:::

:::section{id="formats" class="doc-section"}
## 值格式

组件对外始终提交字符串或字符串二元组。`valueFormat` 既决定提交格式，也决定传入的 `modelValue/min/max` 如何被严格解析；`format` 只影响展示。

::docs-api-table{name="value"}
::

下面的日期实例用 `valueFormat="YYYY/MM/DD"` 保存值，用 `format="YYYY年MM月DD日"` 展示；其余实例使用默认格式。组件内部包含严格格式解析；不要把 Date 对象、时间戳或与 valueFormat 不匹配的字符串当成合法模型。非法外部单值可能原样显示，但打开后没有有效草稿，组件不会自动修正业务数据。

::date-picker-singles-example
::

范围输出为两个完整字符串。日期类会按先后排序；time 范围只比较同一天的时分秒，不能表示跨午夜。范围只验证起终点，不保证中间每一天满足 disabledDate；整段可用性需业务另外判断。

::date-picker-ranges-example
::

:::

:::section{id="disabled-rules" class="doc-section"}
## 禁用规则

`min/max` 会先做范围限制，之后再执行 `disabledDate` 和`disabledTime`。时间禁用函数会拿到当前 unit 和 value，适合做营业时间、分钟步进等规则。

规则示例同时使用 min/max 精确限定营业边界，防止仅限制 hour 导致 18:45 仍可选。步进只生成列表，不强制外部值或快捷操作为步进倍数；外部赋值也不会自动按禁用规则清除。

::date-picker-rules-example
::

:::

:::section{id="expose" class="doc-section"}
## 实例方法

通过 ref 可以控制触发器和面板，适合在表单校验失败后自动聚焦，或从外部按钮打开日期面板。

clear() 不关闭面板，打开中的旧草稿也不一定随 null 模型重置；本例先 closePanel() 再 clear()。外部点击或方法关闭没有 cancel 事件。

::date-picker-methods-example
::

::docs-api-table{name="expose"}
::

:::

:::section{id="props" class="doc-section"}
## 属性

::docs-api-table{name="props"}
::

:::

:::section{id="events" class="doc-section"}
## 事件

::docs-api-table{name="events"}
::

:::

:::section{id="public-types" class="doc-section"}
## 类型和状态边界

::docs-api-table{name="types"}
::

组件类型从 `@moubing/bing-ui` 导入，没有自定义插槽、受控 open、弹层位置或 teleportTo 属性。面板与快捷栏传送到 body，定位随视口变化；打开后面板获得焦点，Tab 不限制在面板中，日历没有方向键网格导航。Enter 在需要确认的面板提交，面板 Escape 取消并返回触发器。

当前版本在面板打开时仍不会同步外部 modelValue 到草稿，也不会因 disabled=true 自动关闭面板并禁用所有候选项。业务要变更模型、类型、范围或禁用状态时，先关闭面板，必要时用 key 重建。本页基础配置保留 key，缓存页面离开时卸载所有实例，清理面板、快捷栏、滚动和动画。

format/valueFormat 不包含时区转换约定；time 的 parsedValue 基准日为 2000-01-01。locale 影响星期、月份和年月标题，不改变值格式或中文操作按钮。内置快捷选择按当前本地日期计算，确认时仍校验端点；相同值重复操作仍可能发送 change，业务按需去重。

:::

:::section{id="smooth-options" class="doc-section"}
## 时间列滚动配置

::docs-api-table{name="smooth"}
::

这些配置仅作用于时、分、秒列表。示例无需直接引入滚动库。

:::

::::
