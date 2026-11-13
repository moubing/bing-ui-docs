::::article{class="doc-page"}
<p class="doc-eyebrow">组件</p>

# BingSplitPane {#overview}

水平分栏布局：左侧正文占据剩余空间，右侧栏按偏好宽度参与正常布局。组件负责尺寸和交互，业务决定何时切换抽屉、是否显示侧栏，以及如何保存偏好。

:::section{id="basic" class="doc-section"}
## 实际宽度与偏好宽度

sideSize 表示用户偏好。容器不足以容纳 minMainSize 与侧栏时，组件临时压缩侧栏，必要时低于 minSideSize；容器恢复后自动恢复偏好。这种约束变化不发送 update:sideSize，不能把当前实际宽度直接持久化。组件不内置 Cookie 或 localStorage。

拖动分隔条向左会扩大右侧栏；过程中的 resize 报告实际宽度，松手才提交模型并发送 resize-end。需要保存时读取 resize-end.preferredSize。没有移动的点击不会覆盖此前受压缩的偏好。方向键左右调整、Home/End 到当前边界，Enter 或双击恢复 defaultSideSize。

Esc、pointercancel、捕获丢失、窗口失焦、容器变窄或被隐藏、受控值或约束变化以及卸载会取消本次拖动。取消恢复已提交偏好，不发送模型更新或 resize-end。示例为了适配文档宽度显式使用更小的最小值，这些值不是组件默认值。

分栏被 KeepAlive 缓存（移出文档）或经 display:none、v-show 隐藏时，组件保留上次测得的容器宽度，不把隐藏期间的 0 宽当作容器变窄；重新显示时侧栏直接以原宽度渲染，正文宽度不跳动，业务也不必在重新显示后纠正滚动位置。显示状态下容器真实变窄仍按上述规则压缩。此行为自 0.12.2 起提供；0.12.1 及更早版本重新显示时，侧栏会先以 0 宽渲染一帧再展开。

::split-pane-basic-example
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
## 公开类型
::docs-api-table{name="types"}
::

组件不提供垂直分栏或多分隔条。左右内容区 min-width/min-height 为 0 并裁剪溢出；滚动由业务在插槽内放置 BingScrollbar。狭窄视口应由业务切换合适的面板布局。
:::
::::
