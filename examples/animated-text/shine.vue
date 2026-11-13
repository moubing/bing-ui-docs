<script setup lang="ts">
import { BingAnimatedText, type BingAnimatedTextProps } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

type ExampleOptions = BingAnimatedTextProps & { text: string }
// @docs-options:start
const options: ExampleOptions = { "text": "细腻的扫光文字", "shineDirection": "left", "shineColor": "#d4d4d8", "shineBaseColor": "#71717a", "shineSpeed": 2.4, "shineInterval": 1.2 }
// @docs-options:end
</script>

<template>
  <p class="title">
    <BingAnimatedText :follow-pointer="false" effect="shine" trigger="always" :shine-direction="options.shineDirection"
      :shine-color="options.shineColor" :shine-base-color="options.shineBaseColor" :shine-speed="options.shineSpeed" :shine-interval="options.shineInterval">{{ options.text }}</BingAnimatedText>
  </p>
</template>

<style scoped>
.title { margin: 0; font-size: clamp(1.8rem, 4vw, 3.8rem); font-weight: 400; line-height: 1.4; }
</style>
