::::article{class="doc-page button-doc"}
<p class="doc-eyebrow">组件</p>

# BingButton {#overview}

BingButton 是基础操作按钮，负责承载页面里的主操作、次操作、危险操作和状态反馈。它内置尺寸、圆角、加载态、禁用态、点击节流、prefix/suffix 插槽，以及基于 BingAnimatedText 的文字动效。

:::section{id="playground" class="doc-section"}
## 基础配置

通过 `variant`、`size` 和 `rounded`控制按钮的视觉层级、尺寸和圆角。下面的示例可以直接修改按钮文案和常用状态。

按钮文案使用默认插槽；下方 options 的 label 是示例参数，不是 Button 属性。`htmlType` 默认为 `button`，需要提交表单时显式设置 `html-type="submit"`。按钮不会自动执行保存请求。

::button-basic-example
::

:::

:::section{id="variants" class="doc-section"}
## 类型与语义

`variant` 用于表达操作语义。主按钮使用中性实色，并默认带文字扫光；其它类型默认保持静态文字，悬停时从指针位置铺开波纹。点击时播放短促碎屑反馈，按钮本体保持稳定。禁用、加载、节流拦截和减少动态效果时不播放新的点击反馈。

::button-variants-example
::

:::

:::section{id="busy-feedback" class="doc-section"}
## 繁忙页面的点击反馈

从 0.19.0 起，共享碎屑使用浏览器原生 `transform` / `opacity` 动画，保留 12 粒、540ms 的散开与淡出。动画提交后无需 JavaScript 逐帧驱动；组件卸载、清空键隐藏或菜单关闭不会打断已接受的反馈。整个应用卸载、来源滚动、窗口缩放、页面隐藏会清理反馈，连续操作最多保留三组。浏览器不支持 Web Animations 时跳过装饰，不影响操作。

`click` 仍在原事件中同步触发，不等待动画结束，因此剪贴板、文件选择和原生表单语义不变。若业务马上同步挂载大量 DOM，仍会推迟动画的首次绘制；路由或视图切换可以先给浏览器一次绘制机会，再执行重渲染。不要延迟需要用户激活的剪贴板和文件选择，也不要把网络等待、固定 540ms 延迟当成解决办法。

下面刻意模拟 300ms 主线程工作，先提交点击反馈，再开始计算；这种忙循环只用于观察动效，不应放入实际业务。减少动态效果时不播放碎屑。文字扫光和悬停波纹是独立效果。

::button-busy-example
::

:::

:::section{id="sizes" class="doc-section"}
## 尺寸与圆角

`size` 控制按钮高度、内边距和字号，`rounded`控制圆角等级。两者可以组合用于表单、工具栏、卡片操作区等不同密度的场景。

五档高度为 `xs=28`、`sm=32`、`md=36`、`lg=40`、`xl=44px`。未传入 size 时按 FormItem → Form → md 继承；disabled 同样支持表单继承，显式值优先。尺寸示例显式设置参数，便于横向对照。

::button-sizes-example
::

:::

:::section{id="text-effect" class="doc-section"}
## 文字动效

Button 内部复用了 BingAnimatedText。通过 `textEffect`和 `textEffectTrigger` 可以控制文字扫光或字符跳动。

非加载状态下，显式 textEffect 优先于 textShine；text-effect="none" 关闭普通文字动效。Button 支持 none / shine / jump，shimmer 请单独使用 BingAnimatedText。hover 感应覆盖整个按钮，包括内边距与图标，键盘聚焦也能播放；扫光与跳动从指针进入位置起势。默认扫光时长为 1.6 秒、间隔为 2.4 秒。

::button-text-effect-example
::

:::

:::section{id="states" class="doc-section"}
## 状态与点击节流

`loading` 和 `disabled` 都会让按钮不可点击。0.6.0 默认关闭 `throttle`，需要防止短时间重复操作时显式开启，并通过 `throttled` 事件读取剩余等待时间。

loading 保留文字并临时循环播放 jump，沿用 `textJump` 参数，结束后恢复原先效果；带文字按钮仍保留前后图标，纯图标按钮改用加载图标。显式禁用及减少动态效果时保留静态文字。即使设置 textEffect=none，有文字的加载状态仍会使用 jump。

节流从上一次有效点击计时，间隔结束后允许下一次点击，不会等待异步请求完成。需要等待请求时，由业务在 try/finally 中设置 loading；`:throttle="false"` 或不大于 0 的 throttleDelay 可关闭节流。throttled 的参数是一个包含 event 和 remaining 的对象，remaining 是本次拦截时的剩余毫秒数，不是自动递减的倒计时。

Toast 示例只显示本地反馈。独立运行时挂载一个 BingToast；若应用根部已有 Toast 容器，可复用根部容器。

::button-throttle-example
::

:::

:::section{id="text-swap" class="doc-section"}
## 动态文案

textSwap 默认 false，按需开启后，文案变化与按钮宽度平滑过渡。它独立于 textEffect；禁用及减少动态效果仍保留正确终态。下面只模拟复制结果，不访问剪贴板；关注状态保存在当前示例内。

::button-swap-example
::

:::


:::section{id="flex-row" class="doc-section"}
## 并排布局与长文字

0.18.0 起按钮默认 `flex-shrink: 0`，仍保留 `max-width: 100%`。与输入框并排时输入侧设置 `min-width: 0`；确需收缩的按钮显式设置 `flex-shrink: 1; min-width: 0`。省略号位于实际文字层，前后缀图标及加载状态继续保留。

键盘焦点使用全局 `--bing-focus-ring` 实色轮廓；自定义主题应分别验证亮暗表面上的辨识度，柔和光晕仍由 `--bing-focus` 控制。

::button-flex-row-example
::
:::

:::section{id="props" class="doc-section"}
## 属性

::docs-api-table{name="props"}
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

::::
