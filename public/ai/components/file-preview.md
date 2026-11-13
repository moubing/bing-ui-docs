# BingFilePreview

> 目标组件包：@moubing/bing-ui 0.19.0；文档修订：r3。
> 已验证：已完成 0.19.0 的文档与示例验证。

此文件由正文、API 数据和完整示例自动生成，可直接阅读，不需要启动文档站。修改源文件后运行 pnpm docs:export file-preview；请勿手工修改生成结果。

运行示例需要已配置 Vue 3 单文件组件的项目，依赖 Vue 3.5 与 GSAP 3.15 系列，导入 zod 的示例另需安装 Zod 4（Bing UI 的可选 peer 依赖）；Bing UI 使用上方标注的版本。示例已导入组件和样式，不依赖 Nuxt 别名、文档站组件或组件自动注册。四个 Vue 代码块是独立示例，分别保存为一个 .vue 文件使用。TypeScript 项目需配置 CSS 导入类型声明，例如 Vite 项目的 vite/client。

options 是演示配置。文本、JSON、CSV、PDF、DOCX 和静态转换页面全部内置，没有缺失的示例文件。file.type 优先于独立 type；文本截断不限制网络读取量。下载和外部打开使用原生浏览器动作，事件不代表成功。

BingFilePreview 是统一文件预览弹层。它可以展示图片、PDF、文本、JSON、CSV 和 Office 文件状态；图片交给 BingImagePreview，PDF 和转换后的 Office 通过 iframe 渲染，文本类内容可以直接使用 content 或从 src 加载。

## 文件类型预览

`file` 可以集中传入文件信息，也可以拆成 `src`、`name`、`type`、`content` 等 props。当 `type` 为 `auto` 时，组件会根据 MIME、文件名或地址后缀推断类型。

有 file 时，src 和 name 只来自对象，不从独立 props 补齐；其余六个字段按 `file.field ?? prop` 合并，空字符串仍算已提供。因此 file.type 优先于独立 type。没有 file 时，需要非空 src 或 content 才会建立文件对象；只有 previewSrc 或空 content 不够，可用 `{ content: '', type: 'text' }` 明确表示空文本。

显式类型优先。auto 按 image MIME、PDF、JSON、CSV、文本、docx、xlsx、pptx 的规则依次识别，再回退 unknown。不会根据 jpg/png 等图片后缀识别图片，应传 `type: 'image'` 或 image/\* MIME；也不读取文件头或响应头鉴别内容。文件名后缀优先于源地址后缀，previewSrc 不参与推断。

六个网页样例全部内置：文本/JSON/CSV 使用 content，一页 PDF 和最小 DOCX 使用完整 data URL，转换示例使用可信的静态 HTML。独立示例通过 options.sample 选择样例，不需要补建 /mock-files；样例文件仅含演示文字。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingFilePreview, type BingFilePreviewFile, type BingFilePreviewProps, type BingFilePreviewCloseReason, type BingFilePreviewDownloadPayload, type BingFilePreviewOpenExternalPayload } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

type SampleKey = 'text' | 'json' | 'csv' | 'pdf' | 'docx' | 'converted'

