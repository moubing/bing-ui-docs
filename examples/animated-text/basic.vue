<script setup lang="ts">
import { BingAnimatedText, type BingAnimatedTextProps } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

type ExampleOptions = BingAnimatedTextProps & { text: string }
// @docs-options:start
const options: ExampleOptions = { "text": "让文字动起来", "effect": "shine", "trigger": "always", "disabled": false }
// @docs-options:end
</script>

<template>
  <p class="title">
    <BingAnimatedText :effect="options.effect" :trigger="options.trigger" :disabled="options.disabled">{{ options.text }}</BingAnimatedText>
  </p>
</template>

<style scoped>
.title { margin: 0; color: inherit; font-size: clamp(1.8rem, 4vw, 3.8rem); font-weight: 400; line-height: 1.4; }
</style>
