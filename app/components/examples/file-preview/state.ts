import { computed, onActivated, onDeactivated, reactive, ref } from 'vue'
import { BingFilePreview } from '@moubing/bing-ui'
import type { BingFilePreviewDownloadPayload, BingFilePreviewOpenExternalPayload, BingFilePreviewCloseReason, BingFilePreviewFile, BingFilePreviewKind, BingRadioValue } from '@moubing/bing-ui'
import basicCodeSource from '~~/examples/file-preview/basic.vue?raw'
import limitsCodeSource from '~~/examples/file-preview/limits.vue?raw'
import officeCodeSource from '~~/examples/file-preview/office.vue?raw'
import { renderExampleCode } from '#shared/docs/example-code'
import { inject as injectExampleState, provide as provideExampleState, type InjectionKey } from 'vue'

function createExamples() {
  const examplesActive = ref(true)
  onActivated(() => { examplesActive.value = true })
  onDeactivated(() => {
    previewOpen.value = limitsOpen.value = officeOpen.value = convertedOpen.value = false
    examplesActive.value = false
  })
  type RadioOption<T extends string> = {
    label: string
    value: T
    description?: string
  }

  type SampleKey = 'text' | 'json' | 'csv' | 'pdf' | 'docx' | 'converted'

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

  const pdfDataUrl = "data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFIgPj4KZW5kb2JqCjIgMCBvYmoKPDwgL1R5cGUgL1BhZ2VzIC9LaWRzIFszIDAgUl0gL0NvdW50IDEgPj4KZW5kb2JqCjMgMCBvYmoKPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvTWVkaWFCb3ggWzAgMCA1OTUgODQyXSAvUmVzb3VyY2VzIDw8IC9Gb250IDw8IC9GMSA0IDAgUiA+PiA+PiAvQ29udGVudHMgNSAwIFIgPj4KZW5kb2JqCjQgMCBvYmoKPDwgL1R5cGUgL0ZvbnQgL1N1YnR5cGUgL1R5cGUxIC9CYXNlRm9udCAvSGVsdmV0aWNhID4+CmVuZG9iago1IDAgb2JqCjw8IC9MZW5ndGggNTUgPj4Kc3RyZWFtCkJUIC9GMSAyNCBUZiA1NCA3NDAgVGQgKEJpbmcgVUkgRmlsZVByZXZpZXcgZGVtbykgVGogRVQKZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgNgowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMDkgMDAwMDAgbiAKMDAwMDAwMDA1OCAwMDAwMCBuIAowMDAwMDAwMTE1IDAwMDAwIG4gCjAwMDAwMDAyNDEgMDAwMDAgbiAKMDAwMDAwMDMxMSAwMDAwMCBuIAp0cmFpbGVyCjw8IC9TaXplIDYgL1Jvb3QgMSAwIFIgPj4Kc3RhcnR4cmVmCjQxNgolJUVPRgo="
  const docxDataUrl = "data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,UEsDBBQAAAAIAAAAAADMVIwQ4QAAAJwBAAATAAAAW0NvbnRlbnRfVHlwZXNdLnhtbH2QTU7DMBCFr2J5i2KHLhBCSbqAsgQW5QCWM0ks7BnLMw3h9iht6QIV1u/ne3rNdklRzVA4ELb61tRaAXrqA46tft8/V/d62zX7rwyslhSRWz2J5Adr2U+QHBvKgEuKA5XkhA2V0WbnP9wIdlPXd9YTCqBUsnbornmCwR2iqN0igCdsgchaPZ6MK6vVLucYvJNAaGfsf1GqM8EUiEcPTyHzzZKitlcJq/I34Jx7naGU0IN6c0VeXIJW208qve3JHxKgmP9rruykYQgeLvm1LRfywBxwTNFclOQC/uy3x7u7b1BLAwQUAAAACAAAAAAANlfe3KQAAAAYAQAACwAAAF9yZWxzLy5yZWxzjc+xCsIwFAXQXwlvN2kdRKRpFxG6Sv2AkLy2wSQvJFHr37s4WHFwvVzO5Tbd4h27Y8qWgoSaV8AwaDI2TBIuw2mzh65tzuhUsRTybGNmi3chS5hLiQchsp7Rq8wpYli8Gyl5VTKnNImo9FVNKLZVtRPp04C1yXojIfWmBjY8I/5j0zhajUfSN4+h/Jj4agAbVJqwSHhQMsK8Y754B6JtxOpi+wJQSwMEFAAAAAgAAAAAACWsqF6mAAAA2wAAABEAAAB3b3JkL2RvY3VtZW50LnhtbEWOwQrCMBBEfyXkblM9iJS2goeCNw/2A2qytoHsbtlEW/9eUg9e3sAMM0x9XjGoN0j0TI3eF6VWQJadp7HR/b3bnfS5rZfKsX0hUFIrBorV0ugppbkyJtoJcIgFz0ArhicLDikWLKNZWNwsbCFGTyMGcyjLo8HBk86TD3afrHOGZKT24mlU/VV1PsBN4O1hUQ6Qa5PTTNm4dSLYdBOzGb8x8z/afgFQSwECFAAUAAAACAAAAAAAzFSMEOEAAACcAQAAEwAAAAAAAAAAAAAAAAAAAAAAW0NvbnRlbnRfVHlwZXNdLnhtbFBLAQIUABQAAAAIAAAAAAA2V97cpAAAABgBAAALAAAAAAAAAAAAAAAAABIBAABfcmVscy8ucmVsc1BLAQIUABQAAAAIAAAAAAAlrKhepgAAANsAAAARAAAAAAAAAAAAAAAAAN8BAAB3b3JkL2RvY3VtZW50LnhtbFBLBQYAAAAAAwADALkAAAC0AgAAAAA="

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

  const sampleOptions: RadioOption<SampleKey>[] = [
    { label: '文本', value: 'text', description: '通过 content 直接渲染。' },
    { label: 'JSON', value: 'json', description: '格式化并高亮 token。' },
    { label: 'CSV', value: 'csv', description: '渲染为表格。' },
    { label: 'PDF', value: 'pdf', description: '通过 iframe 交给浏览器。' },
    { label: 'Office', value: 'docx', description: '无 previewSrc 时显示安全 fallback。' },
    { label: '已转换', value: 'converted', description: '使用 previewSrc 渲染转换结果。' },
  ]

  const typeOptions: RadioOption<BingFilePreviewKind>[] = [
    { label: 'auto', value: 'auto', description: '根据 MIME、文件名或 src 推断。' },
    { label: 'text', value: 'text' },
    { label: 'json', value: 'json' },
    { label: 'csv', value: 'csv' },
    { label: 'pdf', value: 'pdf' },
    { label: 'docx', value: 'docx' },
    { label: 'unknown', value: 'unknown' },
  ]

  const selectedSample = ref<SampleKey>('json')

  const previewOpen = ref(false)

  const limitsOpen = ref(false)

  const officeOpen = ref(false)

  const convertedOpen = ref(false)

  const eventLog = ref('等待打开文件预览')

  const previewOptions = reactive({
    width: 'min(980px, calc(100vw - 36px))',
    height: 'min(680px, calc(100vh - 36px))',
    lockScroll: true,
    closeOnEsc: true,
    closeOnOverlay: true,
    downloadable: true,
    openable: true,
    jsonHighlight: true,
  })

  const limitOptions = reactive({
    type: 'csv' as BingFilePreviewKind,
    textMaxLength: '120',
    csvMaxRows: '3',
    csvMaxColumns: '3',
  })

  const selectedFile = computed(() => sampleFiles[selectedSample.value])

  const limitFile = computed<BingFilePreviewFile>(() => {
    const kind = limitOptions.type
    const value = kind === 'text'
      ? { ...sampleFiles.text, content: [releaseNotes, releaseNotes, releaseNotes].join('\n\n') }
      : kind === 'json' ? sampleFiles.json
      : kind === 'pdf' ? sampleFiles.pdf
      : kind === 'docx' ? sampleFiles.docx
      : { ...sampleFiles.csv, content: csvContent + '\nInput,component,done,18 KB\nTextarea,component,done,21 KB\nTreeSelect,component,todo,42 KB' }
    return { ...value, type: kind }
  })

  const normalizedTextMaxLength = computed(() => toPositiveNumber(limitOptions.textMaxLength, 120))

  const normalizedCsvMaxRows = computed(() => toPositiveNumber(limitOptions.csvMaxRows, 3))

  const normalizedCsvMaxColumns = computed(() => toPositiveNumber(limitOptions.csvMaxColumns, 3))

  function updateSample(value: BingRadioValue) {
    selectedSample.value = value as SampleKey
  }

  function updateLimitType(value: BingRadioValue) {
    limitOptions.type = value as BingFilePreviewKind
  }

  function handleClose(reason: BingFilePreviewCloseReason) {
    const reasonMap: Record<BingFilePreviewCloseReason, string> = {
      close: '点击关闭按钮',
      overlay: '点击遮罩',
      escape: '按下 Esc',
    }

    eventLog.value = `关闭：${reasonMap[reason]}`
  }

  function handleDownload(payload: BingFilePreviewDownloadPayload) {
    eventLog.value = `下载：${payload.file.name ?? '未命名文件'} (${payload.kind})`
  }

  function handleOpenExternal(payload: BingFilePreviewOpenExternalPayload) {
    eventLog.value = `新标签页打开：${payload.file.name ?? '未命名文件'} (${payload.kind})`
  }

  function toTextDataUrl(content: string, mime: string) {
    return `data:${mime};charset=utf-8,${encodeURIComponent(content)}`
  }

  function toPositiveNumber(value: string, fallback: number) {
    const parsed = Number.parseInt(value, 10)

    if (!Number.isFinite(parsed) || parsed <= 0) {
      return fallback
    }

    return parsed
  }

  const basicCode = computed(() => renderExampleCode(basicCodeSource, { sample: selectedSample.value, width: previewOptions.width, height: previewOptions.height, lockScroll: previewOptions.lockScroll, closeOnEsc: previewOptions.closeOnEsc, closeOnOverlay: previewOptions.closeOnOverlay, downloadable: previewOptions.downloadable, openable: previewOptions.openable, jsonHighlight: previewOptions.jsonHighlight }))

  const limitsCode = computed(() => renderExampleCode(limitsCodeSource, { type: limitOptions.type, textMaxLength: normalizedTextMaxLength.value, csvMaxRows: normalizedCsvMaxRows.value, csvMaxColumns: normalizedCsvMaxColumns.value }))

  const officeCode = officeCodeSource.trim()
  return { examplesActive, releaseNotes, jsonContent, csvContent, convertedHtml, pdfDataUrl, sampleFiles, sampleOptions, typeOptions, selectedSample, previewOpen, limitsOpen, officeOpen, convertedOpen, eventLog, previewOptions, limitOptions, selectedFile, limitFile, normalizedTextMaxLength, normalizedCsvMaxRows, normalizedCsvMaxColumns, updateSample, updateLimitType, handleClose, handleDownload, handleOpenExternal, toTextDataUrl, toPositiveNumber, basicCode, limitsCode, officeCode }
}
const key: InjectionKey<ReturnType<typeof createExamples>> = Symbol('file-preview-examples')
export function provideExamples() { provideExampleState(key, createExamples()) }
export function useExamples() {
  const state = injectExampleState(key)
  if (!state) throw new Error('示例需要文档页面提供状态')
  return state
}
