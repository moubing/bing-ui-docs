import { computed, ref } from 'vue'
import type { BingRadioValue, BingTagSize, BingTagTone, BingTagVariant } from '@moubing/bing-ui'
import playgroundCodeSource from '~~/examples/tag/basic.vue?raw'
import tonesCodeSource from '~~/examples/tag/tones.vue?raw'
import sizesCodeSource from '~~/examples/tag/sizes.vue?raw'
import closableCodeSource from '~~/examples/tag/closable.vue?raw'
import slotCodeSource from '~~/examples/tag/slot.vue?raw'
import { renderExampleCode } from '#shared/docs/example-code'
import { inject as injectExampleState, provide as provideExampleState, type InjectionKey } from 'vue'

function createExamples() {
  type RadioOption<T extends string> = {
    label: string
    value: T
    description?: string
  }

  const sizeOptions: RadioOption<BingTagSize>[] = [
    { label: 'sm', value: 'sm' },
    { label: 'md', value: 'md' },
    { label: 'lg', value: 'lg' },
  ]

  const toneOptions: RadioOption<BingTagTone>[] = [
    { label: 'primary', value: 'primary', description: '主色标签。' },
    { label: 'secondary', value: 'secondary', description: '辅助色标签。' },
    { label: 'neutral', value: 'neutral', description: '弱化信息。' },
    { label: 'success', value: 'success', description: '成功状态。' },
    { label: 'warning', value: 'warning', description: '警告状态。' },
    { label: 'danger', value: 'danger', description: '危险或失败状态。' },
  ]

  const variantOptions: RadioOption<BingTagVariant>[] = [
    { label: 'glass', value: 'glass', description: '细边框和紧凑圆角。' },
    { label: 'soft', value: 'soft', description: '柔和底色，适合状态列表。' },
  ]

  const toneValues: BingTagTone[] = ['primary', 'secondary', 'neutral', 'success', 'warning', 'danger']

  const sizeValues: BingTagSize[] = ['sm', 'md', 'lg']

  const playgroundLabel = ref('Aurora')

  const playgroundSize = ref<BingTagSize>('md')

  const playgroundTone = ref<BingTagTone>('primary')

  const playgroundVariant = ref<BingTagVariant>('glass')

  const playgroundClosable = ref(true)

  const playgroundDisabled = ref(false)

  const closeCount = ref(0)

  const closableTags = ref([
    { id: 'docs', label: '文档', tone: 'primary' as BingTagTone },
    { id: 'demo', label: '示例', tone: 'secondary' as BingTagTone },
    { id: 'api', label: 'API', tone: 'success' as BingTagTone },
  ])

  function updateSize(value: BingRadioValue) {
    playgroundSize.value = value as BingTagSize
  }

  function updateTone(value: BingRadioValue) {
    playgroundTone.value = value as BingTagTone
  }

  function updateVariant(value: BingRadioValue) {
    playgroundVariant.value = value as BingTagVariant
  }

  function handleClose() {
    closeCount.value += 1
  }

  function removeTag(id: string) {
    closableTags.value = closableTags.value.filter((tag) => tag.id !== id)
  }

  function restoreTags() {
    closableTags.value = [
      { id: 'docs', label: '文档', tone: 'primary' },
      { id: 'demo', label: '示例', tone: 'secondary' },
      { id: 'api', label: 'API', tone: 'success' },
    ]
  }

  const playgroundCode = computed(() => renderExampleCode(playgroundCodeSource, { label: playgroundLabel.value, size: playgroundSize.value, tone: playgroundTone.value, variant: playgroundVariant.value, closable: playgroundClosable.value, disabled: playgroundDisabled.value }))

  const tonesCode = tonesCodeSource.trim()

  const sizesCode = sizesCodeSource.trim()

  const closableCode = closableCodeSource.trim()

  const slotCode = slotCodeSource.trim()
  return { sizeOptions, toneOptions, variantOptions, toneValues, sizeValues, playgroundLabel, playgroundSize, playgroundTone, playgroundVariant, playgroundClosable, playgroundDisabled, closeCount, closableTags, updateSize, updateTone, updateVariant, handleClose, removeTag, restoreTags, playgroundCode, tonesCode, sizesCode, closableCode, slotCode }
}
const key: InjectionKey<ReturnType<typeof createExamples>> = Symbol('tag-examples')
export function provideExamples() { provideExampleState(key, createExamples()) }
export function useExamples() {
  const state = injectExampleState(key)
  if (!state) throw new Error('示例需要文档页面提供状态')
  return state
}
