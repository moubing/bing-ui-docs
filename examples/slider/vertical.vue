<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingSlider } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const volume = ref(40)
const range = ref<[number, number]>([20, 80])
</script>
<template>
  <div class="slider-vertical-demo">
    <div class="slider-vertical-demo__tracks">
      <BingSlider v-model="volume" orientation="vertical" :reset-value="40" tooltip="always" :format-tooltip="value => value + '%'" ariaLabel="竖向音量" />
      <BingSlider v-model="range" range orientation="vertical" :reset-value="[20, 80]" :thumb-aria-labels="['竖向下限', '竖向上限']" :min-distance="10" tooltip="auto" />
    </div>
    <p>向上增大，双击滑块恢复；越过边缘持续按住，再松手观察弹性。</p>
    <BingButton variant="secondary" @click="volume = 40; range = [20, 80]">恢复默认</BingButton>
    <p role="status">音量 {{ volume }}；范围 {{ range.join('–') }}</p>
  </div>
</template>
<style scoped>
.slider-vertical-demo { display: grid; gap: 16px; }
.slider-vertical-demo__tracks { display: flex; gap: 80px; padding: 24px 0 12px 56px; }
</style>
