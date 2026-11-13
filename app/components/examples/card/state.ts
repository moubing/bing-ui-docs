import { computed, reactive, ref } from 'vue'
import type { BingCardEntrance, BingCardFlipAxis, BingCardFlipSide, BingCardProps, BingCardLongPressRelease, BingCardPadding, BingCardRounded, BingCardVariant, BingRadioValue } from '@moubing/bing-ui'
import playgroundCodeSource from '~~/examples/card/basic.vue?raw'
import variantsCodeSource from '~~/examples/card/variants.vue?raw'
import entranceCodeSource from '~~/examples/card/entrance.vue?raw'
import presetsCodeSource from '~~/examples/card/presets.vue?raw'
import flipCodeSource from '~~/examples/card/flip.vue?raw'
import slotsCodeSource from '~~/examples/card/slots.vue?raw'
import { renderExampleCode } from '#shared/docs/example-code'
import { inject as injectExampleState, provide as provideExampleState, type InjectionKey } from 'vue'

function createExamples() {
  type BingCardFlipTrigger = NonNullable<BingCardProps['flipTrigger']>
  type RadioOption<T extends string> = {
    label: string
    value: T
    description?: string
  }

  const variantOptions: RadioOption<BingCardVariant>[] = [
    { label: 'plain', value: 'plain', description: '普通白底面板。' },
    { label: 'soft', value: 'soft', description: '默认柔和面板。' },
    { label: 'accent', value: 'accent', description: '更强的主色强调。' },
    { label: 'sky', value: 'sky', description: '偏冷色的辅助强调。' },
  ]

  const paddingOptions: RadioOption<BingCardPadding>[] = [
    { label: 'none', value: 'none' },
    { label: 'sm', value: 'sm' },
    { label: 'md', value: 'md' },
    { label: 'lg', value: 'lg' },
  ]

  const roundedOptions: RadioOption<BingCardRounded>[] = [
    { label: 'none', value: 'none' },
    { label: 'sm', value: 'sm' },
    { label: 'md', value: 'md' },
    { label: 'lg', value: 'lg' },
    { label: 'xl', value: 'xl' },
    { label: 'full', value: 'full' },
  ]

  const entranceOptions: RadioOption<BingCardEntrance>[] = [
    { label: 'none', value: 'none', description: '不播放入场动画。' },
    { label: 'fade-up', value: 'fade-up', description: '默认上浮淡入。' },
    { label: 'bubble', value: 'bubble', description: '带弹性的气泡入场。' },
    { label: 'rotate-up', value: 'rotate-up', description: '带翻转的入场动画。' },
    { label: 'soft-pop', value: 'soft-pop', description: '从模糊到聚焦的轻量入场。' },
  ]

  const flipTriggerOptions: RadioOption<BingCardFlipTrigger>[] = [
    { label: 'none', value: 'none', description: '禁用翻面。' },
    { label: 'click', value: 'click', description: '点击切换正反面。' },
    { label: 'press', value: 'press', description: '长按触发翻面。' },
  ]

  const flipAxisOptions: RadioOption<BingCardFlipAxis>[] = [
    { label: 'x', value: 'x' },
    { label: 'y', value: 'y' },
    { label: 'z', value: 'z' },
  ]

  const longPressReleaseOptions: RadioOption<BingCardLongPressRelease>[] = [
    { label: 'restore', value: 'restore', description: '松开后回到正面。' },
    { label: 'stay', value: 'stay', description: '松开后保持当前面。' },
  ]

  const variants: BingCardVariant[] = ['plain', 'soft', 'accent', 'sky']

  const entrances: BingCardEntrance[] = ['fade-up', 'bubble', 'rotate-up', 'soft-pop']

  const playground = reactive({
    title: '洞察面板',
    description: '把信息、操作和轻量动效放在同一个内容容器里。',
    variant: 'soft' as BingCardVariant,
    padding: 'md' as BingCardPadding,
    rounded: 'md' as BingCardRounded,
    glass: true,
    tilt: true,
    glare: true,
    disabled: false,
  })

  const entranceDemo = reactive({
    entrance: 'fade-up' as BingCardEntrance,
    entranceOnce: false,
    entranceDuration: '0.72',
    entranceDelay: '0',
  })

  const flipDemo = reactive({
    trigger: 'click' as BingCardFlipTrigger,
    axis: 'y' as BingCardFlipAxis,
    release: 'stay' as BingCardLongPressRelease,
  })

  const flipSide = ref<BingCardFlipSide>('front')

  const longPressCount = ref(0)

  const enterCount = ref(0)

  function updateVariant(value: BingRadioValue) {
    playground.variant = value as BingCardVariant
  }

  function updatePadding(value: BingRadioValue) {
    playground.padding = value as BingCardPadding
  }

  function updateRounded(value: BingRadioValue) {
    playground.rounded = value as BingCardRounded
  }

  function updateEntrance(value: BingRadioValue) {
    entranceDemo.entrance = value as BingCardEntrance
  }

  function updateFlipTrigger(value: BingRadioValue) {
    flipDemo.trigger = value as BingCardFlipTrigger
  }

  function updateFlipAxis(value: BingRadioValue) {
    flipDemo.axis = value as BingCardFlipAxis
  }

  function updateLongPressRelease(value: BingRadioValue) {
    flipDemo.release = value as BingCardLongPressRelease
  }

  function handleEnter() {
    enterCount.value += 1
  }

  function handleLongPress() {
    longPressCount.value += 1
  }

  function handleFlip(side: BingCardFlipSide) {
    flipSide.value = side
  }

  function toNumberText(value: string) {
    const numericValue = Number(value)

    if (Number.isNaN(numericValue)) {
      return 0
    }

    return numericValue
  }

  const playgroundCode = computed(() => renderExampleCode(playgroundCodeSource, { title: playground.title, description: playground.description, variant: playground.variant, padding: playground.padding, rounded: playground.rounded, glass: playground.glass, tilt: playground.tilt, glare: playground.glare, disabled: playground.disabled }))

  const variantsCode = variantsCodeSource.trim()

  const entranceCode = computed(() => renderExampleCode(entranceCodeSource, { entrance: entranceDemo.entrance, entranceOnce: entranceDemo.entranceOnce, entranceDuration: toNumberText(entranceDemo.entranceDuration), entranceDelay: toNumberText(entranceDemo.entranceDelay) }))

  const presetsCode = presetsCodeSource.trim()

  const flipCode = computed(() => renderExampleCode(flipCodeSource, { flipTrigger: flipDemo.trigger, flipAxis: flipDemo.axis, longPressRelease: flipDemo.release }))

  const slotsCode = slotsCodeSource.trim()
  return { variantOptions, paddingOptions, roundedOptions, entranceOptions, flipTriggerOptions, flipAxisOptions, longPressReleaseOptions, variants, entrances, playground, entranceDemo, flipDemo, flipSide, longPressCount, enterCount, updateVariant, updatePadding, updateRounded, updateEntrance, updateFlipTrigger, updateFlipAxis, updateLongPressRelease, handleEnter, handleLongPress, handleFlip, toNumberText, playgroundCode, variantsCode, entranceCode, presetsCode, flipCode, slotsCode }
}
const key: InjectionKey<ReturnType<typeof createExamples>> = Symbol('card-examples')
export function provideExamples() { provideExampleState(key, createExamples()) }
export function useExamples() {
  const state = injectExampleState(key)
  if (!state) throw new Error('示例需要文档页面提供状态')
  return state
}
