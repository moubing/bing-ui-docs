::::article{class="doc-page"}
<p class="doc-eyebrow">组件</p>

# BingFilePreview {#overview}

BingFilePreview 是统一文件预览弹层。它可以展示图片、PDF、文本、JSON、CSV 和 Office 文件状态；图片交给 BingImagePreview，PDF 和转换后的 Office 通过 iframe 渲染，文本类内容可以直接使用 content 或从 src 加载。

:::section{id="basic" class="doc-section"}
## 文件类型预览

`file` 可以集中传入文件信息，也可以拆成 `src`、`name`、`type`、`content` 等 props。当 `type` 为 `auto` 时，组件会根据 MIME、文件名或地址后缀推断类型。

有 file 时，src 和 name 只来自对象，不从独立 props 补齐；其余六个字段按 `file.field ?? prop` 合并，空字符串仍算已提供。因此 file.type 优先于独立 type。没有 file 时，需要非空 src 或 content 才会建立文件对象；只有 previewSrc 或空 content 不够，可用 `{ content: '', type: 'text' }` 明确表示空文本。

显式类型优先。auto 按 image MIME、PDF、JSON、CSV、文本、docx、xlsx、pptx 的规则依次识别，再回退 unknown。不会根据 jpg/png 等图片后缀识别图片，应传 `type: 'image'` 或 image/* MIME；也不读取文件头或响应头鉴别内容。文件名后缀优先于源地址后缀，previewSrc 不参与推断。

六个网页样例全部内置：文本/JSON/CSV 使用 content，一页 PDF 和最小 DOCX 使用完整 data URL，转换示例使用可信的静态 HTML。独立示例通过 options.sample 选择样例，不需要补建 /mock-files；样例文件仅含演示文字。

::file-preview-basic-example
::

:::

:::section{id="text-csv-limits" class="doc-section"}
## 文本与 CSV 限制

文本、JSON、CSV 都会在组件内部用 BingScrollbar 包裹。文件阅读面板使用固定浅色纸面，深色主题下也保持白底，外围遮罩跟随主题磨砂参数。通过`textMaxLength`、`csvMaxRows` 和`csvMaxColumns` 可以控制渲染量，避免在大文件里一次性塞太多 DOM。 `smoothScroll` 只作用于 text、json 和 csv 内容；CSV 由同一个 BingScrollbar 负责水平与垂直滚动，设为 `false` 可关闭平滑处理。

文本优先使用 content，包括空字符串；未提供时才 fetch src，先完整读取响应再截断，不支持流式读取或网络大小限制。切换文件或关闭会忽略过期响应，但不使用 AbortController 取消网络请求。只有当前请求的网络/HTTP 失败发出 error，没有地址的错误提示不发出该事件。

textMaxLength 在打开、类型/src/content 变化导致重新读取时应用；仅在已打开时改限制不会重新截断。JSON 先截断再尝试格式化，无法解析时显示原文本并按配置高亮，不报告 JSON 校验错误。高亮输出会转义 HTML，jsonHighlightMaxLength 比较格式化后的长度；格式化可能令最终显示长度超过原截断阈值。

CSV 按逗号解析，支持引号内换行、逗号和双引号转义，过滤全空行。第一行是表头，csvMaxRows 包含表头，因此 3 行最多显示 2 条数据。空表头显示“第 N 列”，不补齐短行，不执行单元格公式。行列限制不是分页或网络限制，建议传正整数。

下面控制区明确同步 file.type，避免被原文件类型覆盖。选择 PDF、Office 或 unknown 会展示相应分支；文本和 CSV 限制只对文本类分支生效。

::file-preview-limits-example
::

:::

:::section{id="office-preview" class="doc-section"}
## Office 预览策略

Office 未配置 previewSrc 时显示需要转换的提示，提供非空 previewSrc 后使用 iframe。PDF 使用 previewSrc 或 src。unknown 即使提供 previewSrc 仍显示不支持，可以显式设为 pdf 或对应 Office 类型。text/html 或 html 文件名默认走文本分支，以文本显示而不执行 HTML。

iframe 没有 sandbox 或自定义安全策略入口，组件不清洗转换网页；只能传可信转换结果，由应用控制地址及访问权限。组件不上传 Office 文件，也不会自行接入第三方在线转换。PDF/iframe 是否可显示取决于浏览器及目标响应，不会通过 FilePreview.error 报告失败。

::file-preview-office-example
::

:::

:::section{id="nested-preview" class="doc-section"}
## 弹窗中的附件预览

Dialog 中分别打开文本和图片预览。Tab 留在最上层预览，Escape 逐层退出；关闭子预览后焦点回到对应入口，父弹窗继续锁定页面滚动。示例停用时关闭全部浮层。

::file-preview-nested-example
::

:::

:::section{id="events-lifecycle" class="doc-section"}
## 关闭、文件操作与生命周期

非图片分支关闭依次发送模型 false 与 close(reason)。父组件必须接收更新；业务直接设置 false 不发送 close。Tab 在当前模态层及其子浮层中循环，关闭后尝试恢复仍在文档中的先前焦点；组件不为背景设置 inert。iframe 内的键盘事件不冒泡到父窗口，必要时使用面板关闭按钮。

下载地址依次取 downloadUrl、src、previewSrc，外部打开优先 previewSrc、再 src。content 不自动变成文件，需要自行提供下载地址。download/openExternal 只报告即将发起的原生动作，不能取消，也不表示成功。payload.file 是合并对象，界面从 src 推断的标题不会写回 name。

图片分支委托 BingImagePreview，只转发图片、下载开关、层级、滚动/关闭及玻璃参数；width、height、teleportTo、ariaLabel、openable 和文本选项不转发。图片下载不发出 FilePreview.download，图片失败也不发出 FilePreview.error。关闭按钮和 Escape 均会发送两次模型 false、一次 close；Escape 由浮层管理器统一处理，不再被两层键盘监听重复关闭。处理函数应幂等；需要 ImagePreview 的完整 API 时直接使用该组件。

多个预览与 Dialog 共享浮层顺序、焦点和滚动锁，Escape 只处理最上层；最后一个锁持有者关闭后才恢复页面滚动。lockScroll 在打开时应用，打开期间更改不会立即重置。

跨图片/非图片类型切换前仍应先关闭。0.6.0 在打开期间从非图片切到图片后，关闭图片不会释放原非图片分支的锁，直到 FilePreview 卸载才释放。卸载清理监听、计时器和本实例滚动锁，不发送 close，并尝试恢复仍存在的焦点；本页缓存停用时会关闭并卸载预览。

组件没有公开插槽和实例方法，也没有可取消下载、JSON 校验、Office 转换或自定义 iframe sandbox 属性。

:::

:::section{id="props" class="doc-section"}
## 属性

::docs-api-table{name="props"}
::

:::

:::section{id="file-shape" class="doc-section"}
## 文件对象结构

::docs-api-table{name="file"}
::

:::

:::section{id="events" class="doc-section"}
## 事件

::docs-api-table{name="events"}
::

:::

:::section{id="api-types" class="doc-section"}
## 公开类型

::docs-api-table{name="types"}
::

### 平滑滚动选项 {#smooth-options}

::docs-api-table{name="smooth"}
::

:::

::::