// 内置一页 PDF 和一个最小 DOCX，均含示例文字，没有外部文件依赖。
const pdfDataUrl = 'data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFIgPj4KZW5kb2JqCjIgMCBvYmoKPDwgL1R5cGUgL1BhZ2VzIC9LaWRzIFszIDAgUl0gL0NvdW50IDEgPj4KZW5kb2JqCjMgMCBvYmoKPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvTWVkaWFCb3ggWzAgMCA1OTUgODQyXSAvUmVzb3VyY2VzIDw8IC9Gb250IDw8IC9GMSA0IDAgUiA+PiA+PiAvQ29udGVudHMgNSAwIFIgPj4KZW5kb2JqCjQgMCBvYmoKPDwgL1R5cGUgL0ZvbnQgL1N1YnR5cGUgL1R5cGUxIC9CYXNlRm9udCAvSGVsdmV0aWNhID4+CmVuZG9iago1IDAgb2JqCjw8IC9MZW5ndGggNTUgPj4Kc3RyZWFtCkJUIC9GMSAyNCBUZiA1NCA3NDAgVGQgKEJpbmcgVUkgRmlsZVByZXZpZXcgZGVtbykgVGogRVQKZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgNgowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMDkgMDAwMDAgbiAKMDAwMDAwMDA1OCAwMDAwMCBuIAowMDAwMDAwMTE1IDAwMDAwIG4gCjAwMDAwMDAyNDEgMDAwMDAgbiAKMDAwMDAwMDMxMSAwMDAwMCBuIAp0cmFpbGVyCjw8IC9TaXplIDYgL1Jvb3QgMSAwIFIgPj4Kc3RhcnR4cmVmCjQxNgolJUVPRgo='
const docxDataUrl = 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,UEsDBBQAAAAIAAAAAADMVIwQ4QAAAJwBAAATAAAAW0NvbnRlbnRfVHlwZXNdLnhtbH2QTU7DMBCFr2J5i2KHLhBCSbqAsgQW5QCWM0ks7BnLMw3h9iht6QIV1u/ne3rNdklRzVA4ELb61tRaAXrqA46tft8/V/d62zX7rwyslhSRWz2J5Adr2U+QHBvKgEuKA5XkhA2V0WbnP9wIdlPXd9YTCqBUsnbornmCwR2iqN0igCdsgchaPZ6MK6vVLucYvJNAaGfsf1GqM8EUiEcPTyHzzZKitlcJq/I34Jx7naGU0IN6c0VeXIJW208qve3JHxKgmP9rruykYQgeLvm1LRfywBxwTNFclOQC/uy3x7u7b1BLAwQUAAAACAAAAAAANlfe3KQAAAAYAQAACwAAAF9yZWxzLy5yZWxzjc+xCsIwFAXQXwlvN2kdRKRpFxG6Sv2AkLy2wSQvJFHr37s4WHFwvVzO5Tbd4h27Y8qWgoSaV8AwaDI2TBIuw2mzh65tzuhUsRTybGNmi3chS5hLiQchsp7Rq8wpYli8Gyl5VTKnNImo9FVNKLZVtRPp04C1yXojIfWmBjY8I/5j0zhajUfSN4+h/Jj4agAbVJqwSHhQMsK8Y754B6JtxOpi+wJQSwMEFAAAAAgAAAAAACWsqF6mAAAA2wAAABEAAAB3b3JkL2RvY3VtZW50LnhtbEWOwQrCMBBEfyXkblM9iJS2goeCNw/2A2qytoHsbtlEW/9eUg9e3sAMM0x9XjGoN0j0TI3eF6VWQJadp7HR/b3bnfS5rZfKsX0hUFIrBorV0ugppbkyJtoJcIgFz0ArhicLDikWLKNZWNwsbCFGTyMGcyjLo8HBk86TD3afrHOGZKT24mlU/VV1PsBN4O1hUQ6Qa5PTTNm4dSLYdBOzGb8x8z/afgFQSwECFAAUAAAACAAAAAAAzFSMEOEAAACcAQAAEwAAAAAAAAAAAAAAAAAAAAAAW0NvbnRlbnRfVHlwZXNdLnhtbFBLAQIUABQAAAAIAAAAAAA2V97cpAAAABgBAAALAAAAAAAAAAAAAAAAABIBAABfcmVscy8ucmVsc1BLAQIUABQAAAAIAAAAAAAlrKhepgAAANsAAAARAAAAAAAAAAAAAAAAAN8BAAB3b3JkL2RvY3VtZW50LnhtbFBLBQYAAAAAAwADALkAAAC0AgAAAAA='

const releaseNotes = `# Bing UI 发布记录

- 新增 FilePreview 统一预览入口
- 文本、JSON、CSV 可以直接通过 content 渲染
- PDF 和转换后的 Office 文件使用浏览器可渲染地址
- 原始 Office 文件默认不会被发送给第三方在线查看器`

const jsonContent = JSON.stringify(
  {
    component: 'BingFilePreview',
    status: 'stable',
    previewKinds: ['text', 'json', 'csv', 'pdf', 'docx', 'xlsx', 'pptx'],
    options: {
      lockScroll: true,
      closeOnEsc: true,
      jsonHighlight: true,
    },
  },
  null,
  2,
)

const csvContent = `name,type,status,size
Button,component,done,12 KB
Select,component,done,24 KB
DropDown,component,review,31 KB
FilePreview,component,draft,28 KB
Table,component,todo,36 KB`

const convertedHtml = `data:text/html;charset=utf-8,${encodeURIComponent(`
<!doctype html>
<html lang="zh-CN">
  <body style="margin:0;font-family:system-ui;padding:32px;background:#fff8fb;color:#172033;">
    <h1>组件交付说明</h1>
    <p>这是一个由服务端转换后的 Office 预览页面，可信内容可传给 previewSrc。</p>
    <ul>
      <li>原始 docx 仍然只用于下载或外部打开。</li>
      <li>预览内容由浏览器 iframe 渲染。</li>
      <li>FilePreview 不会主动调用第三方在线查看器。</li>
    </ul>
  </body>
</html>
`)}`

const sampleFiles: Record<SampleKey, BingFilePreviewFile> = {
  text: {
    name: 'release-notes.md',
    type: 'text',
    content: releaseNotes,
    downloadUrl: toTextDataUrl(releaseNotes, 'text/markdown'),
    size: 1860,
  },
  json: {
    name: 'component.config.json',
    type: 'json',
    content: jsonContent,
    downloadUrl: toTextDataUrl(jsonContent, 'application/json'),
    size: 2480,
  },
  csv: {
    name: 'component-status.csv',
    type: 'csv',
    content: csvContent,
    downloadUrl: toTextDataUrl(csvContent, 'text/csv'),
    size: 980,
  },
  pdf: {
    name: 'contract-preview.pdf',
    type: 'pdf',
    src: pdfDataUrl,
    downloadUrl: pdfDataUrl,
    size: 599,
  },
  docx: {
    name: 'handoff.docx',
    type: 'docx',
    src: docxDataUrl,
    size: 899,
  },
  converted: {
    name: 'handoff.docx',
    type: 'docx',
    src: docxDataUrl,
    previewSrc: convertedHtml,
    downloadUrl: docxDataUrl,
    size: 899,
  },
}

