::::article{class="doc-page"}
<p class="doc-eyebrow">组件</p>

# BingSlider {#overview}

单值或范围滑块，原生 range 负责焦点、读屏、label 与表单提交，自绘轨道和滑块负责指针操作。单值使用数字，range 使用元组；精确数字输入和偏好持久化由业务处理。

:::section{id="basic" class="doc-section"}
## 连续更新与结束提交

v-model 连续更新，change 在指针结束、键盘松开或失焦时为已接受的变化提交一次。方向键单步，Shift+方向键十倍步长；Home/End 到端点，PageUp/PageDown 为范围 10% 且不小于 step。Esc 撤销拖动并阻止外层 Esc。为滑块提供 label 或 ariaLabel，带单位时使用 formatValueText。

触屏点按轨道在松手时生效，横向滑块上的纵向滑动保留滚动。拖动直接跟随，点击轨道和外部恢复默认有短过渡，减少动态效果时立即到位。受控拒绝时拖动期间保留预览，结束后回到父级接受值。

step 从 min 起算。若最大值不在刻度上，最后一个可选值为不超过 max 的合法刻度；非法值只在显示和交互时规范化，不主动回写受控模型。表单容器的禁用、描述和错误状态通过公共表单上下文继承。

滑块方向由自身的 orientation 决定，放入 BingDialog 或纵向 BingScrollbar 后仍默认横向。点击下方“在弹窗中调整”，可在弹窗内修改同一宽度；轨道拖动、键盘调整与双击恢复默认保持一致。

::slider-basic-example
::
:::
:::section{id="range" class="doc-section"}
## 尺寸、刻度、气泡与范围

tooltip 默认 never。auto 在操作时显示，formatTooltip 控制可见文案；它与读屏的 formatValueText 分开。气泡上方预留空间。离散档位由 marks 与 snapToMarks 指定。范围两端不交叉，可设置 minDistance；两个原生 input 共用 name，表单通过 getAll(name) 读取两个值，分别提供 thumbAriaLabels。

::slider-range-example
::
:::
:::section{id="vertical" class="doc-section"}
## 竖向与双击恢复

vertical 从下到上增大，不随 RTL 翻转，默认高 200px；触屏纵向意图才启动。双击滑块恢复 resetValue，范围模式恢复整个元组。越界按住时仅滑块外观弹性变化，模型仍受约束，松手回弹；减少动态效果关闭弹性。保留恢复按钮供键盘与触屏使用，竖向气泡左侧预留空间。

::slider-vertical-example
::
:::
:::section{id="controlled" class="doc-section"}
## 受控预览与恢复默认

::slider-controlled-example
::

0.18.0 保留根节点、禁用 / 状态类和 --bing-slider-color，新增轨道、滑块颜色与尺寸变量。内部 DOM 已调整，原生 range 伪元素覆盖需迁移；指针测试按 .bing-slider / .bing-slider__thumb 的几何位置操作，键盘继续操作 input。

0.18.4 修正了祖先容器的 is-vertical 类误触发滑块竖向样式的问题，方向样式只作用于滑块自身；放在弹窗或纵向滚动区时无需额外覆盖组件内部样式。

| 公开变量 | 用途 |
| --- | --- |
| `--bing-slider-color` | 已选轨道与滑块强调色 |
| `--bing-slider-track-color` | 未选轨道颜色 |
| `--bing-slider-track-height` | 轨道粗细 |
| `--bing-slider-thumb-size` | 滑块尺寸 |
| `--bing-slider-thumb-border` | 滑块边框（完整 border 值） |
| `--bing-slider-hit-height` | 操作区域厚度 |
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
:::section{id="expose" class="doc-section"}
## 实例方法
::docs-api-table{name="expose"}
::
:::
:::section{id="types" class="doc-section"}
## 公开类型
::docs-api-table{name="types"}
::

多个实例应使用不同的 id；独立示例通过 useId 生成。需要数值框时并列使用 BingInput，以同一业务状态连接。
:::
::::
