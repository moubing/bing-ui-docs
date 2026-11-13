::::article{class="doc-page"}
<p class="doc-eyebrow">组件</p>

# BingResizable {#overview}

BingResizable 是可调整尺寸容器，用于代码面板、预览器、可拖拽编辑区域和需要用户临时改变尺寸的内容块。它支持多方向手柄、固定对边或镜像缩放、尺寸步进、比例锁定、父容器约束、键盘方向键调整，以及受控/非受控两种用法。

:::section{id="basic" class="doc-section"}
## 基础调整

默认只显示 `right`、`bottom` 和 `bottom-right` 三个手柄。拖拽变化时会先发送 update:size、update:position，再发送 resize；结束时再次提交更新，再发送 resize-end。Shift + 方向键使用四倍步长。Escape 会结束并提交当前调整，不会撤销。

defaultSize/defaultPosition 是非受控起始配置；开始保存用户调整后，修改默认值需配合 reset() 才会应用。下方“应用初始尺寸”用于这个场景。窄屏预览区可以横向滚动，拖拽画布保持足够空间。尺寸建议用像素数字，百分比、rem 等字符串的 CSS 显示与内部 parseFloat 数值并不等价。

::resizable-basic-example
::

:::

:::section{id="modes" class="doc-section"}
## 固定和镜像模式

`fixed` 模式会固定被拖拽方向的对边；`mirror` 模式会围绕中心对称缩放，所以尺寸变化时 `position` 也会同步变化。

::resizable-modes-example
::

:::

:::section{id="constraints" class="doc-section"}
## 约束和比例

`contain` 在调整过程中参考父容器内容盒裁剪尺寸和位置，不会在初始化或父容器变化时自动修正。`lockAspectRatio` 使用每次操作开始时的宽高比；此例同时展示 right、bottom 和 bottom-right 手柄。

0.12.5 修复角手柄的尺寸突跳：指针位移投影到起始宽高比的对角线上，横纵方向互换、反向或轻微抖动时尺寸连续变化。边手柄及键盘方向键仍按对应轴调整；角手柄按起始长边吸附（宽大于等于高使用 step.x，否则使用 step.y），吸附轴在一次操作内保持不变。live 允许预期的网格步进，end 在松手时才吸附。例如 500×250 从右下角移动 (100,100) 到 (100,101)，无步进和边界限制时由 620×310 连续变为 620.4×310.2。

父容器约束在比例计算之后生效，到达边界可能改变比例；最小尺寸大于父容器时也无法保证完全放入。示例为允许的最大尺寸预留足够空间，并避免互相冲突的限制。

::resizable-constraints-example
::

:::

:::section{id="expose" class="doc-section"}
## 实例方法

通过 ref 可以读取当前尺寸和位置，或重置到初始状态。受控模式下依然需要用`update:size` 和 `update:position` 同步外部状态。

::resizable-methods-example
::

:::

:::section{id="controlled" class="doc-section"}
## 受控尺寸和位置

同时使用 v-model:size 与 v-model:position 保存调整结果。只传入 size/position 而不接收更新时，拖拽期间会显示临时结果，结束后返回外部值。reset() 在受控模式下也只通过 update 事件通知，所以必须同步两项状态。handle 插槽替换手柄内容，外部按钮语义及键盘操作由组件保留。

::resizable-controlled-example
::

:::

:::section{id="props" class="doc-section"}
## 属性

::docs-api-table{name="props"}
::

:::

:::section{id="directions" class="doc-section"}
## 手柄方向

::docs-api-table{name="direction"}
::

:::

:::section{id="slots" class="doc-section"}
## 插槽

::docs-api-table{name="slots"}
::

:::

:::section{id="events" class="doc-section"}
## 事件

失去窗口焦点等中断会提交已调整的值，但不一定发送 resize-end；不要把状态同步仅放在 resize-end 中。

::docs-api-table{name="events"}
::

:::

:::section{id="expose-api" class="doc-section"}
## 实例接口

::docs-api-table{name="expose"}
::

:::

:::section{id="types" class="doc-section"}
## 参数类型

::docs-api-table{name="types"}
::

:::

::::