function toTextDataUrl(content: string, mime: string) {
  return `data:${mime};charset=utf-8,${encodeURIComponent(content)}`
}

type ExampleOptions = BingFilePreviewProps & { sample: SampleKey }
const options: ExampleOptions = {
  "sample": "json",
  "width": "min(980px, calc(100vw - 36px))",
  "height": "min(680px, calc(100vh - 36px))",
  "lockScroll": true,
  "closeOnEsc": true,
  "closeOnOverlay": true,
  "downloadable": true,
  "openable": true,
  "jsonHighlight": true
}
const { sample, ...previewProps } = options
const file = sampleFiles[sample]
const open = ref(false)
const feedback = ref('等待打开文件预览')
function closed(reason: BingFilePreviewCloseReason) { feedback.value = '关闭：' + reason }
function downloaded(payload: BingFilePreviewDownloadPayload) { feedback.value = '下载：' + payload.file.name + ' (' + payload.kind + ')' }
function opened(payload: BingFilePreviewOpenExternalPayload) { feedback.value = '新标签页打开：' + payload.file.name + ' (' + payload.kind + ')' }
</script>

<template>
  <p>{{ file.name }} · {{ file.type }}</p>
  <BingButton :throttle="false" @click="open = true">打开预览</BingButton>
  <p role="status">{{ feedback }}</p>
  <BingFilePreview v-model="open" :file="file" v-bind="previewProps" ariaLabel="文件预览" @close="closed" @download="downloaded" @open-external="opened" @error="feedback = '加载失败：' + $event.message" />
