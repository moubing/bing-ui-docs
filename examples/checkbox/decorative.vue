<script setup lang="ts">
import { BingCheckbox } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
</script>

<template>
  <div class="markers">
    <BingCheckbox decorative :model-value="false" size="sm" />
    <BingCheckbox decorative :model-value="true" size="md" />
    <BingCheckbox decorative :model-value="false" indeterminate size="lg" tone="secondary" />
    <BingCheckbox decorative :model-value="true" shape="circle" :size="34" />
  </div>
  <p>以上只读标记没有原生 input，也不会参与表单提交、焦点或点击切换。实际操作与可访问名称由外部交互容器提供。</p>
</template>

<style scoped>
.markers { display: flex; gap: 16px; align-items: center; }
</style>
