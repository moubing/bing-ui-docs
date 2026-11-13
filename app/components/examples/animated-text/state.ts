import { computed, onActivated, onDeactivated, reactive, ref } from 'vue'
import type { BingAnimatedTextEffect, BingAnimatedTextShineDirection, BingAnimatedTextTrigger, BingRadioValue } from '@moubing/bing-ui'
import playgroundCodeSource from '~~/examples/animated-text/basic.vue?raw'
import shineCodeSource from '~~/examples/animated-text/shine.vue?raw'
import jumpCodeSource from '~~/examples/animated-text/jump.vue?raw'
import disabledCodeSource from '~~/examples/animated-text/disabled.vue?raw'
import { renderExampleCode } from '#shared/docs/example-code'
import { inject as injectExampleState, provide as provideExampleState, type InjectionKey } from 'vue'

function createExamples() {
  const examplesActive = ref(true)
  onActivated(() => { examplesActive.value = true })
  onDeactivated(() => { examplesActive.value = false })
  type EffectOption = {
    label: string
    value: BingAnimatedTextEffect
    description: string
  }

  type TriggerOption = {
    label: string
    value: BingAnimatedTextTrigger
    description: string
  }

  const effectOptions: EffectOption[] = [
    { label: 'shimmer', value: 'shimmer', description: '减淡文字并扫过原色光带。' },
    {
      label: 'none',
      value: 'none',
      description: '保持普通文本，不启动动画。',
    },
    {
      label: 'shine',
      value: 'shine',
      description: '用扫光渐变强调文字。',
    },
    {
      label: 'jump',
      value: 'jump',
      description: '拆分字符并做跳动节奏。',
    },
  ]

  const triggerOptions: TriggerOption[] = [
    {
      label: 'always',
      value: 'always',
      description: '进入视口循环，离开暂停。',
    },
    {
      label: 'hover',
      value: 'hover',
      description: '悬停或键盘聚焦时播放。',
    },
    {
      label: 'once',
      value: 'once',
      description: '首次进入视口后播放一次。',
    },
  ]

  const shineDirectionOptions = [
    {
      label: 'left',
      value: 'left',
      description: '高光从右向左扫过。',
    },
    {
      label: 'right',
      value: 'right',
      description: '高光从左向右扫过。',
    },
  ]

  const playground = reactive({
    text: '让文字动起来',
    effect: 'shine' as BingAnimatedTextEffect,
    trigger: 'always' as BingAnimatedTextTrigger,
    disabled: false,
  })

  const shineDemo = reactive({
    text: '细腻的扫光文字',
    direction: 'left' as BingAnimatedTextShineDirection,
    shineColor: '#d4d4d8',
    shineBaseColor: '#71717a',
  })

  const jumpText = ref('悬停让每个字符跳动')

  const jumpY = ref('-10')

  const jumpStagger = ref('0.028')

  const disabledDemo = ref(false)

  const normalizedJumpY = computed(() => toNumber(jumpY.value, -10))

  const normalizedJumpStagger = computed(() => toNumber(jumpStagger.value, 0.028))




  function updatePlaygroundEffect(value: BingRadioValue) {
    playground.effect = value as BingAnimatedTextEffect
  }

  function updatePlaygroundTrigger(value: BingRadioValue) {
    playground.trigger = value as BingAnimatedTextTrigger
  }

  function updateShineDirection(value: BingRadioValue) {
    shineDemo.direction = value as BingAnimatedTextShineDirection
  }

  function toNumber(value: string, fallback: number) {
    const parsed = Number(value)

    return Number.isFinite(parsed) ? parsed : fallback
  }

  const playgroundCode = computed(() => renderExampleCode(playgroundCodeSource, { text: playground.text, effect: playground.effect, trigger: playground.trigger, disabled: playground.disabled }))

  const shineCode = computed(() => renderExampleCode(shineCodeSource, { text: shineDemo.text, shineDirection: shineDemo.direction, shineColor: shineDemo.shineColor, shineBaseColor: shineDemo.shineBaseColor }))

  const jumpCode = computed(() => renderExampleCode(jumpCodeSource, { text: jumpText.value, jumpY: normalizedJumpY.value, jumpStagger: normalizedJumpStagger.value }))

  const disabledCode = computed(() => renderExampleCode(disabledCodeSource, { disabled: disabledDemo.value }))
  return { examplesActive, effectOptions, triggerOptions, shineDirectionOptions, playground, shineDemo, jumpText, jumpY, jumpStagger, disabledDemo, normalizedJumpY, normalizedJumpStagger, updatePlaygroundEffect, updatePlaygroundTrigger, updateShineDirection, toNumber, playgroundCode, shineCode, jumpCode, disabledCode }
}
const key: InjectionKey<ReturnType<typeof createExamples>> = Symbol('animated-text-examples')
export function provideExamples() { provideExampleState(key, createExamples()) }
export function useExamples() {
  const state = injectExampleState(key)
  if (!state) throw new Error('示例需要文档页面提供状态')
  return state
}