</template>
```

## 文本与 CSV 限制

文本、JSON、CSV 都会在组件内部用 BingScrollbar 包裹。文件阅读面板使用固定浅色纸面，深色主题下也保持白底，外围遮罩跟随主题磨砂参数。通过`textMaxLength`、`csvMaxRows` 和`csvMaxColumns` 可以控制渲染量，避免在大文件里一次性塞太多 DOM。 `smoothScroll` 只作用于 text、json 和 csv 内容；CSV 由同一个 BingScrollbar 负责水平与垂直滚动，设为 `false` 可关闭平滑处理。

文本优先使用 content，包括空字符串；未提供时才 fetch src，先完整读取响应再截断，不支持流式读取或网络大小限制。切换文件或关闭会忽略过期响应，但不使用 AbortController 取消网络请求。只有当前请求的网络/HTTP 失败发出 error，没有地址的错误提示不发出该事件。

textMaxLength 在打开、类型/src/content 变化导致重新读取时应用；仅在已打开时改限制不会重新截断。JSON 先截断再尝试格式化，无法解析时显示原文本并按配置高亮，不报告 JSON 校验错误。高亮输出会转义 HTML，jsonHighlightMaxLength 比较格式化后的长度；格式化可能令最终显示长度超过原截断阈值。

CSV 按逗号解析，支持引号内换行、逗号和双引号转义，过滤全空行。第一行是表头，csvMaxRows 包含表头，因此 3 行最多显示 2 条数据。空表头显示“第 N 列”，不补齐短行，不执行单元格公式。行列限制不是分页或网络限制，建议传正整数。

下面控制区明确同步 file.type，避免被原文件类型覆盖。选择 PDF、Office 或 unknown 会展示相应分支；文本和 CSV 限制只对文本类分支生效。

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import { BingButton, BingFilePreview, type BingFilePreviewFile, type BingFilePreviewProps, type BingFilePreviewCloseReason, type BingFilePreviewDownloadPayload, type BingFilePreviewOpenExternalPayload } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

type SampleKey = 'text' | 'json' | 'csv' | 'pdf' | 'docx' | 'converted'

// 内置一页 PDF 和一个最小 DOCX，均含示例文字，没有外部文件依赖。
const pdfDataUrl = 'data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFIgPj4KZW5kb2JqCjIgMCBvYmoKPDwgL1R5cGUgL1BhZ2VzIC9LaWRzIFszIDAgUl0gL0NvdW50IDEgPj4KZW5kb2JqCjMgMCBvYmoKPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvTWVkaWFCb3ggWzAgMCA1OTUgODQyXSAvUmVzb3VyY2VzIDw8IC9Gb250IDw8IC9GMSA0IDAgUiA+PiA+PiAvQ29udGVudHMgNSAwIFIgPj4KZW5kb2JqCjQgMCBvYmoKPDwgL1R5cGUgL0ZvbnQgL1N1YnR5cGUgL1R5cGUxIC9CYXNlRm9udCAvSGVsdmV0aWNhID4+CmVuZG9iago1IDAgb2JqCjw8IC9MZW5ndGggNTUgPj4Kc3RyZWFtCkJUIC9GMSAyNCBUZiA1NCA3NDAgVGQgKEJpbmcgVUkgRmlsZVByZXZpZXcgZGVtbykgVGogRVQKZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgNgowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMDkgMDAwMDAgbiAKMDAwMDAwMDA1OCAwMDAwMCBuIAowMDAwMDAwMTE1IDAwMDAwIG4gCjAwMDAwMDAyNDEgMDAwMDAgbiAKMDAwMDAwMDMxMSAwMDAwMCBuIAp0cmFpbGVyCjw8IC9TaXplIDYgL1Jvb3QgMSAwIFIgPj4Kc3RhcnR4cmVmCjQxNgolJUVPRgo='
const docxDataUrl = 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,UEsDBBQAAAAIAAAAAADMVIwQ4QAAAJwBAAATAAAAW0NvbnRlbnRfVHlwZXNdLnhtbH2QTU7DMBCFr2J5i2KHLhBCSbqAsgQW5QCWM0ks7BnLMw3h9iht6QIV1u/ne3rNdklRzVA4ELb61tRaAXrqA46tft8/V/d62zX7rwyslhSRWz2J5Adr2U+QHBvKgEuKA5XkhA2V0WbnP9wIdlPXd9YTCqBUsnbornmCwR2iqN0igCdsgchaPZ6MK6vVLucYvJNAaGfsf1GqM8EUiEcPTyHzzZKitlcJq/I34Jx7naGU0IN6c0VeXIJW208qve3JHxKgmP9rruykYQgeLvm1LRfywBxwTNFclOQC/uy3x7u7b1BLAwQUAAAACAAAAAAANlfe3KQAAAAYAQAACwAAAF9yZWxzLy5yZWxzjc+xCsIwFAXQXwlvN2kdRKRpFxG6Sv2AkLy2wSQvJFHr37s4WHFwvVzO5Tbd4h27Y8qWgoSaV8AwaDI2TBIuw2mzh65tzuhUsRTybGNmi3chS5hLiQchsp7Rq8wpYli8Gyl5VTKnNImo9FVNKLZVtRPp04C1yXojIfWmBjY8I/5j0zhajUfSN4+h/Jj4agAbVJqwSHhQMsK8Y754B6JtxOpi+wJQSwMEFAAAAAgAAAAAACWsqF6mAAAA2wAAABEAAAB3b3JkL2RvY3VtZW50LnhtbEWOwQrCMBBEfyXkblM9iJS2goeCNw/2A2qytoHsbtlEW/9eUg9e3sAMM0x9XjGoN0j0TI3eF6VWQJadp7HR/b3bnfS5rZfKsX0hUFIrBorV0ugppbkyJtoJcIgFz0ArhicLDikWLKNZWNwsbCFGTyMGcyjLo8HBk86TD3afrHOGZKT24mlU/VV1PsBN4O1hUQ6Qa5PTTNm4dSLYdBOzGb8x8z/afgFQSwECFAAUAAAACAAAAAAAzFSMEOEAAACcAQAAEwAAAAAAAAAAAAAAAAAAAAAAW0NvbnRlbnRfVHlwZXNdLnhtbFBLAQIUABQAAAAIAAAAAAA2V97cpAAAABgBAAALAAAAAAAAAAAAAAAAABIBAABfcmVscy8ucmVsc1BLAQIUABQAAAAIAAAAAAAlrKhepgAAANsAAAARAAAAAAAAAAAAAAAAAN8BAAB3b3JkL2RvY3VtZW50LnhtbFBLBQYAAAAAAwADALkAAAC0AgAAAAA='

const releaseNotes = `# Bing UI 发布记录

