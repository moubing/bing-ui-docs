<script setup lang="ts">
import { ref } from 'vue'
import { BingAnimatedText, BingCheckbox, type BingAnimatedTextProps } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

// @docs-options:start
const options: BingAnimatedTextProps = { "disabled": false }
// @docs-options:end
const disabled = ref(options.disabled ?? false)
</script>

<template>
  <p class="title"><BingAnimatedText effect="shine" trigger="always" :disabled="disabled">动画可以暂停</BingAnimatedText></p>
  <BingCheckbox v-model="disabled" label="禁用扫光" />
</template>

<style scoped>
.title { margin: 0 0 20px; font-size: clamp(1.8rem, 4vw, 3.8rem); font-weight: 400; line-height: 1.4; }
</style>
