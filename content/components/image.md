::::article{class="doc-page image-doc"}
<p class="doc-eyebrow">组件</p>

# BingImage {#overview}

BingImage 是图片展示组件，在原生 `img` 基础上补齐加载反馈、占位图、失败回退、错误态、尺寸比例、圆角、预览和事件。它适合组件文档、商品图、头像以外的内容图和图库入口。

独立使用需导入 `BingImage` 和 `@moubing/bing-ui/style.css`。五个示例自带 SVG 图片生成函数；故障示例使用故意损坏的图片数据，无需准备额外文件或访问图片服务。

:::section{id="playground" class="doc-section"}
## 基础配置

用 `width`、`height` 或 `aspectRatio` 固定布局空间，再通过 `fit`、`position`、`radius` 控制图片裁剪方式。

组件内部管理加载状态，没有加载状态的 v-model 或公开实例方法。使用 load、error 和 `@status-change` 读取反馈。width/height 的 number 会转为 px，CSS 字符串按原值使用；给像素尺寸时优先传 number 或带单位字符串。

::image-basic-example
::

:::

:::section{id="fallback" class="doc-section"}
## 占位与回退

主图失败后，组件先发送 `error({ isFallback: false })`，再尝试一次与当前地址不同的 fallbackSrc，并移除 srcset/sizes。回退成功进入 loaded；回退也失败则再发 `error({ isFallback: true })`，最终进入 error，不会无限循环。

statusChange 仅在状态名称改变时发送，因此主图 loading 切到回退图 loading 不会再次发送 loading。初始 src 为空时保持 idle，也不会产生初次 idle 通知；空主图不会主动加载回退图。仅修改 fallbackSrc 不自动重试，需改变 src 或使用错误插槽的 retry。

placeholderSrc 在未 loaded 时可显示，包括 idle 和最终 error；placeholder 插槽在 loading 时也可替代默认骨架。showLoading/showError 控制整个对应层，也会隐藏自定义插槽，但不会取消加载或改变事件。加载层和占位层为 aria-hidden，需播报进度时可像示例一样在外部通过 statusChange 提供状态文本。

::image-fallback-example
::

:::

:::section{id="fit-ratio" class="doc-section"}
## 裁剪与比例

列表和网格里推荐优先给 `aspectRatio`，这样图片加载前后都不会挤压布局。`cover` 适合封面，`contain` 适合完整展示，`position` 用来控制裁切焦点。

::image-crop-example
::

:::

:::section{id="preview" class="doc-section"}
## 预览图库

开启 `preview` 后，图片加载成功才会变成可点击的预览入口。传入 `previewItems` 可以把多张图片串成同一个预览图库。

入口是带 role=button、tabindex=0 的 figure，支持点击、Enter 和空格；并非原生 button。默认预览名称固定为 预览图片，示例为每张图设置独立的 previewAriaLabel，避免仅凭 alt 假定按钮已有不同名称。

非空 previewItems 优先作为整个图库，previewInitialIndex 需要由业务按缩略图索引传入。单图模式才从当前图和 previewSrc、previewDownloadUrl、previewDownloadName 生成预览项；使用图库时这些信息应写在各项中。只有缩略图本身 loaded 才可打开预览，即使 previewSrc 已设置也一样。

previewOpen 的 src 为 previewSrc 或当前图片地址，不一定是传入图库的当前项，也不持续报告左右切换。BingImage 没有暴露预览 v-model；如需外部开关、当前索引或更多预览配置，直接使用 [BingImagePreview](/docs/components/image-preview)。当前禁用 preview 会卸载内置预览，但保留内部打开标记，重新启用可能再次显示；修改 src 也不等同关闭预览。

文档站在 KeepAlive 页面停用时卸载预览实例，避免 Teleport 图库与滚动锁留在隐藏页面。不要把多张缩略图都配置为独立的、同时打开的弹窗。

::image-preview-example
::

:::

:::section{id="slots-events" class="doc-section"}
## 插槽与事件

默认加载态和错误态已经可用；如果业务页面需要更明确的文案或动作，可以使用 `loading`、`placeholder` 和 `error` 插槽。

retry() 重建 img，从主图开始再尝试一次回退流程，不保证绕过浏览器缓存。下面的数据故意损坏，重复 retry 仍然失败；“使用有效图片”改变 src 后恢复 loaded，与重试同一地址是两件事。

::image-slots-example
::

### 插槽 {#slots}

::docs-api-table{name="slots"}
::

### 事件 {#events}

::docs-api-table{name="events"}
::

:::

:::section{id="props" class="doc-section"}
## 属性

::docs-api-table{name="props"}
::

:::

:::section{id="api-types" class="doc-section"}
## 公开类型与事件载荷

以下类型都从 `@moubing/bing-ui` 根入口导入，无需依赖包内路径。

::docs-api-table{name="types"}
::

### 事件载荷 {#payloads}

::docs-api-table{name="payloads"}
::

### BingImagePreviewItem {#preview-item}

::docs-api-table{name="previewItem"}
::

:::

::::
