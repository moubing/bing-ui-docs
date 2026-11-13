<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingDropDown, BingDropDownItem, BingTooltip } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const actions = ref(0)
</script>

<template>
  <div class="toolbar" role="toolbar" aria-label="提示工具栏">
    <BingTooltip content="加粗" :shortcut="['Ctrl', 'B']" tone="inverse">
      <BingButton variant="secondary" ariaLabel="加粗" @click="actions++">B</BingButton>
    </BingTooltip>
    <BingTooltip content="斜体" :shortcut="['Ctrl', 'I']" tone="inverse">
      <BingButton variant="secondary" ariaLabel="斜体" @click="actions++">I</BingButton>
    </BingTooltip>
    <BingTooltip content="需要先选择文档">
      <template #default="{ triggerProps }">
        <span v-bind="triggerProps" tabindex="0" aria-label="发布（不可用）"><BingButton disabled>发布</BingButton></span>
      </template>
    </BingTooltip>
    <BingDropDown ariaLabel="工具栏更多操作">
      <template #trigger="{ triggerProps }">
        <BingTooltip content="更多操作">
          <BingButton v-bind="triggerProps" variant="secondary">更多</BingButton>
        </BingTooltip>
      </template>
      <BingDropDownItem title="复制格式" @click="actions++" />
    </BingDropDown>
  </div>
  <p role="status">操作次数：{{ actions }}</p>
</template>

<style scoped>
.toolbar { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
</style>
