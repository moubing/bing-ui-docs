::::article{class="doc-page card-doc"}
<p class="doc-eyebrow">组件</p>

# BingCard {#overview}

BingCard 是内容容器，用于承载信息卡片、功能入口、数据摘要和可翻面的展示面板。它把标题、描述、媒体区、正文、底部操作和反面内容拆成清晰插槽，同时内置玻璃效果、指针倾斜、高光、入场动画和翻面交互。

:::section{id="playground" class="doc-section"}
## 基础配置

通过 `variant`、`padding` 和 `rounded`调整卡片外观；`glass`、`tilt` 和 `glare`控制卡片的质感和指针反馈。

此组件无 v-model，也没有公开的翻面实例方法；flip 事件用于接收当前面。`interactive=false` 只影响交互类名和倾斜处理，关闭翻面应设置 `flipTrigger="none"`。disabled 会阻止卡片表面的指针事件，但不会设置插槽按钮的 disabled，键盘仍可激活按钮；需要完全禁用业务操作时，请显式禁用子控件。玻璃参数的实际默认值已在 API 表展开。

::card-basic-example
::

:::

:::section{id="variants" class="doc-section"}
## 类型与空间

`plain` 和 `soft` 使用中性实色表面，`accent` 加入轻微强调色，`sky` 保留淡蓝色。开启 glass 后，磨砂只作用于卡片正反面的单层表面。模糊默认为 16px，不透明度随浅色 / 深色主题为 0.86 / 0.92，饱和度为 1.05；无需显式传入这些值。示例背景网格用于观察透明效果。

::card-variants-example
::

:::

:::section{id="entrance" class="doc-section"}
## 入场动画

`entrance` 用于设置卡片进入视口时的 GSAP 动画。文档中切换选项后，预览卡片会以新的 `key` 重新挂载，方便直接观察动画差异。

enter 表示准备入场，并非动画完成事件；entrance=none 或系统偏好减少动态效果时仍会通知。减少动态效果会跳过入场动画并关闭倾斜。entranceOnce 限制当前实例是否重复入场，重新挂载会创建新实例。

::card-entrance-example
::

::card-presets-example
::

:::

:::section{id="flip" class="doc-section"}
## 翻面交互

`flipTrigger` 支持 `click` 和 `press`。点击翻面适合显式查看详情，长按翻面适合带确认感的探索式内容。

默认是 press，示例选择 click。长按等待至少 120ms，移动超过 10px 或提前松开会取消；restore 在松开后恢复正面，stay 保持当前面。flip 在切换目标面时通知，并非动画结束后。flipAxis=z 只对入场旋转保留 z 轴，正反面切换回退为 y 轴。

0.6.0 的翻面仍依赖指针事件，卡片不是可聚焦按钮，反面始终带 aria-hidden。因此关键说明应同时提供普通正文或带按钮的可访问详情入口，不能只放在 back 插槽。点击翻面会忽略内部原生按钮、链接和输入控件等目标；包含长按或自定义交互时，仍可停止 pointerdown/click 冒泡，明确隔离业务操作。

::card-flip-example
::

:::

:::section{id="slots" class="doc-section"}
## 插槽组合

复杂卡片可以通过 `media`、`header`、`footer`和 `back` 插槽拆分结构，让页面里的展示面板保持清晰。

::card-slots-example
::

:::

:::section{id="props" class="doc-section"}
## 属性

::docs-api-table{name="props"}
::

:::

:::section{id="slots-events" class="doc-section"}
## 插槽与事件

### 插槽 {#slot-list}

::docs-api-table{name="slots"}
::

### 事件 {#events}

::docs-api-table{name="events"}
::

:::

::::
