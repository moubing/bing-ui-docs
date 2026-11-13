import { computed, markRaw, ref } from 'vue'
import { Bell, CheckCircle, CircleAlert, Sparkles, Star } from 'lucide-vue-next'
import type { BingIconTone, BingRadioValue } from '@moubing/bing-ui'
import playgroundCodeSource from '~~/examples/icon/basic.vue?raw'
import sizeCodeSource from '~~/examples/icon/sizes.vue?raw'
import toneCodeSource from '~~/examples/icon/tones.vue?raw'
import accessibilityCodeSource from '~~/examples/icon/accessibility.vue?raw'
import { renderExampleCode } from '#shared/docs/example-code'
import { inject as injectExampleState, provide as provideExampleState, type InjectionKey } from 'vue'

function createExamples() {
  type RadioOption<T extends string> = {
    label: string
    value: T
    description?: string
  }

  type IconName = 'star' | 'sparkles' | 'bell' | 'alert' | 'check'

  type IconSizeToken = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

  type StrokeWidthValue = '1.5' | '1.75' | '2' | '2.5'

  const iconMap = {
    star: markRaw(Star),
    sparkles: markRaw(Sparkles),
    bell: markRaw(Bell),
    alert: markRaw(CircleAlert),
    check: markRaw(CheckCircle),
  } as const

  const iconOptions: RadioOption<IconName>[] = [
    { label: 'Star', value: 'star', description: '常用于收藏、推荐。' },
    { label: 'Sparkles', value: 'sparkles', description: '常用于高亮、AI、增强。' },
    { label: 'Bell', value: 'bell', description: '常用于通知、提醒。' },
    { label: 'Alert', value: 'alert', description: '常用于警告、异常。' },
    { label: 'Check', value: 'check', description: '常用于成功、完成。' },
  ]

  const sizeOptions: RadioOption<IconSizeToken>[] = [
    { label: 'xs', value: 'xs' },
    { label: 'sm', value: 'sm' },
    { label: 'md', value: 'md' },
    { label: 'lg', value: 'lg' },
    { label: 'xl', value: 'xl' },
  ]

  const toneOptions: RadioOption<BingIconTone>[] = [
    { label: 'inherit', value: 'inherit', description: '继承当前文字颜色。' },
    { label: 'muted', value: 'muted', description: '弱化辅助图标。' },
    { label: 'primary', value: 'primary', description: '强调主操作或重点状态。' },
    { label: 'secondary', value: 'secondary', description: '次级品牌色。' },
    { label: 'danger', value: 'danger', description: '错误或危险动作。' },
    { label: 'success', value: 'success', description: '成功或完成状态。' },
    { label: 'warning', value: 'warning', description: '警告或待确认状态。' },
  ]

  const strokeOptions: RadioOption<StrokeWidthValue>[] = [
    { label: '1.5', value: '1.5' },
    { label: '1.75', value: '1.75' },
    { label: '2', value: '2' },
    { label: '2.5', value: '2.5' },
  ]

  const tokenSizes: IconSizeToken[] = ['xs', 'sm', 'md', 'lg', 'xl']

  const toneValues: BingIconTone[] = ['inherit', 'muted', 'primary', 'secondary', 'danger', 'success', 'warning']

  const playgroundIconName = ref<IconName>('sparkles')

  const playgroundSize = ref<IconSizeToken>('lg')

  const playgroundTone = ref<BingIconTone>('primary')

  const playgroundStrokeWidth = ref<StrokeWidthValue>('1.75')

  const playgroundDecorative = ref(true)

  const playgroundLabel = ref('精选功能')

  const playgroundIcon = computed(() => iconMap[playgroundIconName.value])

  const normalizedStrokeWidth = computed(() => Number(playgroundStrokeWidth.value))

  const renderedAsDecorative = computed(() => playgroundDecorative.value || !playgroundLabel.value)

  const ariaSummary = computed(() => {
    if (renderedAsDecorative.value) {
      return '当前图标会渲染 aria-hidden="true"，屏幕阅读器会忽略它。'
    }

    return `当前图标会渲染 role="img" 和 aria-label="${playgroundLabel.value}"。`
  })

  const iconImportName = computed(() => {
    const names: Record<IconName, string> = {
      star: 'Star',
      sparkles: 'Sparkles',
      bell: 'Bell',
      alert: 'CircleAlert',
      check: 'CheckCircle',
    }

    return names[playgroundIconName.value]
  })

  function updateIcon(value: BingRadioValue) {
    playgroundIconName.value = value as IconName
  }

  function updateSize(value: BingRadioValue) {
    playgroundSize.value = value as IconSizeToken
  }

  function updateTone(value: BingRadioValue) {
    playgroundTone.value = value as BingIconTone
  }

  function updateStrokeWidth(value: BingRadioValue) {
    playgroundStrokeWidth.value = String(value) as StrokeWidthValue
  }

  const playgroundCode = computed(() => renderExampleCode(playgroundCodeSource, { iconName: playgroundIconName.value, size: playgroundSize.value, tone: playgroundTone.value, strokeWidth: normalizedStrokeWidth.value, decorative: playgroundDecorative.value, label: playgroundLabel.value }))

  const sizeCode = sizeCodeSource.trim()

  const toneCode = toneCodeSource.trim()

  const accessibilityCode = accessibilityCodeSource.trim()
  return { iconMap, iconOptions, sizeOptions, toneOptions, strokeOptions, tokenSizes, toneValues, playgroundIconName, playgroundSize, playgroundTone, playgroundStrokeWidth, playgroundDecorative, playgroundLabel, playgroundIcon, normalizedStrokeWidth, renderedAsDecorative, ariaSummary, iconImportName, updateIcon, updateSize, updateTone, updateStrokeWidth, playgroundCode, sizeCode, toneCode, accessibilityCode }
}
const key: InjectionKey<ReturnType<typeof createExamples>> = Symbol('icon-examples')
export function provideExamples() { provideExampleState(key, createExamples()) }
export function useExamples() {
  const state = injectExampleState(key)
  if (!state) throw new Error('示例需要文档页面提供状态')
  return state
}