- 新增 FilePreview 统一预览入口
- 文本、JSON、CSV 可以直接通过 content 渲染
- PDF 和转换后的 Office 文件使用浏览器可渲染地址
- 原始 Office 文件默认不会被发送给第三方在线查看器`

const jsonContent = JSON.stringify(
  {
    component: 'BingFilePreview',
    status: 'stable',
    previewKinds: ['text', 'json', 'csv', 'pdf', 'docx', 'xlsx', 'pptx'],
    options: {
      lockScroll: true,
      closeOnEsc: true,
      jsonHighlight: true,
    },
  },
  null,
  2,
)

const csvContent = `name,type,status,size
Button,component,done,12 KB
Select,component,done,24 KB
DropDown,component,review,31 KB
FilePreview,component,draft,28 KB
Table,component,todo,36 KB`

const convertedHtml = `data:text/html;charset=utf-8,${encodeURIComponent(`
<!doctype html>
<html lang="zh-CN">
  <body style="margin:0;font-family:system-ui;padding:32px;background:#fff8fb;color:#172033;">
    <h1>组件交付说明</h1>
    <p>这是一个由服务端转换后的 Office 预览页面，可信内容可传给 previewSrc。</p>
    <ul>
      <li>原始 docx 仍然只用于下载或外部打开。</li>
      <li>预览内容由浏览器 iframe 渲染。</li>
      <li>FilePreview 不会主动调用第三方在线查看器。</li>
    </ul>
  </body>
</html>
`)}`

const sampleFiles: Record<SampleKey, BingFilePreviewFile> = {
  text: {
    name: 'release-notes.md',
    type: 'text',
    content: releaseNotes,
    downloadUrl: toTextDataUrl(releaseNotes, 'text/markdown'),
    size: 1860,
  },
  json: {
    name: 'component.config.json',
    type: 'json',
    content: jsonContent,
    downloadUrl: toTextDataUrl(jsonContent, 'application/json'),
    size: 2480,
  },
  csv: {
    name: 'component-status.csv',
    type: 'csv',
    content: csvContent,
    downloadUrl: toTextDataUrl(csvContent, 'text/csv'),
    size: 980,
  },
  pdf: {
    name: 'contract-preview.pdf',
    type: 'pdf',
    src: pdfDataUrl,
    downloadUrl: pdfDataUrl,
    size: 599,
  },
  docx: {
    name: 'handoff.docx',
    type: 'docx',
    src: docxDataUrl,
    size: 899,
  },
  converted: {
    name: 'handoff.docx',
    type: 'docx',
    src: docxDataUrl,
    previewSrc: convertedHtml,
    downloadUrl: docxDataUrl,
    size: 899,
  },
}

function toTextDataUrl(content: string, mime: string) {
  return `data:${mime};charset=utf-8,${encodeURIComponent(content)}`
}

const options: BingFilePreviewProps = {
  "type": "csv",
  "textMaxLength": 120,
  "csvMaxRows": 3,
  "csvMaxColumns": 3
}
const open = ref(false)
const file = computed<BingFilePreviewFile>(() => {
  const kind = options.type
  const value = kind === 'text'
    ? { ...sampleFiles.text, content: [releaseNotes, releaseNotes, releaseNotes].join('\n\n') }
    : kind === 'json' ? sampleFiles.json
    : kind === 'pdf' ? sampleFiles.pdf
    : kind === 'docx' ? sampleFiles.docx
    : { ...sampleFiles.csv, content: csvContent + '\nInput,component,done,18 KB\nTextarea,component,done,21 KB\nTreeSelect,component,todo,42 KB' }
  return { ...value, type: kind }
})
</script>

<template>
  <BingButton :throttle="false" @click="open = true">打开限制示例</BingButton>
  <BingFilePreview v-model="open" :file="file" v-bind="options" width="min(900px, calc(100vw - 36px))" height="min(620px, calc(100vh - 36px))" ariaLabel="文本和 CSV 限制预览" />
</template>
```

## Office 预览策略

Office 未配置 previewSrc 时显示需要转换的提示，提供非空 previewSrc 后使用 iframe。PDF 使用 previewSrc 或 src。unknown 即使提供 previewSrc 仍显示不支持，可以显式设为 pdf 或对应 Office 类型。text/html 或 html 文件名默认走文本分支，以文本显示而不执行 HTML。

iframe 没有 sandbox 或自定义安全策略入口，组件不清洗转换网页；只能传可信转换结果，由应用控制地址及访问权限。组件不上传 Office 文件，也不会自行接入第三方在线转换。PDF/iframe 是否可显示取决于浏览器及目标响应，不会通过 FilePreview.error 报告失败。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingFilePreview, type BingFilePreviewFile } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const docxDataUrl = 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,UEsDBBQAAAAIAAAAAADMVIwQ4QAAAJwBAAATAAAAW0NvbnRlbnRfVHlwZXNdLnhtbH2QTU7DMBCFr2J5i2KHLhBCSbqAsgQW5QCWM0ks7BnLMw3h9iht6QIV1u/ne3rNdklRzVA4ELb61tRaAXrqA46tft8/V/d62zX7rwyslhSRWz2J5Adr2U+QHBvKgEuKA5XkhA2V0WbnP9wIdlPXd9YTCqBUsnbornmCwR2iqN0igCdsgchaPZ6MK6vVLucYvJNAaGfsf1GqM8EUiEcPTyHzzZKitlcJq/I34Jx7naGU0IN6c0VeXIJW208qve3JHxKgmP9rruykYQgeLvm1LRfywBxwTNFclOQC/uy3x7u7b1BLAwQUAAAACAAAAAAANlfe3KQAAAAYAQAACwAAAF9yZWxzLy5yZWxzjc+xCsIwFAXQXwlvN2kdRKRpFxG6Sv2AkLy2wSQvJFHr37s4WHFwvVzO5Tbd4h27Y8qWgoSaV8AwaDI2TBIuw2mzh65tzuhUsRTybGNmi3chS5hLiQchsp7Rq8wpYli8Gyl5VTKnNImo9FVNKLZVtRPp04C1yXojIfWmBjY8I/5j0zhajUfSN4+h/Jj4agAbVJqwSHhQMsK8Y754B6JtxOpi+wJQSwMEFAAAAAgAAAAAACWsqF6mAAAA2wAAABEAAAB3b3JkL2RvY3VtZW50LnhtbEWOwQrCMBBEfyXkblM9iJS2goeCNw/2A2qytoHsbtlEW/9eUg9e3sAMM0x9XjGoN0j0TI3eF6VWQJadp7HR/b3bnfS5rZfKsX0hUFIrBorV0ugppbkyJtoJcIgFz0ArhicLDikWLKNZWNwsbCFGTyMGcyjLo8HBk86TD3afrHOGZKT24mlU/VV1PsBN4O1hUQ6Qa5PTTNm4dSLYdBOzGb8x8z/afgFQSwECFAAUAAAACAAAAAAAzFSMEOEAAACcAQAAEwAAAAAAAAAAAAAAAAAAAAAAW0NvbnRlbnRfVHlwZXNdLnhtbFBLAQIUABQAAAAIAAAAAAA2V97cpAAAABgBAAALAAAAAAAAAAAAAAAAABIBAABfcmVscy8ucmVsc1BLAQIUABQAAAAIAAAAAAAlrKhepgAAANsAAAARAAAAAAAAAAAAAAAAAN8BAAB3b3JkL2RvY3VtZW50LnhtbFBLBQYAAAAAAwADALkAAAC0AgAAAAA='

