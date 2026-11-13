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
// @docs-options:start
const options: ExampleOptions = { "sample": "json", "width": "min(980px, calc(100vw - 36px))", "height": "min(680px, calc(100vh - 36px))", "lockScroll": true, "closeOnEsc": true, "closeOnOverlay": true, "downloadable": true, "openable": true, "jsonHighlight": true }
// @docs-options:end
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
