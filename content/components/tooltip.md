::::article{class="doc-page"}
<p class="doc-eyebrow">组件</p>

# BingTooltip {#overview}

BingTooltip 是轻量提示浮层，用于给按钮、图标、表单字段和状态标签补充说明。它支持 hover、click、manual 三种触发方式，能根据视口空间自动调整位置，并把浮层 Teleport 到 body 共享渲染，适合页面里频繁出现的短说明和轻量交互内容。

独立使用需导入 `BingTooltip` 以及 `@moubing/bing-ui/style.css`；下方五个示例均包含完整导入与处理函数。

:::section{id="interaction" class="doc-section"}
## 交互总览

通过 `trigger` 控制打开方式，通过 `placement` 和 `align` 控制首选位置。下面的示例可以直接修改提示内容、触发方式、延迟和关闭行为。

基础示例默认使用两个字的“斜体”，便于检查短提示的留白；可在“提示内容”中输入长文本，检查换行和滚动。面板按内容收紧，`maxWidth` 只限制最大宽度，不要求短文案占满面板。

短提示直接渲染内容，溢出后才使用 BingScrollbar；从短内容变成长内容可能重挂内容插槽。需要保持富内容组件状态时显式开启 scrollable。maxWidth 限制整体宽度，长提示恢复短内容后仍收紧高度。

省略 modelValue 时内部管理；显式传入时用 v-model 同步。hover 支持键盘可见焦点，鼠标点击后关闭并抑制到离开；触屏长按 500ms 打开、松手后 1500ms 关闭。disabled 隐藏提示并阻止打开，保留受控模型；恢复启用不会自动重开，需要再次触发或调用 show。

多个 Tooltip 共用面板，接管时旧实例立即发出 close('replaced') 与 update:modelValue(false)。click / manual 固定提示会阻止其他 hover / focus 抢占，显式点击可切换。ARIA 自动关联实际可聚焦目标，提示与目标名称相同时不重复添加描述；多目标可用默认插槽 triggerProps 指定。suppressWhenExpanded 默认 true，菜单按钮展开后自动抑制提示，无需重复绑定 disabled。

从 0.12.4 起，共享面板的打开和移动遵循当前触发器所在 `BingConfigProvider` 的 `reducedMotion`，关闭遵循正在退场的触发器配置。不同区域分别设置 `always` 和 `never` 时互不覆盖，不会再沿用首个 Tooltip 实例的动效策略；可在 [ConfigProvider 动效示例](/docs/components/config-provider#motion) 连续悬停比较。`always` 跳过动画，触发延迟仍由 `openDelay` / `closeDelay` 控制。

::tooltip-basic-example
::

:::

:::section{id="rich-content" class="doc-section"}
## 富内容提示

简单文案用 `content`，复杂说明用 `content` 插槽。当 `interactive` 为 true 时，用户可以把鼠标移进浮层并点击里面的按钮。

浮层仍为 `role="tooltip"`，不会自动移入或限制焦点。在 Dialog 内显示时，提示内容纳入弹窗的可聚焦范围，Escape 先关闭提示；重要的表单和确认流程使用 Dialog；此处仅演示少量内容和本地点击反馈。

::tooltip-rich-example
::

:::

:::section{id="placement" class="doc-section"}
## 定位与边界

`placement` 是首选方向，不是绝对方向。组件会读取锚点和浮层尺寸，在空间不足时翻转方向，并通过 `viewportPadding` 保留与视口边缘的距离。

组件依次尝试首选方向、反方向和剩余方向；没有方向放得下时选择空间最多的一侧并修正坐标。窗口 resize 和滚动会触发重新定位，单纯修改内容或移动锚点后可等待 DOM 更新再调用 `updatePosition()`。

此例只有纯文本，设置 `interactive=false` 让浮层不拦截指针，便于继续点击相邻方向按钮。

::tooltip-placement-example
::

:::

:::section{id="manual" class="doc-section"}
## 手动控制与事件

`trigger="manual"` 适合引导流程、校验提示和外部状态驱动的说明。组件通过 `show`、`hide`、`toggle` 和 `updatePosition` 暴露方法，同时会把打开和关闭原因传给事件。

manual 仍支持外部点击与 Escape 关闭。示例关闭 closeOnOutside，避免外部切换按钮的 pointerdown 先关闭提示；Escape 保留。再次点击 click 锚点的关闭原因为 click。open / close 表示有效状态变化，不表示动画完成；初始模型 true 不发送初次 open。

缓存页面停用时不会触发卸载。使用 KeepAlive 的文档页在 `onDeactivated` 中移除预览 Tooltip 并清空打开状态，避免未显示的页面继续留下共享浮层或计时任务；返回时保留参数配置。

::tooltip-manual-example
::

:::

:::section{id="toolbar" class="doc-section"}
## 连续工具栏与快捷键

skipDelay 默认 300ms，提示关闭后在此窗口内移向相邻项可跳过等待。shortcut 展示键帽及 aria-keyshortcuts，不注册业务快捷键；tone="inverse" 使用反色面板。原生禁用按钮不能接收焦点，使用有名称、tabindex="0" 的包装作为提示目标。

::tooltip-toolbar-example
::

:::

:::section{id="props" class="doc-section"}
## Props

::docs-api-table{name="props"}
::

:::

:::section{id="slots" class="doc-section"}
## Slots

::docs-api-table{name="slots"}
::

:::

:::section{id="events" class="doc-section"}
## Events 与 Expose

事件会带上打开或关闭来源，方便在业务层记录用户如何触发提示；Expose 方法则用于完全受控的提示场景。

::docs-api-table{name="events"}
::

::docs-api-table{name="expose"}
::

:::

:::section{id="api-types" class="doc-section"}
## 公开类型

::docs-api-table{name="types"}
::

:::

::::