const convertedHtml = `data:text/html;charset=utf-8,${encodeURIComponent(`
<!doctype html>
<html lang="zh-CN">
  <body style="margin:0;font-family:system-ui;padding:32px;background:#fff8fb;color:#172033;">
    <h1>组件交付说明</h1>
    <p>这是一个由服务端转换后的 Office 预览页面，可信内容可传给 previewSrc。</p>
    <ul>
      <li>原始 docx 仍然只用于下载或外部打开。</li>
      <li>预览内容由浏览器 iframe 渲染。</li>
      <li>FilePreview 不会主动调用第三方在线查看器。</li>
    </ul>
  </body>
</html>
`)}`

const originalOpen = ref(false)

const convertedOpen = ref(false)
const originalFile: BingFilePreviewFile = { name: 'handoff.docx', type: 'docx', src: docxDataUrl }
const convertedFile: BingFilePreviewFile = { ...originalFile, previewSrc: convertedHtml }
</script>

<template>
  <div class="actions">
    <BingButton :throttle="false" variant="secondary" @click="originalOpen = true">原始 DOCX</BingButton>
    <BingButton :throttle="false" @click="convertedOpen = true">已转换预览</BingButton>
  </div>
  <BingFilePreview v-model="originalOpen" :file="originalFile" ariaLabel="Office fallback 预览" />
  <BingFilePreview v-model="convertedOpen" :file="convertedFile" ariaLabel="Office 转换预览" />
</template>

<style scoped>
.actions { display: flex; flex-wrap: wrap; gap: 12px; }
</style>
```

## 弹窗中的附件预览

Dialog 中分别打开文本和图片预览。Tab 留在最上层预览，Escape 逐层退出；关闭子预览后焦点回到对应入口，父弹窗继续锁定页面滚动。示例停用时关闭全部浮层。

```vue
<script setup lang="ts">
import { onDeactivated, ref } from 'vue'
import { BingButton, BingDialog, BingFilePreview, BingImagePreview } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const open = ref(false)
const fileOpen = ref(false)
const imageOpen = ref(false)
const image = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><rect width="800" height="500" fill="#e4e4e7"/><circle cx="400" cy="250" r="120" fill="#71717a"/></svg>')
onDeactivated(() => { imageOpen.value = false; fileOpen.value = false; open.value = false })
</script>

<template>
  <BingButton @click="open = true">查看项目附件</BingButton>
  <BingDialog v-model="open" title="项目附件" :show-footer="false">
    <p>打开附件后按 Escape 返回此弹窗，再按一次关闭弹窗。</p>
    <div class="attachment-actions">
      <BingButton @click="fileOpen = true">预览说明文件</BingButton>
      <BingButton @click="imageOpen = true">预览示意图片</BingButton>
    </div>
    <BingFilePreview v-model="fileOpen" :file="{ name: '项目说明.txt', type: 'text', content: '关闭此预览后，焦点会回到项目附件中的打开按钮。' }" :downloadable="false" :openable="false" ariaLabel="项目说明预览" />
    <BingImagePreview v-model="imageOpen" :items="[{ src: image, alt: '项目示意图' }]" :downloadable="false" ariaLabel="项目图片预览" />
  </BingDialog>
</template>

