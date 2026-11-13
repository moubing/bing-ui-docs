<script setup lang="ts">
import { BingCodeBlock, BingTabs } from '@moubing/bing-ui'
import { useTabsExamples } from './state'
const { activeValue, tabsItems, handleFocus, handleBlur, handleChange, focusLog, activeItem, activationCode } = useTabsExamples()
</script>

<template>
  <div class="doc-example">
    <div class="doc-example__preview tabs-demo-stage">
      <ClientOnly>
        <BingTabs
          v-model="activeValue"
          :items="tabsItems"
          activation="manual"
          :loop="false"
          variant="soft"
          aria-label="手动激活示例"
          @focus="handleFocus"
          @blur="handleBlur"
          @change="handleChange"
        />
      </ClientOnly>

      <p class="tabs-feedback">
        <span>{{ focusLog }}</span><span>当前：{{ activeItem?.label }}</span>
      </p>
    </div>

    <div class="doc-example__controls">
      <p>
        这个示例关闭了 <code>loop</code>，因此方向键到达首尾后不会循环。禁用项仍会被跳过。
      </p>
    </div>
  </div>

  <BingCodeBlock :code="activationCode" language="vue" title="代码示例" wrap />
</template>
