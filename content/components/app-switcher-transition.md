::::article{class="doc-page"}
<p class="doc-eyebrow">组件</p>

# BingAppSwitcherTransition {#overview}

BingAppSwitcherTransition 是应用面板切换动效容器。它把多个面板放在同一个舞台里，通过 GSAP 做缩放、位移和聚焦切换，适合仪表盘、设置页、工作台这类需要在复杂状态之间平滑切换的场景。

:::section{id="basic" class="doc-section"}
## 基础切换

传入 `items` 后，组件会为每个 item 创建一张卡片，并在底部自动渲染一组 BingTabs。默认插槽负责渲染卡片内容，`active` 可以用来区分当前面板。

::app-switcher-transition-basic-example
::

:::

:::section{id="controls" class="doc-section"}
## 受控切换和配置

`showTabs` 可以隐藏内置 tabs，让外部控制器接管切换；`disabled` 阻止组件内部选择，但外部修改模型仍会切换；`loop` 控制循环边界；`respectReducedMotion` 用来照顾系统动效偏好。

受控用法必须接收更新，例如 `v-model="active"`。只传固定 `modelValue` 并忽略更新，会让卡片动画与模型、激活标记不一致。内部选择会依次触发 `update:modelValue` 和 `change`；外部按钮或业务直接修改模型不会补发事件，也不会等待前一次动画结束。`change` 表示选择请求，不表示动画完成。

::app-switcher-transition-controls-example
::

:::

:::section{id="wheel" class="doc-section"}
## 横向滚轮切换

组件根节点会监听 `wheel`。当横向滚动量大于纵向滚动量时，它会拦截这次滚动，并在累计偏移超过阈值后切换到上一张或下一张卡片。这个行为适合触控板横向滑动，但禁用状态下不会触发。

当前版本直接累计 `deltaX`，连续滚动停止约 58ms 后，累计绝对值严格大于 34 才切换一项；不会按 `deltaMode` 换算，也不把 Shift 加纵向滚轮自动转换成横向。动画进行中忽略内部切换。滚轮遇到禁用邻项不会跳过；标签键盘导航会跳过禁用项。即使处于动画中、边界处或邻项禁用，满足横向条件的滚轮事件仍会被 `preventDefault`。

:::

:::section{id="slots" class="doc-section"}
## 默认插槽

插槽会收到当前 item、索引、是否激活以及是否正在动画中。所有卡片一直挂载，切换不会销毁各自状态。示例以 `:inert="!active"` 防止隐藏内容继续获得键盘焦点；组件自身只设置卡片 `aria-hidden`，不会自动设置 inert、关联 tabpanel 或把焦点移进内容。业务字段的类型为 unknown，读取时先缩窄类型。

::app-switcher-transition-slots-example
::

### 插槽参数 {#slot-props}

::docs-api-table{name="slots"}
::

:::

:::section{id="props" class="doc-section"}
## 属性

::docs-api-table{name="props"}
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

类型均从 `@moubing/bing-ui` 导入；组件没有公开实例方法。默认插槽省略时显示 item.label。`ariaLabel` 只为内置标签栏命名，隐藏标签后需要业务自行提供内容语义。

初始未传模型时选中首个未禁用项；受控模型应始终命中有效项。无效值可能让首张卡片可见，但没有激活项且所有卡片 aria-hidden。确保 value 唯一且字符串化后仍唯一。空数据先显示业务空态；不要依赖组件修正无效选择。

当前版本没有监听列表重排来重新布局。动态替换、增删、重排 items 时，先选定有效值，再通过业务 key 重建实例。所有面板常驻，昂贵内容或后台任务应自行根据 active 管理。KeepAlive 页面离开时可卸载切换器，取消其动画和横向滚轮计时；文档站保留外部模型和计数，返回时重新挂载。

`respectReducedMotion` 默认尊重系统减少动态效果偏好，在切换时跳过动画；不要依赖系统设置变化立即取消已运行的时间线。示例中的布局 CSS 是业务样式，不是额外的组件属性。

:::

::::
