<script setup lang="ts">
import { BingCodeBlock, BingTabs } from '@moubing/bing-ui'
import { useTabsExamples } from './state'
const { richValue, richItems, getRichTone, getRichCount, richActiveItem, richCode } = useTabsExamples()
</script>

<template>
  <div class="doc-example">
    <div class="doc-example__preview tabs-demo-stage">
      <ClientOnly>
        <BingTabs v-model="richValue" :items="richItems" variant="glass" aria-label="任务阶段">
          <template #item="{ item, active, disabled }">
            <span class="tabs-dot" :style="{ background: getRichTone(item) }"></span>
            <span>{{ item.label }}</span>
            <small class="tabs-count">{{ getRichCount(item) }}</small>
            <span v-if="active" class="tabs-state">当前</span>
            <span v-if="disabled" class="tabs-state">不可选</span>
          </template>
        </BingTabs>
      </ClientOnly>

      <div class="tabs-panel">
        <strong>{{ richActiveItem?.label }}</strong>
        <span>数量：{{ richActiveItem?.count }}。禁用项仍会出现在列表里，但不会参与切换。</span>
      </div>
    </div>

    <div class="doc-example__controls">
      <p>
        自定义插槽只负责 tab 内部内容；外层 button、role、aria-selected、键盘事件和禁用逻辑仍由 BingTabs 管理。
      </p>
    </div>
  </div>

  <BingCodeBlock :code="richCode" language="vue" title="代码示例" wrap />
</template>
