::::article{class="doc-page"}
<p class="doc-eyebrow">组件</p>

# BingTabs {#overview}

BingTabs 是横向 tablist 组件，用于在同一页面区域中切换内容分组。它负责渲染可访问的 `role="tablist"` 和 `role="tab"`，处理鼠标点击、键盘方向键、禁用项跳过和活动指示器动画；具体内容面板由业务根据当前 value 自己渲染。

点击碎屑与 Button 共用反馈引擎。从 0.19.0 起，碎屑交由浏览器原生动画推进，选中模型和 change 仍同步通知；活动指示器是独立动画。大量内容首次挂载仍可能延迟碎屑首帧，业务可先更新标签选择、给浏览器绘制机会，再挂载对应内容，并取消已被后续选择替代的任务。相关边界与演示见 [Button 的繁忙页面反馈](/docs/components/button#busy-feedback)。

每个 `value` 必须唯一，类型为 `string | number`；业务比较时要区分数字和字符串。示例使用 `v-model` 同步选中值，`change` 的参数是对象，不是 value 本身。传给组件的可访问名称属性为 `ariaLabel`；完整示例使用这个名称，以兼容严格模板类型检查。

:::section{id="basic" class="doc-section"}
## 基础切换

使用 `items` 描述 tab，使用 `v-model` 保存当前选中值。切换后可以根据当前 value 渲染自己的内容面板。 `smoothScroll` 默认只作用于标签栏溢出时的横向滚轮滚动；设为 `false` 可关闭，点击和键盘定位仍保持即时。

::tabs-basic-example
::
:::

:::section{id="variants" class="doc-section"}
## 样式组合

`variant` 提供 pill、glass、soft 三种样式。pill 使用胶囊外形和实色选中块；glass 使用主题磨砂，默认浅色不透明度 0.86、深色 0.92，模糊 16px、饱和度 1.05；soft 使用中性底色和较弱的选中边框。

sm/md/lg 可见标签栏高度为 32/36/40px，内部标签最小高度为 24/28/32px。外层上下各保留 4px，总占位高度为 40/44/48px；底部空间用于横向滚动条，是否溢出都不会改变组件高度。与文字、按钮放在同一工具栏时，父容器使用 `display: flex; align-items: center` 即可垂直居中。

下面三组分别展示 sm、md、lg 与文字、按钮的对齐。窄屏时长标签保持原宽度，通过横向滚动查看；方向键和 Home/End 会将聚焦项滚入可见范围。

::tabs-variants-example
::
:::

:::section{id="item-slot" class="doc-section"}
## 自定义标签内容

通过 `item` 插槽可以把业务字段渲染进 tab，例如状态点、数量徽标或更完整的无障碍文案。这些字段可以直接挂在 `BingTabItem` 上。

::tabs-item-slot-example
::
:::

:::section{id="keyboard" class="doc-section"}
## 键盘激活模式

`activation="auto"` 下，方向键移动焦点会直接切换选中项；`activation="manual"` 下，方向键只移动焦点，用户按 Enter 或 Space 才切换。当 tab 内容加载较重时，manual 可以避免用户扫过多个 tab 时连续触发内容刷新。

::tabs-keyboard-example
::
:::

:::section{id="props" class="doc-section"}
## Props

::docs-api-table{name="props"}
::
:::

:::section{id="item" class="doc-section"}
## BingTabItem

::docs-api-table{name="item"}
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

事件参数类型如下。`previousValue` 和 `previousItem` 可能不存在，读取前应处理空值；点击当前已选中的标签不会产生新的选中值变化。

```ts
type BingTabValue = string | number
interface BingTabItem {
  value: BingTabValue
  label: string
  disabled?: boolean
  ariaLabel?: string
  [key: string]: unknown
}
interface BingTabsChangePayload {
  value: BingTabValue
  previousValue?: BingTabValue
  item: BingTabItem
  previousItem?: BingTabItem
  event: MouseEvent | KeyboardEvent
}
interface BingTabsFocusPayload {
  value: BingTabValue
  item: BingTabItem
  event: FocusEvent
}
```
:::
::::
