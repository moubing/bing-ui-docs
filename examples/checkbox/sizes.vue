<script setup lang="ts">
import { ref } from 'vue'
import { BingCheckbox } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const small = ref(false)
const medium = ref(false)
const large = ref(false)
const custom = ref(true)
</script>

<template>
  <div class="sizes">
    <BingCheckbox v-model="small" size="sm" label="小尺寸" />
    <BingCheckbox v-model="medium" size="md" tone="secondary" label="辅助色" />
    <BingCheckbox v-model="large" size="lg" shape="circle" label="大尺寸圆形" />
    <BingCheckbox v-model="custom" :size="34" label="自定义 34px" />
  </div>
</template>

<style scoped>
.sizes { display: flex; flex-wrap: wrap; gap: 16px; align-items: center; }
</style>
