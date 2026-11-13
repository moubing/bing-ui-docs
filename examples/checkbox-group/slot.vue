<script setup lang="ts">
import { ref } from 'vue'
import { BingCheckbox, BingCheckboxGroup } from '@moubing/bing-ui'
import type { BingCheckboxGroupValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const selected = ref<BingCheckboxGroupValue[]>(['design'])
</script>

<template>
  <!-- 默认插槽会替代 options；子 Checkbox 只需提供 value，无需各自绑定 v-model。 -->
  <BingCheckboxGroup id="checkbox-doc-10"
    v-model="selected" direction="column" name="review-scope" ariaLabel="评审范围"
    :options="[{ label: '这项不会显示', value: 'unused' }]"
  >
    <BingCheckbox value="design">
      <span class="rich-option"><strong>设计走查</strong><span>检查状态、间距和可访问名称。</span></span>
    </BingCheckbox>
    <BingCheckbox value="api">
      <span class="rich-option"><strong>API 对齐</strong><span>确认 props、slots 和 events 都有文档。</span></span>
    </BingCheckbox>
    <BingCheckbox value="demo">
      <span class="rich-option"><strong>示例验证</strong><span>保证示例能直接体现组件能力。</span></span>
    </BingCheckbox>
  </BingCheckboxGroup>
  <p role="status">已选择：{{ selected.join('、') }}</p>
</template>

<style scoped>
.rich-option { display: grid; gap: 4px; }
.rich-option > span { font-size: 13px; }
</style>
