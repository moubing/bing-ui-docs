import { computed, reactive, ref } from 'vue'
import { bingToast } from '@moubing/bing-ui'
import type { BingButtonRounded, BingButtonSize, BingButtonTextEffect, BingButtonTextEffectTrigger, BingButtonThrottledPayload, BingButtonVariant, BingRadioValue } from '@moubing/bing-ui'
import playgroundCodeSource from '~~/examples/button/basic.vue?raw'
import variantsCodeSource from '~~/examples/button/variants.vue?raw'
import sizesCodeSource from '~~/examples/button/sizes.vue?raw'
import textEffectCodeSource from '~~/examples/button/text-effect.vue?raw'
import throttleCodeSource from '~~/examples/button/throttle.vue?raw'
import { renderExampleCode } from '#shared/docs/example-code'
import { inject as injectExampleState, provide as provideExampleState, type InjectionKey } from 'vue'

function createExamples() {
  type RadioOption<T extends string> = {
    label: string
    value: T
    description?: string
  }

  const variantOptions: RadioOption<BingButtonVariant>[] = [
    { label: 'primary', value: 'primary', description: '主操作，默认带文字扫光。' },
    { label: 'secondary', value: 'secondary', description: '次操作，适合辅助按钮。' },
    { label: 'tertiary', value: 'tertiary', description: '弱强调操作。' },
    { label: 'ghost', value: 'ghost', description: '透明背景操作。' },
    { label: 'danger', value: 'danger', description: '危险或破坏性操作。' },
    { label: 'success', value: 'success', description: '成功确认操作。' },
    { label: 'warning', value: 'warning', description: '警告操作。' },
  ]

  const sizeOptions: RadioOption<BingButtonSize>[] = [
    { label: 'xs', value: 'xs' },
    { label: 'sm', value: 'sm' },
    { label: 'md', value: 'md' },
    { label: 'lg', value: 'lg' },
    { label: 'xl', value: 'xl' },
  ]

  const roundedOptions: RadioOption<BingButtonRounded>[] = [
    { label: 'none', value: 'none' },
    { label: 'sm', value: 'sm' },
    { label: 'md', value: 'md' },
    { label: 'lg', value: 'lg' },
    { label: 'full', value: 'full' },
  ]

  const textEffectOptions: RadioOption<BingButtonTextEffect>[] = [
    { label: 'none', value: 'none', description: '普通文字，不使用动效。' },
    { label: 'shine', value: 'shine', description: '文字扫光效果。' },
    { label: 'jump', value: 'jump', description: '字符跳动效果。' },
  ]

  const textTriggerOptions: RadioOption<BingButtonTextEffectTrigger>[] = [
    { label: 'always', value: 'always', description: '挂载后循环或立即播放。' },
    { label: 'hover', value: 'hover', description: '悬停时播放。' },
  ]

  const variants: BingButtonVariant[] = [
    'primary',
    'secondary',
    'tertiary',
    'ghost',
    'danger',
    'success',
    'warning',
  ]

  const sizes: BingButtonSize[] = ['xs', 'sm', 'md', 'lg', 'xl']

  const roundedItems: BingButtonRounded[] = ['none', 'sm', 'md', 'lg', 'full']

  const playground = reactive({
    label: '提交订单',
    variant: 'primary' as BingButtonVariant,
    size: 'md' as BingButtonSize,
    rounded: 'md' as BingButtonRounded,
    loading: false,
    disabled: false,
    block: false,
  })

  const textEffectDemo = reactive({
    label: '悬停看看动效',
    textEffect: 'jump' as BingButtonTextEffect,
    textEffectTrigger: 'hover' as BingButtonTextEffectTrigger,
    customShine: false,
    shineColor: '#ffffff',
    shineBaseColor: '#71717a',
  })

  const clickCount = ref(0)

  const throttledCount = ref(0)

  const remainingMs = ref(0)

  function updateVariant(value: BingRadioValue) {
    playground.variant = value as BingButtonVariant
  }

  function updateSize(value: BingRadioValue) {
    playground.size = value as BingButtonSize
  }

  function updateRounded(value: BingRadioValue) {
    playground.rounded = value as BingButtonRounded
  }

  function updateTextEffect(value: BingRadioValue) {
    textEffectDemo.textEffect = value as BingButtonTextEffect
  }

  function updateTextEffectTrigger(value: BingRadioValue) {
    textEffectDemo.textEffectTrigger = value as BingButtonTextEffectTrigger
  }

  function handleAcceptedClick() {
    clickCount.value += 1
    bingToast.success({
      title: '点击已生效',
      message: `第 ${clickCount.value} 次有效点击已通过节流校验。`,
      duration: 5000,
    })
  }

  function handleThrottled(payload: BingButtonThrottledPayload) {
    throttledCount.value += 1
    remainingMs.value = Math.ceil(payload.remaining)
  }

  const playgroundCode = computed(() => renderExampleCode(playgroundCodeSource, { label: playground.label, variant: playground.variant, size: playground.size, rounded: playground.rounded, loading: playground.loading, disabled: playground.disabled, block: playground.block }))

  const variantsCode = variantsCodeSource.trim()

  const sizesCode = sizesCodeSource.trim()

  const textEffectCode = computed(() => renderExampleCode(textEffectCodeSource, { label: textEffectDemo.label, textEffect: textEffectDemo.textEffect, textEffectTrigger: textEffectDemo.textEffectTrigger, customShine: textEffectDemo.customShine, shineColor: textEffectDemo.shineColor, shineBaseColor: textEffectDemo.shineBaseColor }))

  const throttleCode = throttleCodeSource.trim()
  return { variantOptions, sizeOptions, roundedOptions, textEffectOptions, textTriggerOptions, variants, sizes, roundedItems, playground, textEffectDemo, clickCount, throttledCount, remainingMs, updateVariant, updateSize, updateRounded, updateTextEffect, updateTextEffectTrigger, handleAcceptedClick, handleThrottled, playgroundCode, variantsCode, sizesCode, textEffectCode, throttleCode }
}
const key: InjectionKey<ReturnType<typeof createExamples>> = Symbol('button-examples')
export function provideExamples() { provideExampleState(key, createExamples()) }
export function useExamples() {
  const state = injectExampleState(key)
  if (!state) throw new Error('示例需要文档页面提供状态')
  return state
}
