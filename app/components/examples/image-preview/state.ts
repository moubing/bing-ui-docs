import { computed, onActivated, onDeactivated, ref, watch } from 'vue'
import type { BingImagePreviewCloseReason, BingImagePreviewDownloadPayload, BingImagePreviewItem, BingRadioValue } from '@moubing/bing-ui'
import basicCodeSource from '~~/examples/image-preview/basic.vue?raw'
import galleryCodeSource from '~~/examples/image-preview/gallery.vue?raw'
import behaviorCodeSource from '~~/examples/image-preview/behavior.vue?raw'
import glassCodeSource from '~~/examples/image-preview/glass.vue?raw'
import { renderExampleCode } from '#shared/docs/example-code'
import { inject as injectExampleState, provide as provideExampleState, type InjectionKey } from 'vue'

function createExamples() {
  const examplesActive = ref(true)
  onActivated(() => { examplesActive.value = true })
  onDeactivated(() => {
    basicOpen.value = galleryOpen.value = behaviorOpen.value = glassOpen.value = false
    examplesActive.value = false
  })
  type RadioOption<T extends string> = {
    label: string
    value: T
    description?: string
  }

  type InitialIndexOption = '0' | '1' | '2'

  const previewItems: BingImagePreviewItem[] = [
    {
      src: createSvgImage('Preview 01', '#fee2e2', '#fb7185', '#7f1d1d'),
      alt: '预览图片一',
      caption: '第一张图片：横向封面图。',
      downloadName: 'preview-01.svg',
    },
    {
      src: createSvgImage('Preview 02', '#dbeafe', '#60a5fa', '#1e3a8a'),
      alt: '预览图片二',
      caption: '第二张图片：用于测试切换和计数器。',
      downloadName: 'preview-02.svg',
    },
    {
      src: createSvgImage('Preview 03', '#ede9fe', '#a78bfa', '#312e81', 'portrait'),
      alt: '预览图片三',
      caption: '第三张图片：竖向图片会完整适配预览空间。',
      downloadName: 'preview-03.svg',
    },
  ]

  const initialIndexOptions: RadioOption<InitialIndexOption>[] = [
    { label: '0', value: '0', description: '从第一张开始。' },
    { label: '1', value: '1', description: '从第二张开始。' },
    { label: '2', value: '2', description: '从第三张开始。' },
  ]

  const basicOpen = ref(false)

  const galleryOpen = ref(false)

  const behaviorOpen = ref(false)

  const glassOpen = ref(false)

  const basicInitialIndex = ref<InitialIndexOption>('0')

  const galleryCurrentIndex = ref(0)

  const lastChangeText = ref('还没有切换')

  const lastCloseReason = ref<BingImagePreviewCloseReason | '未关闭'>('未关闭')

  const downloadCount = ref(0)

  const showToolbar = ref(true)

  const showCounter = ref(true)

  const downloadable = ref(true)

  const loop = ref(true)

  const closeOnEsc = ref(true)

  const closeOnOverlay = ref(true)

  const lockScroll = ref(true)

  watch([showToolbar, closeOnOverlay, closeOnEsc], ([toolbar, overlay, escape]) => {
    if (!toolbar && !overlay && !escape) closeOnEsc.value = true
  })

  const glass = ref(true)

  const glassBlur = ref('')

  const glassOpacity = ref('')

  const glassSaturation = ref('')

  const normalizedInitialIndex = computed(() => Number(basicInitialIndex.value))
  const currentCover = computed(() => previewItems[normalizedInitialIndex.value])

  const normalizedGlassBlur = computed(() => glassBlur.value.trim() ? Number(glassBlur.value) || 0 : undefined)

  const normalizedGlassOpacity = computed(() => glassOpacity.value.trim() ? clamp(Number(glassOpacity.value), 0, 1, 0.86) : undefined)

  const normalizedGlassSaturation = computed(() => glassSaturation.value.trim() ? Math.max(0, Number(glassSaturation.value) || 0) : undefined)

  function updateInitialIndex(value: BingRadioValue) {
    basicInitialIndex.value = value as InitialIndexOption
  }

  function openGallery(index: number) {
    galleryCurrentIndex.value = index
    galleryOpen.value = true
  }

  function handleChange(index: number, item: BingImagePreviewItem) {
    lastChangeText.value = `${index + 1}：${item.caption || item.alt || item.src}`
  }

  function handleClose(reason: BingImagePreviewCloseReason) {
    lastCloseReason.value = reason
  }

  function handleDownload(payload: BingImagePreviewDownloadPayload) {
    downloadCount.value += 1
    lastChangeText.value = `下载：${payload.item.downloadName || payload.item.src}`
  }

  function clamp(value: number, min: number, max: number, fallback: number) {
    if (!Number.isFinite(value)) {
      return fallback
    }

    return Math.min(max, Math.max(min, value))
  }

  function createSvgImage(
    label: string,
    background: string,
    accent: string,
    text: string,
    mode: 'landscape' | 'portrait' = 'landscape',
  ) {
    const width = mode === 'portrait' ? 520 : 900
    const height = mode === 'portrait' ? 720 : 560
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="${background}"/>
  <circle cx="${width * 0.76}" cy="${height * 0.2}" r="${Math.min(width, height) * 0.22}" fill="${accent}" opacity="0.52"/>
  <circle cx="${width * 0.22}" cy="${height * 0.78}" r="${Math.min(width, height) * 0.28}" fill="${accent}" opacity="0.22"/>
  <path d="M0 ${height * 0.72} C ${width * 0.22} ${height * 0.44}, ${width * 0.5} ${height * 0.9}, ${width} ${height * 0.58} L ${width} ${height} L 0 ${height} Z" fill="${accent}" opacity="0.34"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="${text}" font-family="Maple Mono NF CN, Consolas, monospace" font-size="${Math.round(width / 12)}" font-weight="800">${label}</text>
</svg>`

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
  }

  const basicCode = computed(() => renderExampleCode(basicCodeSource, { initialIndex: normalizedInitialIndex.value }))

  const galleryCode = galleryCodeSource.trim()

  const behaviorCode = computed(() => renderExampleCode(behaviorCodeSource, { showToolbar: showToolbar.value, showCounter: showCounter.value, downloadable: downloadable.value, loop: loop.value, closeOnEsc: closeOnEsc.value, closeOnOverlay: closeOnOverlay.value, lockScroll: lockScroll.value }))

  const glassCode = computed(() => renderExampleCode(glassCodeSource, { glass: glass.value, glassBlur: normalizedGlassBlur.value, glassOpacity: normalizedGlassOpacity.value, glassSaturation: normalizedGlassSaturation.value }))
  return { examplesActive, currentCover, previewItems, initialIndexOptions, basicOpen, galleryOpen, behaviorOpen, glassOpen, basicInitialIndex, galleryCurrentIndex, lastChangeText, lastCloseReason, downloadCount, showToolbar, showCounter, downloadable, loop, closeOnEsc, closeOnOverlay, lockScroll, glass, glassBlur, glassOpacity, glassSaturation, normalizedInitialIndex, normalizedGlassBlur, normalizedGlassOpacity, normalizedGlassSaturation, updateInitialIndex, openGallery, handleChange, handleClose, handleDownload, clamp, createSvgImage, basicCode, galleryCode, behaviorCode, glassCode }
}
const key: InjectionKey<ReturnType<typeof createExamples>> = Symbol('image-preview-examples')
export function provideExamples() { provideExampleState(key, createExamples()) }
export function useExamples() {
  const state = injectExampleState(key)
  if (!state) throw new Error('示例需要文档页面提供状态')
  return state
}
