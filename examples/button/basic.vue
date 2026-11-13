<script setup lang="ts">
import { BingButton } from '@moubing/bing-ui'
import type { BingButtonProps } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

type DemoOptions = BingButtonProps & { label: string }
// @docs-options:start
const options: DemoOptions = {
  "label": "提交订单",
  "variant": "primary",
  "size": "md",
  "rounded": "md",
  "loading": false,
  "disabled": false,
  "block": false
}
// @docs-options:end

// label 是示例的文字参数；BingButton 的文字通过默认插槽传入。
const { label, ...buttonProps } = options
</script>

<template>
  <BingButton v-bind="buttonProps">{{ label }}</BingButton>
</template>
