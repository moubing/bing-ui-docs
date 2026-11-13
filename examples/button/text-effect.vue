<script setup lang="ts">
import { BingButton } from '@moubing/bing-ui'
import type { BingButtonProps } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

type DemoOptions = BingButtonProps & { label: string; customShine: boolean }
// @docs-options:start
const options: DemoOptions = {
  "label": "悬停看看动效",
  "variant": "primary",
  "textEffect": "jump",
  "textEffectTrigger": "hover",
  "customShine": false,
  "shineColor": "#ffffff",
  "shineBaseColor": "#71717a",
  "textJumpY": -7,
  "textJumpStagger": 0.04
}
// @docs-options:end
const { label, customShine, shineColor, shineBaseColor, ...props } = options
const buttonProps: BingButtonProps = {
  ...props,
  shineColor: customShine ? shineColor : undefined,
  shineBaseColor: customShine ? shineBaseColor : undefined,
}
</script>

<template>
  <BingButton v-bind="buttonProps">{{ label }}</BingButton>
</template>
