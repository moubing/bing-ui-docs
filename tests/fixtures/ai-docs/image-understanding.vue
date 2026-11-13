<script setup lang="ts">
// 按导出文档组织的阅读应用；测试服务控制请求成功/失败以检查生命周期。
import { ref } from 'vue'
import { BingImage, type BingImageStatusChangePayload, type BingImageErrorPayload, type BingImageLoadPayload } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const src = ref<string>()
const fallback = ref('/image-fixture/fallback.svg')
const showLoading = ref(true)
const showError = ref(true)
const preview = ref(true)
const events = ref<string[]>([])
const errors = ref<boolean[]>([])
const previewEvents = ref<string[]>([])
const loaded = ref({ src: '', currentSrc: '', width: 0, height: 0 })
const placeholder = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="80" height="50"><rect width="80" height="50" fill="pink"/></svg>')
const gallery = [{ src: '/image-fixture/thumbnail.svg', previewSrc: '/image-fixture/gallery.svg', alt: '阅读图库大图', caption: '图库中的图片' }]
function changed(payload: BingImageStatusChangePayload) { events.value.push(payload.status) }
function failed(payload: BingImageErrorPayload) { errors.value.push(payload.isFallback) }
function onLoad(payload: BingImageLoadPayload) {
  loaded.value = { src: payload.src, currentSrc: payload.event.currentTarget instanceof HTMLImageElement ? payload.event.currentTarget.currentSrc : '', width: payload.naturalWidth, height: payload.naturalHeight }
}
</script>

<template>
  <div style="max-width: 520px; padding: 20px">
    <button type="button" @click="src = '/image-fixture/primary.svg'">加载主图</button>
    <button type="button" @click="fallback = '/image-fixture/recovered.svg'">更换回退地址</button>
    <button type="button" @click="src = undefined">清空地址</button>
    <label><input v-model="showLoading" type="checkbox">显示 loading</label>
    <label><input v-model="showError" type="checkbox">显示 error</label>
    <label><input id="preview-enabled" v-model="preview" type="checkbox">启用预览</label>
    <BingImage :src="src" :fallback-src="fallback" :placeholder-src="placeholder" :show-loading="showLoading" :show-error="showError"
      alt="阅读图片" :width="320" height="200px" fit="contain" loading="eager" fetch-priority="high" decoding="sync" crossorigin="anonymous" referrer-policy="no-referrer"
      srcset="/image-fixture/candidate.svg 1x" sizes="320px" :preview="preview" preview-aria-label="阅读图片预览"
      preview-src="/image-fixture/single.svg" :preview-items="gallery"
      @status-change="changed" @error="failed" @load="onLoad"
      @preview-open="previewEvents.push('open:' + $event.src)" @preview-close="previewEvents.push('close:' + $event.reason)">
      <template #placeholder><span id="custom-placeholder">占位内容</span></template>
      <template #loading><span id="custom-loading">加载内容</span></template>
      <template #error="{ retry }"><button id="retry-image" type="button" @click.stop="retry">重试原图</button></template>
    </BingImage>
    <p id="state">{{ JSON.stringify({ events, errors, loaded, previewEvents }) }}</p>
  </div>
</template>
