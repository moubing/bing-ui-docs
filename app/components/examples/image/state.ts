import { computed, onActivated, onDeactivated, ref } from 'vue'
import type { BingImageFit, BingImageLoadPayload, BingImageRadius, BingImageStatus, BingRadioValue } from '@moubing/bing-ui'
import playgroundCodeSource from '~~/examples/image/basic.vue?raw'
import fallbackCodeSource from '~~/examples/image/fallback.vue?raw'
import cropCodeSource from '~~/examples/image/crop.vue?raw'
import previewCodeSource from '~~/examples/image/preview.vue?raw'
import slotCodeSource from '~~/examples/image/slots.vue?raw'
import { renderExampleCode } from '#shared/docs/example-code'
import { inject as injectExampleState, provide as provideExampleState, type InjectionKey } from 'vue'

function createExamples() {
  const examplesActive = ref(true)
  const brokenSrc = 'data:image/png;base64,bm90LWFuLWltYWdl'
  const slotSrc = ref(brokenSrc)
  const previewFeedback = ref('等待打开图库')
  onActivated(() => { examplesActive.value = true })
  onDeactivated(() => { examplesActive.value = false })
  type RadioOption<T extends string> = {
    label: string
    value: T
    description?: string
  }

  type PositionValue = 'center' | 'top' | 'bottom' | 'left' | 'right'

  const photoSrc = createSvgImage('Bing Image', '#fef3c7', '#f472b6', '#1f2937')

  const placeholderSrc = createSvgImage('Loading', '#e0f2fe', '#93c5fd', '#475569')

  const fallbackSrc = createSvgImage('Fallback', '#dcfce7', '#34d399', '#14532d')

  const portraitSrc = createSvgImage('Portrait', '#ede9fe', '#a78bfa', '#312e81', 'portrait')

  const galleryItems = [
    {
      src: createSvgImage('Gallery 01', '#fee2e2', '#fb7185', '#7f1d1d'),
      alt: '图库图片一',
      caption: '图库图片一',
      downloadName: 'gallery-01.svg',
    },
    {
      src: createSvgImage('Gallery 02', '#dbeafe', '#60a5fa', '#1e3a8a'),
      alt: '图库图片二',
      caption: '图库图片二',
      downloadName: 'gallery-02.svg',
    },
    {
      src: createSvgImage('Gallery 03', '#dcfce7', '#4ade80', '#14532d'),
      alt: '图库图片三',
      caption: '图库图片三',
      downloadName: 'gallery-03.svg',
    },
  ]

  const fitOptions: RadioOption<BingImageFit>[] = [
    { label: 'cover', value: 'cover', description: '填满容器，可能裁切。' },
    { label: 'contain', value: 'contain', description: '完整显示，可能留白。' },
    { label: 'fill', value: 'fill', description: '拉伸填满容器。' },
    { label: 'scale-down', value: 'scale-down', description: '按较小尺寸显示。' },
  ]

  const radiusOptions: RadioOption<BingImageRadius>[] = [
    { label: 'none', value: 'none' },
    { label: 'sm', value: 'sm' },
    { label: 'md', value: 'md' },
    { label: 'lg', value: 'lg' },
    { label: 'xl', value: 'xl' },
    { label: 'full', value: 'full' },
  ]

  const positionOptions: RadioOption<PositionValue>[] = [
    { label: 'center', value: 'center' },
    { label: 'top', value: 'top' },
    { label: 'bottom', value: 'bottom' },
    { label: 'left', value: 'left' },
    { label: 'right', value: 'right' },
  ]

  const playgroundFit = ref<BingImageFit>('cover')

  const playgroundRadius = ref<BingImageRadius>('lg')

  const playgroundPosition = ref<PositionValue>('center')

  const playgroundBlock = ref(true)

  const playgroundPreview = ref(true)

  const playgroundStatus = ref<BingImageStatus>('idle')

  const playgroundLoadInfo = ref('等待图片加载')

  const fallbackStatus = ref<BingImageStatus>('idle')

  const fallbackErrorCount = ref(0)

  const slotErrorCount = ref(0)

  const slotImageKey = ref(0)

  function updateFit(value: BingRadioValue) {
    playgroundFit.value = value as BingImageFit
  }

  function updateRadius(value: BingRadioValue) {
    playgroundRadius.value = value as BingImageRadius
  }

  function updatePosition(value: BingRadioValue) {
    playgroundPosition.value = value as PositionValue
  }

  function handlePlaygroundStatus(payload: { status: BingImageStatus }) {
    playgroundStatus.value = payload.status
  }

  function handlePlaygroundLoad(payload: BingImageLoadPayload) {
    playgroundLoadInfo.value = `${payload.naturalWidth} × ${payload.naturalHeight}`
  }

  function handleFallbackStatus(payload: { status: BingImageStatus }) {
    fallbackStatus.value = payload.status
  }

  function handleFallbackError() {
    fallbackErrorCount.value += 1
  }

  function handleSlotError() {
    slotErrorCount.value += 1
  }

  function resetSlotImage() {
    slotSrc.value = brokenSrc
    slotImageKey.value += 1
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
  <circle cx="${width * 0.78}" cy="${height * 0.22}" r="${Math.min(width, height) * 0.2}" fill="${accent}" opacity="0.5"/>
  <circle cx="${width * 0.22}" cy="${height * 0.76}" r="${Math.min(width, height) * 0.28}" fill="${accent}" opacity="0.22"/>
  <path d="M0 ${height * 0.72} C ${width * 0.25} ${height * 0.48}, ${width * 0.45} ${height * 0.92}, ${width} ${height * 0.58} L ${width} ${height} L 0 ${height} Z" fill="${accent}" opacity="0.32"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="${text}" font-family="Maple Mono NF CN, Consolas, monospace" font-size="${Math.round(width / 12)}" font-weight="800">${label}</text>
</svg>`

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
  }

  const playgroundCode = computed(() => renderExampleCode(playgroundCodeSource, { fit: playgroundFit.value, position: playgroundPosition.value, radius: playgroundRadius.value, block: playgroundBlock.value, preview: playgroundPreview.value }))

  const fallbackCode = fallbackCodeSource.trim()

  const cropCode = cropCodeSource.trim()

  const previewCode = previewCodeSource.trim()

  const slotCode = slotCodeSource.trim()
  return { examplesActive, brokenSrc, slotSrc, previewFeedback, photoSrc, placeholderSrc, fallbackSrc, portraitSrc, galleryItems, fitOptions, radiusOptions, positionOptions, playgroundFit, playgroundRadius, playgroundPosition, playgroundBlock, playgroundPreview, playgroundStatus, playgroundLoadInfo, fallbackStatus, fallbackErrorCount, slotErrorCount, slotImageKey, updateFit, updateRadius, updatePosition, handlePlaygroundStatus, handlePlaygroundLoad, handleFallbackStatus, handleFallbackError, handleSlotError, resetSlotImage, createSvgImage, playgroundCode, fallbackCode, cropCode, previewCode, slotCode }
}
const key: InjectionKey<ReturnType<typeof createExamples>> = Symbol('image-examples')
export function provideExamples() { provideExampleState(key, createExamples()) }
export function useExamples() {
  const state = injectExampleState(key)
  if (!state) throw new Error('示例需要文档页面提供状态')
  return state
}
