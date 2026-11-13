::::article{class="doc-page image-preview-doc"}
<p class="doc-eyebrow">组件</p>

# BingImagePreview {#overview}

BingImagePreview 是图片预览层，用于把一张或多张图片放进全屏查看器。它内置缩放、拖拽、旋转、重置、上一张/下一张、下载、键盘操作、滚动锁定和 Teleport 渲染。

:::section{id="basic" class="doc-section"}
## 基础打开

使用 `v-model` 控制预览层显示，`items` 传入图片列表。`initialIndex` 只决定打开时的初始图片，适合从固定入口打开预览。

索引从 0 开始；有 `currentIndex` 时优先使用它，否则使用 `initialIndex`。组件过滤地址为空的项并限制索引上下界，不负责取整或处理非有限数值；业务应传有限整数。空列表显示 暂无图片；加载失败显示 图片加载失败，没有重试插槽或 load/error 事件。

四份示例的 SVG 图片均内置。下面的封面有空值判断，业务列表尚未加载时也可以渲染。

::image-preview-basic-example
::

:::

:::section{id="controlled-gallery" class="doc-section"}
## 受控图库

当预览入口来自缩略图列表时，用 `v-model:current-index` 控制当前图片。用户在预览层切换图片后，外部索引也会同步更新。

打开时不发送 `change` 或 `update:currentIndex`。导航或外部索引变化会先发送目标索引和图片项，再异步预加载目标图片；计数器可能已经变化，而旧图和说明仍显示。计数器使用补零的数字（如 01/03），并通过中文名称“第 1 张，共 3 张”和状态区域播报。等待期间再次切换会取消旧请求的结果，返回原图也会通知索引。`change` 不能用来判断图片加载成功。

当前索引带有内部状态：只写 `:current-index="0"` 并忽略更新，用户仍能切图。用双向绑定保持一致，不要把固定属性当成切图禁用开关。外部替换列表会按新长度限制内部索引，不会因此补发索引或 change 事件。

::image-preview-gallery-example
::

:::

:::section{id="toolbar-behavior" class="doc-section"}
## 工具栏与行为

预览层的工具栏负责切换、缩放、旋转、重置和下载；行为类 props 则控制是否循环、是否锁定页面滚动、是否允许 Escape 或遮罩关闭。

左右方向键切图，`+`/`=` 放大，`-` 缩小，`0` 重置。滚轮改变缩放；拖动平移，双击在放大和 1 倍之间切换。旋转通过工具栏每次改变 90°；打开、成功切图和重置会恢复 1 倍、零位移和零旋转。缩放区间建议包含 1，因为打开和重置不会把 1 再限制到区间内。

关闭按钮、遮罩、Escape 依次发送 `update:modelValue(false)` 和 `close(reason)`，父组件必须接收模型更新。忽略更新时弹层仍开着；外部直接赋值 false 不发送 close。正常关闭后恢复滚动和打开前的焦点，关闭动画结束没有单独事件。

`showToolbar=false` 也会隐藏关闭按钮、计数器和加载指示，但键盘、滚轮和桌面两侧导航仍可用。手机布局隐藏两侧导航。本示例在关闭工具栏和遮罩退出后保留 Escape，确保键盘仍可退出。业务不要同时禁用所有关闭入口，也不要依赖模态焦点范围之外的按钮提供键盘退出。

下载先发出 `{ item, index }`，再用原生链接打开 `downloadUrl || previewSrc || src`。没有取消参数、进度或成功通知；文件名只是 `a.download` 建议值。切图等待期间下载针对仍显示的旧图，不能用先行变化的外部索引代替 payload.index。

::image-preview-behavior-example
::

:::

:::section{id="glass" class="doc-section"}
## 玻璃效果

预览层默认跟随主题：blur 为 16、opacity 为浅色 0.86 / 深色 0.92、saturation 为 1.05。参数留空时使用主题默认值。关闭 `glass` 会令模糊为 0、饱和度为 1、浮动控件背景不透明，深色遮罩仍保留。`glassOpacity` 改变工具栏、说明等浮动区域的背景，不改变遮罩的底色透明度。

::image-preview-glass-example
::

:::

:::section{id="accessibility-lifecycle" class="doc-section"}
## 焦点与生命周期

根节点提供 `role="dialog"`、`aria-modal="true"` 和 `ariaLabel`，正常打开后聚焦根节点，正常关闭后尝试恢复先前焦点。Tab/Shift+Tab 在模态范围内循环，背景焦点会被引导回当前预览，但不会给背景统一设置 inert。图片快捷键仍不自动排除输入控件，业务扩展需注意事件处理。

`lockScroll` 在打开时读取，打开期间修改不会立即加锁/解锁。预览与 Dialog、FilePreview 共享浮层顺序和滚动锁；Escape 由最上层处理，最后一个持锁浮层退出后才恢复滚动。卸载会清理监听、计时器和本实例的滚动锁，浮层管理器会尝试恢复仍存在的先前焦点，不补发关闭事件。缓存页面离开时也应关闭或卸载；本页停用时关闭并卸载四个预览，切回可重新使用。

组件没有公开插槽和实例方法。自定义工具栏、加载/错误内容或下载拦截不是当前 API 支持的能力。

:::

:::section{id="props" class="doc-section"}
## 属性

::docs-api-table{name="props"}
::

:::

:::section{id="item-events" class="doc-section"}
## 图片项与事件

### 图片项 {#item-shape}

::docs-api-table{name="item"}
::

### 事件 {#events}

::docs-api-table{name="events"}
::

### 公开类型 {#api-types}

::docs-api-table{name="types"}
::

:::

::::
