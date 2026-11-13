<script setup lang="ts">
import { BingCheckbox, BingCodeBlock, BingRadioGroup, BingTabs } from '@moubing/bing-ui'
import { useTabsExamples } from './state'
const { activeValue, tabsItems, playgroundSize, playgroundVariant, playgroundActivation, playgroundBlock, playgroundLoop, playgroundAnimated, playgroundDisabled, handleChange, handleFocus, handleBlur, activeItem, eventLog, focusLog, variantOptions, sizeOptions, activationOptions, updateVariant, updateSize, updateActivation, playgroundCode } = useTabsExamples()
</script>

<template>
  <div class="doc-example doc-example--wide">
    <div class="doc-example__preview tabs-demo-stage">
      <ClientOnly>
        <BingTabs
          v-model="activeValue"
          :items="tabsItems"
          :size="playgroundSize"
          :variant="playgroundVariant"
          :activation="playgroundActivation"
          :block="playgroundBlock"
          :loop="playgroundLoop"
          :animated="playgroundAnimated"
          :disabled="playgroundDisabled"
          aria-label="文档分组"
          @change="handleChange"
          @focus="handleFocus"
          @blur="handleBlur"
        />
      </ClientOnly>

      <div class="tabs-panel">
        <strong>{{ activeItem?.label }}</strong>
        <span>
          当前 value：<code>{{ activeValue }}</code>。这里的内容区域不是 Tabs 内置的 panel，
          而是根据 active value 渲染出来的业务内容。
        </span>
      </div>

      <p class="tabs-feedback">
        <span>切换：{{ eventLog }}</span><span>{{ focusLog }}</span>
      </p>
    </div>

    <div class="doc-example__controls">
      <div class="control-group">
        <p class="control-label">样式</p>
        <BingRadioGroup
          :model-value="playgroundVariant"
          :options="variantOptions"
          direction="wrap"
          size="sm"
          aria-label="Tabs 样式"
          @update:model-value="updateVariant"
        />
      </div>

      <div class="control-group">
        <p class="control-label">尺寸</p>
        <BingRadioGroup
          :model-value="playgroundSize"
          :options="sizeOptions"
          direction="row"
          size="sm"
          aria-label="Tabs 尺寸"
          @update:model-value="updateSize"
        />
      </div>

      <div class="control-group">
        <p class="control-label">键盘激活</p>
        <BingRadioGroup
          :model-value="playgroundActivation"
          :options="activationOptions"
          direction="wrap"
          size="sm"
          aria-label="Tabs 键盘激活方式"
          @update:model-value="updateActivation"
        />
      </div>

      <BingCheckbox v-model="playgroundBlock" label="撑满容器" />
      <BingCheckbox v-model="playgroundLoop" label="方向键循环" />
      <BingCheckbox v-model="playgroundAnimated" label="指示器动画" />
      <BingCheckbox v-model="playgroundDisabled" label="禁用全部" />
    </div>
  </div>

  <BingCodeBlock :code="playgroundCode" language="vue" title="代码示例" wrap />
</template>
