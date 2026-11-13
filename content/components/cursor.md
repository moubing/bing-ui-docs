::::article{class="doc-page"}
<p class="doc-eyebrow">组件</p>

# BingCursor {#overview}

BingCursor 提供 16 种内置光标外观，通过 CSS cursor 交给浏览器原生绘制。鼠标位置由浏览器更新，组件只在状态、作用域或外观变化时切换图片，不创建随鼠标移动的 DOM 层。默认仅作用于包裹的内容。

0.7.0 移除了 DOM 跟随、连续形变与自定义 cursor 插槽。旧项目请参考[升级指南](/docs/upgrade#cursor)，删除 mode、followDuration、transitionDuration、zIndex 和 data-bing-cursor-label 等旧用法。

:::section{id="basic" class="doc-section"}
## 自动识别

默认 type=auto 会读取元素的 CSS cursor，并结合输入框、链接、禁用等语义解析状态。下面的按钮可以正常点击，输入框和 contenteditable 正文可以正常编辑；抓取区域只展示按压反馈，不实现拖拽功能。

鼠标进入作用域后接管光标；触摸或笔输入不接管。按 Tab 或 Escape 会暂停接管，下一次鼠标输入可恢复。组件不拦截点击，也不代替控件原有的名称与焦点反馈。

::cursor-basic-example
::

:::

:::section{id="states" class="doc-section"}
## 16 种状态

在不同状态之间直接切换内置图片，不附加移动延迟或形变动画。图片按类型、尺寸和配色缓存，相同外观可以复用。系统开启减少动态效果时，这些静态光标仍然可用。

有效的 data-bing-cursor 声明优先于固定 type；disabled、aria-disabled=true 和 inert 等禁用语义仍优先。grab 在主键按下时变成 grabbing。该判断不改变控件本身的可用性。

native、cursor:none 及原生控件排除规则先于状态覆盖。auto 遇到 wait、progress、图片光标等未内置 CSS 状态会保留原有光标。CSS 方向别名会归并，例如 n/s-resize 到 ns-resize、all-scroll 到 move。

::cursor-states-example
::

:::

:::section{id="appearance" class="doc-section"}
## 配色、尺寸与热点

color、outlineColor 和 size 调整内置图片外观。也可在祖先元素设置 --bing-cursor-color 与 --bing-cursor-outline；局部实例会继承这些变量，无需将配色提升到 body。

hotspot 是图片内部真正对应点击位置的坐标。通常保留各状态的默认热点；自定义时坐标会取整并限制在画布内。光标尺寸限制在 8–128px，浏览器自身还可能限制图片尺寸或在窗口边缘使用系统光标。

::cursor-appearance-example
::

:::

:::section{id="native" class="doc-section"}
## 停用与系统光标

disabled 停用整个实例；data-bing-cursor=native 只让指定区域使用原本的 CSS 光标。auto 模式遇到 wait 等不支持的状态时会自动保留它。每个图片光标同时提供同语义的系统关键字，图片被浏览器或 CSP 拒绝时可以回退。

::cursor-native-example
::

:::

:::section{id="scope" class="doc-section"}
## 全局与局部作用域

global=false 仅匹配默认插槽的 DOM 后代，根节点使用 display:contents，不产生额外布局盒。global=true 覆盖当前文档，可以在应用根部放一个无默认插槽的实例。局部优先于全局，嵌套局部以内层优先；同一位置只由一个有效实例接管，多个全局实例以后注册的为准。

长文档可以在应用根部复用一个全局实例，无需为每个段落、图片或列表项挂载 Cursor。global 描述接管范围，不承诺未被鼠标命中的元素也具有相同的计算样式；不要依赖内部标记或读取祖先的 cursor 判断当前鼠标外观。

局部范围按实际 DOM 判断。Teleport 到 body 的 Dialog 或下拉面板不自动属于局部实例；可在弹层内容中另包局部实例，或让全局实例接管。global 不跨 iframe 文档。文档站默认使用系统光标；下面的全局开关仅用于演示，默认关闭，离开页面后自动关闭。

::cursor-scope-example
::

:::

:::section{id="native-lifecycle" class="doc-section"}
## 原生边界与清理

iframe、开放的 Shadow DOM 宿主、原生 select、video/audio、原生 dialog 与 popover、滚动条、原生 HTML 拖放等场景保留原有行为；封闭 Shadow DOM 无法自动识别，应在宿主显式设置 native。强制颜色模式、触摸/笔输入或设备不支持精确悬停指针时不接管。

自动读取 CSS 状态需要样式表可被浏览器读取。跨域 CSSOM 无法读取时，可用 data-bing-cursor 指定支持的状态。窗口失焦、离开文档、页面隐藏、改变窗口尺寸、禁用或卸载都会停止接管；指针捕获期间保持捕获控件的语义。

**0.9.3 性能修复：** 0.9.1 的全局模式在形状变化时修改覆盖整页的 CSS 规则，长文档滚动经过文本和图片时可能反复重算全页样式。新版预生成 16 种状态，普通区域仅标记命中元素及捕获控件；contenteditable 区域将光标标记留在编辑根节点，并用悬停规则匹配内容，避免触发 ProseMirror 重建段落。常规状态切换不改写样式表；配色、尺寸或热点变化时重建实例样式。公开 API、图片外观与接管优先级不变。0.9.2 的编辑区处理存在上述兼容问题，富文本应用应直接升级至 0.9.3。

**0.11.1 性能补丁：** 全部实例停用时不再执行滚动命中、CSSOM 扫描或帧调度。编辑区 auto 模式用稳定的根标记及样式源镜像处理文字、链接、图片控件和禁用状态，沿悬停路径解析各元素的光标；普通状态切换不再不断更新编辑根属性，也不通过关系选择器扫描悬停后代。编辑器切到只读后仍保护正文 DOM，段落、表格及 NodeView 内容不写入光标属性。行内 cursor、CSS 变量解析出的特殊值、固定 type 及指针按压/捕获保留既有根映射路径，优先保证语义与兼容性。公开属性和事件不变。

自动识别示例可展开长正文，直接检查滚动、文字编辑和图片控件的状态切换。自定义指针始终由浏览器绘制，测试中读到的 rAF 时间不能视为屏幕最终呈现时间。

最后一个实例卸载后移除共享监听、观察器及注入样式，恢复原先保存的属性。KeepAlive 只停用而不卸载子组件时，业务应显式停用或卸载 Cursor；本页独立示例使用 onActivated/onDeactivated 管理挂载，全局示例同时重置开关和弹窗。

组件没有公开实例方法。不要把内部 DOM、私有 CSS 变量或控制器当作公共 API。

:::

:::section{id="props" class="doc-section"}
## 属性

::docs-api-table{name="props"}
::

:::

:::section{id="slots" class="doc-section"}
## 插槽

::docs-api-table{name="slots"}
::

:::

:::section{id="events" class="doc-section"}
## 事件

::docs-api-table{name="events"}
::

:::

:::section{id="attributes" class="doc-section"}
## 元素属性

::docs-api-table{name="attributes"}
::

:::

:::section{id="types" class="doc-section"}
## 公开类型

所有公开类型从 @moubing/bing-ui 导入。

::docs-api-table{name="types"}
::

:::

::::
