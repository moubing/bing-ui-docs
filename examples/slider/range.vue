<script setup lang="ts">
import { ref } from 'vue'
import { BingSlider, type BingSliderMark } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const range = ref<[number, number]>([20, 70])
const level = ref(50)
const marks: BingSliderMark[] = [{ value: 0, label: '低' }, { value: 25, label: '舒适' }, { value: 50, label: '标准' }, { value: 100, label: '高' }]
const submitted = ref('尚未提交')
</script>
<template>
  <div class="slider-range-demo">
    <BingSlider v-model="range" range name="budget" :thumb-aria-labels="['预算下限', '预算上限']" :min-distance="10" tooltip="always" :format-tooltip="value => value + ' 元'" @change="submitted = JSON.stringify($event)" />
    <p role="status">预算 {{ range[0] }}–{{ range[1] }}；最终提交：{{ submitted }}</p>
    <BingSlider v-model="level" :marks="marks" snap-to-marks tooltip="auto" ariaLabel="离散档位" />
    <BingSlider :default-value="35" size="sm" status="success" ariaLabel="小尺寸成功状态" />
    <BingSlider :default-value="55" size="lg" status="warning" ariaLabel="大尺寸警告状态" />
    <BingSlider :default-value="65" disabled ariaLabel="禁用滑块" />
  </div>
</template>
<style scoped>
.slider-range-demo { display: grid; gap: 24px; padding: 36px 8px 12px; min-width: 0; }
</style>
