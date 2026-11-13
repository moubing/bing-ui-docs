<script setup lang="ts">
import { BingButton, BingCodeBlock, BingTabs } from '@moubing/bing-ui'
import { useTabsExamples } from './state'
const { pillValue, glassValue, softValue, tabsItems, variantsCode } = useTabsExamples()
</script>

<template>
  <div class="doc-example">
    <div class="doc-example__preview tabs-variant-stack">
      <ClientOnly>
        <div class="tabs-toolbar">
          <span class="tabs-toolbar__label">REQ-11</span>
          <BingTabs v-model="pillValue" :items="tabsItems" variant="pill" size="sm" ariaLabel="pill 样式" />
          <BingButton size="sm">保存版本</BingButton>
        </div>
        <div class="tabs-toolbar">
          <span class="tabs-toolbar__label">REQ-11</span>
          <BingTabs v-model="glassValue" :items="tabsItems" variant="glass" ariaLabel="glass 样式" />
          <BingButton size="sm">保存版本</BingButton>
        </div>
        <div class="tabs-toolbar">
          <span class="tabs-toolbar__label">REQ-11</span>
          <BingTabs v-model="softValue" :items="tabsItems" variant="soft" size="lg" ariaLabel="soft 样式" />
          <BingButton size="sm">保存版本</BingButton>
        </div>
      </ClientOnly>
    </div>

    <div class="doc-example__controls">
      <p>
        三种尺寸均与编号、按钮垂直居中；横向溢出不会改变整体高度。各组选中值独立，方向键会跳过禁用项。
      </p>
    </div>
  </div>

  <BingCodeBlock :code="variantsCode" language="vue" title="代码示例" wrap />
</template>

<style scoped>
.tabs-toolbar { display: flex; align-items: center; gap: 12px; min-width: 0; }
.tabs-toolbar__label { flex-shrink: 0; font-size: 12px; line-height: 18px; }
.tabs-toolbar > .bing-button { flex-shrink: 0; margin-left: auto; }
</style>
