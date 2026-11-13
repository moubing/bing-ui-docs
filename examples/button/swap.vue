<script setup lang="ts">
import { ref } from 'vue'
import { BingButton } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const copied = ref(false)
const following = ref(false)
</script>

<template>
  <div class="buttons">
    <BingButton variant="tertiary" text-swap text-effect="none" @click="copied = !copied">{{ copied ? '已复制' : '复制链接' }}</BingButton>
    <BingButton variant="secondary" text-swap text-effect="none" @click="following = !following">{{ following ? '已关注' : '关注' }}</BingButton>
    <BingButton text-effect="jump" text-effect-trigger="hover" size="lg">整个按钮都能感应</BingButton>
  </div>
</template>

<style scoped>
.buttons { display: flex; flex-wrap: wrap; align-items: center; gap: 16px; }
</style>
