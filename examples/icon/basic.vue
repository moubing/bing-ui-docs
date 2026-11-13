<script setup lang="ts">
import { BingIcon, type BingIconProps } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
import { Bell, CheckCircle, CircleAlert, Sparkles, Star } from 'lucide-vue-next'

const icons = { star: Star, sparkles: Sparkles, bell: Bell, alert: CircleAlert, check: CheckCircle }
type DemoOptions = Omit<BingIconProps, 'icon'> & { iconName: keyof typeof icons }
// @docs-options:start
const options: DemoOptions = {
  "iconName": "sparkles",
  "size": "lg",
  "tone": "primary",
  "strokeWidth": 1.75,
  "decorative": true,
  "label": "精选功能"
}
// @docs-options:end
</script>

<template>
  <BingIcon :icon="icons[options.iconName]" :size="options.size" :tone="options.tone"
    :stroke-width="options.strokeWidth" :decorative="options.decorative" :label="options.label" />
</template>
