<script setup lang="ts">
import { BingAnimatedText, type BingAnimatedTextProps } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

type ExampleOptions = BingAnimatedTextProps & { text: string }
// @docs-options:start
const options: ExampleOptions = { "text": "悬停让每个字符跳动", "jumpY": -10, "jumpStagger": 0.028, "jumpDuration": 0.36 }
// @docs-options:end
</script>

<template>
  <p class="title">
    <BingAnimatedText effect="jump" trigger="hover" :jump-y="options.jumpY"
      :jump-stagger="options.jumpStagger" :jump-duration="options.jumpDuration">{{ options.text }}</BingAnimatedText>
  </p>
</template>

<style scoped>
.title { margin: 0; font-size: clamp(1.8rem, 4vw, 3.8rem); font-weight: 400; line-height: 1.4; }
</style>
