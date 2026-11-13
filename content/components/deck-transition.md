::::article{class="doc-page"}
<p class="doc-eyebrow">组件</p>

# BingDeckTransition {#overview}

BingDeckTransition 是卡组切换动效容器。它把多个 item 渲染成一摞卡片，点击默认按钮、调用 controls 插槽里的 `next`，或使用横向滚轮时，顶部卡片会飞出并露出下一张。

:::section{id="basic" class="doc-section"}
## 卡组洗牌

默认模式会渲染一个 `切换下一张` 按钮。每次切换只前进到下一张，适合提示卡片、步骤引导、功能亮点这类“逐张翻阅”的内容。

::deck-transition-basic-example
::

:::

:::section{id="controls" class="doc-section"}
## 自定义控制

默认按钮可以用 `controlLabel` 改文案，也可以通过 `controls` 插槽完全接管。插槽会提供 `next`、当前卡片、当前索引和动画状态。

内部 next 成功选择时依次发出 `update:modelValue` 和 `change`，再播放洗牌；模型和 active 表示目标项，不表示动画已结束。受控使用 `v-model` 接收更新；只传固定 modelValue 并忽略更新会导致视觉位置与激活状态不一致。

外部修改模型不会补发 change，并且直接重新定位卡组，不播放洗牌。`disabled` 阻止组件内部选择，无法阻止业务外部赋值。自定义按钮需显式绑定禁用条件，组件不会给 controls 插槽内任意按钮自动加 disabled。

::deck-transition-playground-example
::

以下示例关闭循环，并在最后一张禁用自定义“下一张”按钮；“返回第一张”是业务外部赋值。`next` 仅由 controls 插槽提供，不是组件 ref 的公开方法。`showControls=false` 连同自定义 controls 插槽一起隐藏，但不关闭滚轮。

::deck-transition-controls-example
::

:::

:::section{id="wheel" class="doc-section"}
## 横向滚轮

组件会监听根节点的 `wheel`。当横向滚动量大于纵向滚动量，并且横向绝对值超过 24 时，会触发一次 `next()`。禁用状态或动画进行中不会执行 next。

滚轮不累计、不等待手势结束，不换算 deltaMode。单次横向绝对值必须严格大于 24；正负方向都会前进下一张，不提供上一张操作。满足横向条件时，即使不足阈值、动画中或已到边界，仍会 preventDefault。减少动态效果时切换很快，连续事件可能连续前进多项；需要精确逐张操作可使用按钮或在业务外层拦截滚轮。

:::

:::section{id="props" class="doc-section"}
## 属性

::docs-api-table{name="props"}
::

:::

:::section{id="slots" class="doc-section"}
## 插槽

所有卡片一直挂载。示例给默认插槽的隐藏业务内容设置 `:inert="!active"`，避免焦点进入不可见卡片；组件自身只设置 aria-hidden，不管理业务控件焦点或提供 tabpanel。额外业务字段是 unknown，读取前先做类型检查。省略默认插槽时显示 item.label。

::docs-api-table{name="slots"}
::

:::

:::section{id="item" class="doc-section"}
## Item 结构

::docs-api-table{name="item"}
::

:::

:::section{id="events" class="doc-section"}
## 事件

::docs-api-table{name="events"}
::

:::

:::section{id="types" class="doc-section"}
## 公开类型与使用边界

::docs-api-table{name="types"}
::

类型从 `@moubing/bing-ui` 导入。组件没有公开实例方法，也没有上一张、自动播放、拖拽或动画时长属性。默认按钮在动画中或最后一张仍可能显示为可用，但内部 next 会忽略相应操作；自定义按钮可结合 isAnimating 和 activeIndex 提供清楚的状态。

未传模型时初始选择首个未禁用项；next 只尝试相邻项，不跳过禁用卡片。需要跳过的业务自行计算有效值并外部赋值。模型要命中有效项，值与字符串化的 key 均须唯一；无效值可能让首张卡片可见且 controls.activeItem 指向首项，但所有卡片都未激活。空列表先显示业务空态。

组件没有监听列表重排来重新布局，动态替换或增删 items 后应选择有效值并用业务 key 重建。适合少量卡片；大量卡片仍会常驻，后台任务按 active 自行管理。文档站离开 KeepAlive 页面时卸载实例以清理动画，返回保持外部模型并重新挂载。

respectReducedMotion 默认尊重系统减少动态效果偏好，在 next 执行时直接设置布局；不保证系统设置变化立即取消正在运行的时间线。

:::

::::