<style scoped>
.attachment-actions { display: flex; flex-wrap: wrap; gap: 12px; }
</style>
```

## 关闭、文件操作与生命周期

非图片分支关闭依次发送模型 false 与 close(reason)。父组件必须接收更新；业务直接设置 false 不发送 close。Tab 在当前模态层及其子浮层中循环，关闭后尝试恢复仍在文档中的先前焦点；组件不为背景设置 inert。iframe 内的键盘事件不冒泡到父窗口，必要时使用面板关闭按钮。

下载地址依次取 downloadUrl、src、previewSrc，外部打开优先 previewSrc、再 src。content 不自动变成文件，需要自行提供下载地址。download/openExternal 只报告即将发起的原生动作，不能取消，也不表示成功。payload.file 是合并对象，界面从 src 推断的标题不会写回 name。

图片分支委托 BingImagePreview，只转发图片、下载开关、层级、滚动/关闭及玻璃参数；width、height、teleportTo、ariaLabel、openable 和文本选项不转发。图片下载不发出 FilePreview.download，图片失败也不发出 FilePreview.error。关闭按钮和 Escape 均会发送两次模型 false、一次 close；Escape 由浮层管理器统一处理，不再被两层键盘监听重复关闭。处理函数应幂等；需要 ImagePreview 的完整 API 时直接使用该组件。

多个预览与 Dialog 共享浮层顺序、焦点和滚动锁，Escape 只处理最上层；最后一个锁持有者关闭后才恢复页面滚动。lockScroll 在打开时应用，打开期间更改不会立即重置。

跨图片/非图片类型切换前仍应先关闭。0.6.0 在打开期间从非图片切到图片后，关闭图片不会释放原非图片分支的锁，直到 FilePreview 卸载才释放。卸载清理监听、计时器和本实例滚动锁，不发送 close，并尝试恢复仍存在的焦点；本页缓存停用时会关闭并卸载预览。

组件没有公开插槽和实例方法，也没有可取消下载、JSON 校验、Office 转换或自定义 iframe sandbox 属性。

## 属性

| 属性                       | 类型                      | 默认值                                 | 说明                                                           |
| ------------------------ | ----------------------- | ----------------------------------- | ------------------------------------------------------------ |
| `modelValue`             | `boolean`               | `false`                             | 控制预览弹层是否打开。                                                  |
| `file`                   | `BingFilePreviewFile`   | `undefined`                         | 有 file 时 src/name 只取对象；其余六字段按 file.field ?? prop 合并，空字符串优先。  |
| `src`                    | `string`                | `undefined`                         | 文件源地址。文本类文件没有 content 时会通过 fetch 读取 src。                     |
| `name`                   | `string`                | `undefined`                         | 没有 file 时的文件名；标题可回退到 src 最后一段或 未命名文件。                        |
| `type`                   | `BingFilePreviewKind`   | `'auto'`                            | file.type 优先。auto 按 MIME/后缀规则识别；图片需显式 image 或 image/\* MIME。 |
| `mimeType`               | `string`                | `undefined`                         | 用于 auto 推断的 MIME 类型。                                         |
| `previewSrc`             | `string`                | `undefined`                         | image/PDF/Office 的预览地址；文本类不 fetch 它，unknown 不渲染 iframe。      |
| `content`                | `string`                | `undefined`                         | text/json/csv 内联文本，空字符串也优先于 fetch；不会自动生成下载地址。                |
| `downloadUrl`            | `string`                | `undefined`                         | 下载地址；未传时回退到 src 或 previewSrc。                                |
| `size`                   | `number`                | `undefined`                         | 文件大小，单位字节。                                                   |
| `zIndex`                 | `number`                | `undefined（基准 + 300，默认 2300）`       | 预览层级；未传时使用 ConfigProvider 的 zIndex 基准加 300。                  |
| `width`                  | `string \| number`      | `'min(1120px, calc(100vw - 36px))'` | 面板宽度。                                                        |
| `height`                 | `string \| number`      | `'min(760px, calc(100vh - 36px))'`  | 面板高度。                                                        |
| `smoothScroll`           | `SmoothScrollValue`     | `true`                              | 传给文本类 BingScrollbar.smooth；false 保留原生滚动，配置字段见下表。             |
| `lockScroll`             | `boolean`               | `true`                              | 打开时锁定 body/html；打开期间改变不立即重新应用。                               |
| `closeOnEsc`             | `boolean`               | `true`                              | 按 Escape 是否关闭。                                               |
| `closeOnOverlay`         | `boolean`               | `true`                              | 点击遮罩是否关闭。                                                    |
| `downloadable`           | `boolean`               | `true`                              | 非图片分支有下载地址才显示；图片分支交给 ImagePreview。                           |
| `openable`               | `boolean`               | `true`                              | 非图片分支有 previewSrc 或 src 才显示外部打开；只有 downloadUrl 不显示。          |
| `jsonHighlight`          | `boolean`               | `true`                              | JSON 预览是否做 token 高亮。                                         |
| `jsonHighlightMaxLength` | `number`                | `3500000`                           | 按格式化后的长度判断，超限跳过高亮，仍显示转义后的预览文本。                               |
| `textMaxLength`          | `number`                | `240000`                            | 接收文本时先按字符串 length 截断，再格式化/解析；不是网络读取上限。                       |
| `csvMaxRows`             | `number`                | `80`                                | slice 限制解析后的行数，包含第一行表头；建议正整数，修改即时更新。                         |
| `csvMaxColumns`          | `number`                | `24`                                | slice 限制每行列数，建议正整数，不补齐短行。                                    |
| `teleportTo`             | `string \| HTMLElement` | `'body'`                            | 非图片分支目标，挂载时需存在；图片分支不转发。                                      |
| `ariaLabel`              | `string`                | `'文件预览'`                            | 非图片 dialog 名称；图片分支使用 ImagePreview 默认名称。                      |
| `glass`                  | `boolean`               | `true`                              | false 时设置 blur=0px、opacity=1、saturation=1。                   |
| `glassBlur`              | `string \| number`      | `undefined`                         | 默认继承主题 16px；显式数值/数值字符串转非负 px。                                |
| `glassOpacity`           | `number`                | `undefined`                         | 默认继承浅色 0.86 / 深色 0.92；显式值限制在 0 到 1，作用于遮罩底色。                  |
| `glassSaturation`        | `number`                | `undefined`                         | 默认继承主题 1.05；显式值最小 0。                                         |

## 文件对象结构

| 字段            | 类型                    | 说明                    |
| ------------- | --------------------- | --------------------- |
| `src`         | `string`              | 文件源地址。                |
| `name`        | `string`              | 显示文件名，也参与 auto 类型推断。  |
| `type`        | `BingFilePreviewKind` | 指定预览类型。               |
| `mimeType`    | `string`              | 用于 auto 类型推断。         |
| `previewSrc`  | `string`              | 转换后的预览地址，Office 文件常用。 |
| `content`     | `string`              | 内联文本、JSON 或 CSV 内容。   |
| `downloadUrl` | `string`              | 下载地址。                 |
| `size`        | `number`              | 文件大小，单位字节。            |

## 事件

| 事件                  | 参数                                            | 说明                                                 |
| ------------------- | --------------------------------------------- | -------------------------------------------------- |
| `update:modelValue` | `value: boolean`                              | 关闭请求发送 false；外部直接改模型不补发。图片分支可能重复请求。                |
| `close`             | `reason: BingFilePreviewCloseReason`          | 紧跟关闭模型请求，不表示动画完成。                                  |
| `download`          | `payload: BingFilePreviewDownloadPayload`     | 非图片分支创建 a 链接之前通知，不可取消，不表示下载成功；图片分支不转发。             |
| `openExternal`      | `payload: BingFilePreviewOpenExternalPayload` | 非图片分支调用 window.open 之前通知，不可取消；模板用 @open-external。  |
| `error`             | `error: Error`                                | 当前文本 fetch 的网络/HTTP 失败；空地址、无效 JSON、iframe/图片失败不发出。 |

## 公开类型

| 公开类型                                                                  | 取值或定义                                                                                        |
| --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `BingFilePreviewProps / BingFilePreviewEmits`                         | 属性与事件载荷元组声明。                                                                                 |
| `BingFilePreviewKind`                                                 | auto \| image \| pdf \| text \| json \| csv \| docx \| xlsx \| pptx \| office \| unknown。    |
| `BingFilePreviewResolvedKind`                                         | BingFilePreviewKind 去掉 auto。                                                                 |
| `BingFilePreviewFile`                                                 | 八个字段均可选，见文件对象表。                                                                              |
| `BingFilePreviewCloseReason`                                          | 'close' \| 'overlay' \| 'escape'。                                                            |
| `BingFilePreviewDownloadPayload / BingFilePreviewOpenExternalPayload` | \{ file: BingFilePreviewFile; kind: BingFilePreviewResolvedKind \}。file 为合并数据，标题推断名不回填 name。 |
| `SmoothScrollValue / SmoothScrollOptions`                             | boolean \| SmoothScrollOptions；配置字段均可选，见下表。                                                  |

### 平滑滚动选项

| SmoothScrollOptions 字段 | 类型        | 默认值     | 说明              |
| ---------------------- | --------- | ------- | --------------- |
| `duration`             | `number`  | `400`   | 动画时长，毫秒；0 立即更新。 |
| `stepSize`             | `number`  | `100`   | 滚轮归一化步长。        |
| `pulseScale`           | `number`  | `4`     | 脉冲缓动强度。         |
| `accelerationDelta`    | `number`  | `50`    | 连续输入加速间隔，毫秒。    |
| `accelerationMax`      | `number`  | `3`     | 最大加速倍率。         |
| `keyboardStep`         | `number`  | `50`    | 键盘基础滚动距离。       |
| `keyboard`             | `boolean` | `true`  | 内部滚动区的键盘插值。     |
| `smoothTouchpad`       | `boolean` | `false` | 是否对触控板应用插值。     |
| `respectReducedMotion` | `boolean` | `true`  | 减少动态效果偏好下关闭插值。  |
