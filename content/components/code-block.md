::::article{class="doc-page"}
<p class="doc-eyebrow">组件</p>

# BingCodeBlock {#overview}

BingCodeBlock 是代码展示组件，用于文档示例、配置片段和只读代码预览。它内部用 Shiki 做语法高亮，用 BingScrollbar 处理长代码滚动，并可选接入 BingResizable 让代码区域支持拖拽调整尺寸。

:::section{id="basic" class="doc-section"}
## 基础展示

传入 `code`、`language` 和 `title` 即可展示代码。头部会显示文件名、语言标签和复制按钮；高亮失败时会保留纯文本展示，并触发 `highlightError`。

自 0.12.0 起，Shiki 核心、语法和主题在首次高亮时才按需加载，并在之后复用；加载完成前先以纯文本渲染同样的行，不影响复制。依赖高亮颜色的测试应等待高亮完成后再断言。

`code` 是必填字符串，仅用于展示，不会执行里面的代码，也不是双向绑定的编辑器。下方完整示例内置了展示文本，复制 Vue 文件即可运行；嵌入字符串中的 Unicode 转义用于避免脚本结束标签截断外层 SFC。

`theme` 默认为 `auto`：组件会跟随 Bing UI 的全局 `light`、`dark` 或 `system` 主题解析高亮，其中亮色使用 `vitesse-light`，暗色使用 `github-dark`。显式传入具体 Shiki 主题后，高亮主题会保持固定，不再随全局主题切换。

::code-block-basic-example
::

::docs-callout{type="tip" title="关于 ?raw" class="codeblock-raw-callout"}
在 Vite/Nuxt 中，导入路径末尾的 `?raw` 会把文件作为原始文本字符串导入，也可用于提供 code。此页完整示例已经内置文本，不依赖外部示例文件；实际项目改用 raw 导入时，目标文件必须真实存在。
::

:::

:::section{id="highlight-scroll" class="doc-section"}
## 行高亮和滚动

`highlightLines` 支持单行和闭区间范围。代码较长时可以通过 `maxHeight`限制高度，内部滚动条会同时支持垂直和水平滚动；按住 Shift 使用滚轮时，也可以平滑横向滚动长代码行。 `smoothScroll` 默认覆盖代码区的纵横滚动和头部 Shift + 滚轮的横向转发，设为 `false` 即可关闭平滑处理。

行号从 1 开始，区间包含首尾；0、负数、小数、反向区间不会高亮。高亮并不改变原始字符串，复制内容仍是原始 code，不包含行号。

::code-block-highlight-example
::

:::

:::section{id="wrap-readonly" class="doc-section"}
## 换行和只读片段

打开 `wrap` 后，长行会在容器内换行，同时保留缩进。只读展示场景可以关闭行号和复制按钮，让代码块更像一段嵌入式说明。

::code-block-wrap-example
::

:::

:::section{id="resizable" class="doc-section"}
## 可调整尺寸

设置 `resizable` 后，组件会用 BingResizable 包裹代码块。这个模式适合在线示例、代码预览器、playground 这类需要用户临时改变可视区域的场景。

::code-block-resizable-example
::

:::

:::section{id="tokens" class="doc-section"}
## 在编辑器中复用高亮

0.14.0 新增包根公开 API：`getCodeLanguages`、`normalizeCodeLanguage`、`resolveCodeTheme` 和 `highlightCode`。业务可把逐行 token 映射为编辑器的装饰，不需要复制内部 Shiki 配置，也不必把高亮写入正文数据。

`getCodeLanguages()` 返回 12 种支持语言的独立副本，不含纯文本；按需添加 `{ value: 'text', label: '纯文本' }`。`normalizeCodeLanguage` 处理大小写、首尾空白和 js/ts/bash/sh/md/yml 等别名；空值归一为 text，未知标识保留为小写，不自动检测语言。

`highlightCode(code, language, theme)` 返回 Promise，行号从 1 开始，token 的 content 为原始文本，color 和 fontStyle 可选。纯文本不加载 Shiki，未知语言在加载前拒绝；语法、主题或网络加载失败同样拒绝，由调用方保留原文。行间换行不包含在 token 中；映射编辑器位置时应以原文的 UTF-16 偏移计算，并校验还原结果，特别是 CRLF。

`resolveCodeTheme('auto', mode)` 与组件共用亮色 vitesse-light、暗色 github-dark；可传 light/dark/system，省略时读取当前 Bing UI 主题。SSR 默认亮色。该函数只解析当前值，不自动监听变化；调用方负责在主题变化时重算。

读取语言元数据、规范化别名和解析主题不会加载 Shiki；实际高亮才按需加载核心、当前语言和主题，并复用模块缓存。Markdown 围栏需要加载内置嵌入语法。Token API 不提供正文缓存、防抖或可见性检测，编辑器应自行处理过期请求、IME 组词、超长内容和视口调度。

::code-block-tokens-example
::

::docs-api-table{name="highlightApi"}
::

::docs-api-table{name="highlightTypes"}
::

:::

:::section{id="props" class="doc-section"}
## 属性

::docs-api-table{name="props"}
::

:::

:::section{id="resizable-options" class="doc-section"}
## BingCodeBlockResizableOptions

::docs-api-table{name="resizable"}
::

:::

:::section{id="events" class="doc-section"}
## 事件

copy 接收 `{ code, language }` 对象。优先使用 Clipboard API；API 不存在时才尝试 textarea 兼容复制，API 拒绝时直接发出 copyError，不继续走兼容分支。业务可在错误事件中显示失败反馈。

::docs-api-table{name="events"}
::

:::

::::
