<script setup lang="ts">
import { reactive, ref } from 'vue'
import { BingFilePreview, type BingFilePreviewFile, type BingFilePreviewProps, type BingFilePreviewDownloadPayload, type BingFilePreviewOpenExternalPayload } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const open = ref(false)
const mounted = ref(true)
const acceptClose = ref(true)
const events = ref<string[]>([])
const file = ref<BingFilePreviewFile | undefined>({ name: 'local.json', type: 'json', content: '{"value":7,"html":"<em>字面文本</em>"}' })
const props = reactive<BingFilePreviewProps>({ src: '/file-fixture/fallback.txt', name: 'standalone.txt', type: 'text', content: '独立属性文本', textMaxLength: 1000, csvMaxRows: 3, csvMaxColumns: 2, smoothScroll: false })
const image = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="80" height="50"><rect width="80" height="50" fill="pink"/></svg>')
function requestClose(value: boolean) { events.value.push('model:' + value); if (acceptClose.value) open.value = value }
function downloaded(payload: BingFilePreviewDownloadPayload) { events.value.push('download:' + payload.kind + ':' + payload.file.name) }
function opened(payload: BingFilePreviewOpenExternalPayload) { events.value.push('external:' + payload.kind + ':' + payload.file.name) }
function remote() { props.content = undefined; file.value = { src: '/file-fixture/slow.txt', type: 'text' } }
function imageBranch() { file.value = { src: image, type: 'image', name: 'reading.svg' } }
</script>

<template>
  <div id="preview-target"></div>
  <button id="open" type="button" @click="open = true">打开阅读文件</button>
  <button id="external-close" type="button" @click="open = false">业务关闭</button>
  <button id="unmount" type="button" @click="mounted = false">卸载预览</button>
  <button id="remote" type="button" @click="remote">加载远程文本</button>
  <button id="missing" type="button" @click="props.content = undefined; file = { src: '/file-fixture/missing.txt', type: 'text' }">加载失败文本</button>
  <button id="empty" type="button" @click="file = { content: '', type: 'text' }">显式空文本</button>
  <button id="source-missing" type="button" @click="props.content = undefined; file = { type: 'text' }">没有文件地址</button>
  <button id="preview-only" type="button" @click="file = undefined; props.src = undefined; props.content = undefined; props.previewSrc = '/file-fixture/converted.html'">只有独立预览地址</button>
  <button id="download" type="button" @click="file = { type: 'text', content: '下载内容', downloadUrl: '/file-fixture/download.txt' }">只有下载地址</button>
  <button id="converted" type="button" @click="file = { name: 'book.docx', type: 'docx', src: '/file-fixture/original.docx', previewSrc: '/file-fixture/converted.html', downloadUrl: '/file-fixture/download.docx' }">转换后的文档</button>
  <button id="unknown" type="button" @click="file = { name: 'unknown.bin', type: 'unknown', previewSrc: '/file-fixture/converted.html' }">未知类型</button>
  <button id="image-suffix" type="button" @click="file = { name: 'photo.png', type: 'auto', src: image }">只有图片后缀</button>
  <button id="image" type="button" @click="imageBranch">显式图片类型</button>
  <button id="csv" type="button" @click="file = { type: 'csv', content: ',value,extra\r\n&quot;a,b&quot;,&quot;x&quot;&quot;y&quot;,z\r\nlast,2,skip\r\n,,\r\nignored,3,end' }">CSV 引号和限制</button>
  <button id="text" type="button" @click="file = { name: 'test.txt', type: 'text', content: 'abcdefghijklmnop' }">文本截断</button>
  <button id="limit" type="button" @click="props.textMaxLength = 5">长度设为五</button>
  <button id="invalid-json" type="button" @click="file = { type: 'json', content: '{bad <em>json</em>' }">无效 JSON</button>
  <button id="highlight-off" type="button" @click="props.jsonHighlight = false">关闭高亮</button>
  <label><input id="accept-close" v-model="acceptClose" type="checkbox">接收关闭请求</label>
  <pre id="state">{{ JSON.stringify({ open, events }) }}</pre>
  <BingFilePreview v-if="mounted" :model-value="open" :file="file" v-bind="props" teleport-to="#preview-target" ariaLabel="阅读文件"
    @update:model-value="requestClose" @close="events.push('close:' + $event)" @error="events.push('error:' + $event.message)" @download="downloaded" @open-external="opened" />
</template>
