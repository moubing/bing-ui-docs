<script setup lang="ts">
import { reactive, ref } from 'vue'
import { BingImagePreview, type BingImagePreviewItem, type BingImagePreviewProps, type BingImagePreviewDownloadPayload } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

// 根据导出文档重组：业务接收模型、记录请求事件，并单独控制加载结果。
const open = ref(false)
const index = ref(0)
const acceptClose = ref(true)
const acceptIndex = ref(true)
const events = ref<string[]>([])
const options = reactive<BingImagePreviewProps>({ initialIndex: 1, loop: false, downloadable: true, showToolbar: true, closeOnEsc: true, closeOnOverlay: true, lockScroll: true, glass: true })
const downloadUrl = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="80" height="50"><rect width="80" height="50" fill="pink"/></svg>')
const original: BingImagePreviewItem[] = [
  { src: '/preview-fixture/thumb.svg', previewSrc: '/preview-fixture/first.svg', alt: '首图', caption: '第一项', downloadUrl, downloadName: 'first.svg' },
  { src: '/preview-fixture/second.svg', alt: '次图', caption: '第二项', downloadUrl, downloadName: 'second.svg' },
  { src: '/preview-fixture/broken.svg', alt: '坏图', caption: '第三项' },
]
const items = ref(original)
function updateOpen(value: boolean) { events.value.push('model:' + value); if (acceptClose.value) open.value = value }
function updateIndex(value: number) { events.value.push('index:' + value); if (acceptIndex.value) index.value = value }
function changed(value: number, item: BingImagePreviewItem) { events.value.push('change:' + value + ':' + item.caption) }
function downloaded(payload: BingImagePreviewDownloadPayload) { events.value.push('download:' + payload.index + ':' + payload.item.downloadName) }
</script>

<template>
  <button id="open" type="button" @click="open = true">打开阅读图库</button>
  <button id="external-close" type="button" @click="open = false">业务直接关闭</button>
  <button id="index-one" type="button" @click="index = 1">外部选择第二项</button>
  <button id="index-two" type="button" @click="index = 2">外部选择第三项</button>
  <button id="empty" type="button" @click="items = []">清空列表</button>
  <button id="replace" type="button" @click="items = original.slice(0, 1)">缩短列表</button>
  <button id="scale-range" type="button" @click="options.minScale = 2; options.maxScale = 3">缩放区间设为 2 到 3</button>
  <label><input id="accept-close" v-model="acceptClose" type="checkbox">接收关闭模型</label>
  <label><input id="accept-index" v-model="acceptIndex" type="checkbox">接收索引更新</label>
  <label><input id="toolbar" v-model="options.showToolbar" type="checkbox">显示工具栏</label>
  <label><input id="esc" v-model="options.closeOnEsc" type="checkbox">允许 Escape</label>
  <label><input id="overlay" v-model="options.closeOnOverlay" type="checkbox">允许遮罩关闭</label>
  <label><input id="lock" v-model="options.lockScroll" type="checkbox">锁定滚动</label>
  <label><input id="glass" v-model="options.glass" type="checkbox">玻璃效果</label>
  <pre id="state">{{ JSON.stringify({ open, index, events }) }}</pre>
  <BingImagePreview :model-value="open" :current-index="index" :items="items" v-bind="options" ariaLabel="阅读图库"
    @update:model-value="updateOpen" @update:current-index="updateIndex" @change="changed"
    @close="events.push('close:' + $event)" @download="downloaded" />
</template>
