::::article{class="doc-page color-picker-doc"}
<p class="doc-eyebrow">组件</p>

# BingColorPicker {#overview}

BingColorPicker 是颜色选择器，用于品牌色、主题变量、图表色板和可视化配置。它提供色域、色相、透明度、格式化文本、预设色板和复制反馈，并支持表单状态与玻璃效果。

:::section{id="playground" class="doc-section"}
## 基础配置

使用 `v-model` 绑定颜色值，`presets` 提供常用色板。下面的示例可以调整尺寸、状态、宽度和禁用状态。

接受 3/4/6/8 位 HEX（可省略 #）、RGB(A) 和 HSL(A)。RGB 通道会取整并限制到 0–255，透明度保留两位小数；不是浏览器完整 CSS 颜色解析器，red、transparent、CSS 变量和 color() 等不可直接使用。无效外部值或空字符串会显示默认粉色，但不主动修正父级模型。

面板默认展示八位 HEX（不透明时结尾为 ff）；切换 HEX/RGBA/HSL 只影响显示与复制，不改变 v-model 的输出格式。**update:modelValue 和 change.value 始终是六位 HEX。** 简单不透明颜色可使用下面的 v-model；要完整保存透明度，请使用事件示例中的 change.rgba。

::color-picker-basic-example
::

:::

:::section{id="presets" class="doc-section"}
## 预设色板

`presets` 可以传字符串数组，也可以传带 `label` 的对象数组。对象的 label 用于色块 title 和 “选择”加名称的可访问文本；复制的是颜色字符串。无效预设被过滤，空数组表示不显示色板。预设会归一化到六位 HEX，重复颜色需自行去重以避免 key 冲突。预设中的透明度会丢弃，点击预设保留当前面板透明度，不代表采用预设原有 alpha。

::color-picker-presets-example
::

:::

:::section{id="sizes" class="doc-section"}
## 尺寸

`size` 控制触发器高度和内容密度，sm/md/lg 分别为 32/36/40px；表单内默认继承尺寸。默认磨砂跟随主题，浅色不透明度 0.86、深色 0.92，模糊 16px、饱和度 1.05。

::color-picker-sizes-example
::

:::

:::section{id="events-demo" class="doc-section"}
## 事件反馈

`change` 会返回颜色的多种格式和变更来源；复制按钮会触发 `copy` 或 `copyError`，适合做提示或埋点。

色域、色相、透明度和有效文本输入先更新面板草稿，停止输入约 180ms 后提交；指针结束、滑条 change、文本 blur/Enter、选择预设或关闭面板可以立即提交。已安排输入即使结果颜色相同仍可能发出 change，业务应按需去重。来源 field 为色域，slider 为色相，alpha 为透明度。

输入非法文本时用 aria-invalid 标记，失焦恢复有效内容；Escape 不是完整的撤销操作，关闭前仍可能提交有效草稿。事件示例用 `:modelValue="color"` 和 `@change` 保存 `payload.rgba`，用于持久化完整透明度。0.6.0 会保留本次提交经 v-model 回传时的面板 alpha，但父级模型仍是六位 HEX，重新挂载后不能恢复未保存的透明度。实例方法只能在挂载后通过组件 ref 调用。

::color-picker-events-example
::

:::

:::section{id="props" class="doc-section"}
## 属性

::docs-api-table{name="props"}
::

:::

:::section{id="preset-shape" class="doc-section"}
## 预设结构

::docs-api-table{name="preset"}
::

:::

:::section{id="events" class="doc-section"}
## 事件与方法

### 事件 {#event-list}

::docs-api-table{name="events"}
::

### 实例方法 {#expose}

::docs-api-table{name="expose"}
::

:::

:::section{id="types" class="doc-section"}
## 类型与交互边界

::docs-api-table{name="types"}
::

类型从 `@moubing/bing-ui` 导入。组件不提供自定义插槽，也没有受控 open、format、teleportTo 或 panelPlacement 属性。面板传送到 body，使用固定定位，z-index 默认 2900（BingConfigProvider 的 zIndex 基准 + 900）；按视口空间自动选择上下位置。panelWidth 建议传像素数，触发器 width/minWidth 才是 CSS 长度。

触发器可用 Enter、空格、ArrowDown 打开，Escape 在触发器或普通面板控件上关闭并返回触发器；颜色文本框中的 Escape 会先恢复格式化内容并结束编辑，面板仍保持打开。色域方向键按 2% 调节，Shift 加方向键按 10%；色相和透明度使用原生范围输入。打开不会自动把焦点移入面板，也没有独立的 Tab 焦点陷阱；Dialog 中可继续操作颜色面板及其格式选择器，Escape 按当前浮层逐层关闭。外部点击关闭，禁用也会关闭。

复制使用所选格式：HEX 为八位 hexAlpha，RGBA 为 rgba 字符串，HSL 在透明时为 hsla。优先 Clipboard API，失败再尝试浏览器复制命令，全部失败才发 copyError；成功才发 copy。copyLabel/copiedLabel 会附加格式名，copyResetDelay 只控制反馈恢复，不能表示复制耗时。

FormItem 可提供 id、尺寸、禁用、状态和说明关联，颜色提交与失焦通知表单校验；status 只表示样式，不自动保证颜色符合业务规则。文档站离开缓存页面时卸载全部选择器和格式浮层，清理监听器与计时器；返回保留已提交颜色，未提交草稿在卸载时取消。

:::

::::
