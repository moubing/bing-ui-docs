<script setup lang="ts">
import { ref } from 'vue'
import { BingRadio, BingRadioGroup } from '@moubing/bing-ui'
import type { BingRadioValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const scope = ref<BingRadioValue | null>('api')
</script>

<template>
  <!-- 默认插槽替代 options；子 Radio 只提供 value，不分别绑定 v-model。 -->
  <BingRadioGroup
    v-model="scope" direction="column" id="doc-scope" name="doc-scope" ariaLabel="文档范围"
    :options="[{ label: '这项不会显示', value: 'unused' }]"
  >
    <BingRadio value="usage">
      <span class="rich-option"><strong>使用说明</strong><span>先解释组件解决什么问题。</span></span>
    </BingRadio>
    <BingRadio value="api">
      <span class="rich-option"><strong>API 表格</strong><span>集中列出 props、slots 和 events。</span></span>
    </BingRadio>
    <BingRadio value="demo">
      <span class="rich-option"><strong>交互示例</strong><span>用真实组件演示变化。</span></span>
    </BingRadio>
  </BingRadioGroup>
  <p role="status">当前值：{{ scope }}</p>
</template>

<style scoped>
.rich-option { display: grid; gap: 4px; }
.rich-option > span { font-size: 13px; }
</style>
