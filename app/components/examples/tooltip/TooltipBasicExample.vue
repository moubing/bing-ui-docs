<script setup lang="ts">
import { BingRadio, BingButton, BingCheckbox, BingCodeBlock, BingIcon, BingInput, BingRadioGroup, BingTooltip } from '@moubing/bing-ui'
import { Info } from 'lucide-vue-next'
import { useExamples } from './state'
const { examplesActive, triggerOptions, placementOptions, alignOptions, playgroundRef, playgroundOpen, playgroundContent, playgroundTrigger, playgroundPlacement, playgroundAlign, playgroundOpenDelay, playgroundCloseDelay, playgroundOffset, playgroundMaxWidth, playgroundInteractive, playgroundDisabled, playgroundCloseOnOutside, playgroundCloseOnEsc, lastOpenReason, lastCloseReason, normalizedOpenDelay, normalizedCloseDelay, normalizedOffset, normalizedMaxWidth, updateTrigger, updatePlacement, updateAlign, handlePlaygroundOpen, handlePlaygroundClose, togglePlaygroundTooltip, playgroundCode } = useExamples()
</script>

<template>
  <div class="doc-example doc-example--wide">
    <div class="doc-example__preview tooltip-demo-stage">
      <ClientOnly v-if="examplesActive">
        <BingTooltip
          id="docs-tooltip-basic"
          ref="playgroundRef"
          v-model="playgroundOpen"
          :content="playgroundContent"
          :trigger="playgroundTrigger"
          :placement="playgroundPlacement"
          :align="playgroundAlign"
          :open-delay="normalizedOpenDelay"
          :close-delay="normalizedCloseDelay"
          :offset="normalizedOffset"
          :max-width="normalizedMaxWidth"
          :interactive="playgroundInteractive"
          :disabled="playgroundDisabled"
          :close-on-outside="playgroundCloseOnOutside"
          :close-on-esc="playgroundCloseOnEsc"
          @open="handlePlaygroundOpen"
          @close="handlePlaygroundClose"
        >
          <template #default="{ triggerProps }">
          <BingButton variant="secondary" :throttle="false" v-bind="triggerProps">
            {{ playgroundTrigger === 'manual' ? '被动锚点' : '查看提示' }}
            <template #suffix>
              <BingIcon :icon="Info" :size="16" decorative />
            </template>
          </BingButton>
          </template>
        </BingTooltip>

        <BingButton
          v-if="playgroundTrigger === 'manual'"
          :throttle="false"
          variant="tertiary"
          @click="togglePlaygroundTooltip"
        >
          手动切换
        </BingButton>
      </ClientOnly>

      <p class="tooltip-feedback">
        <span>打开：{{ String(lastOpenReason) }}</span><span>关闭：{{ String(lastCloseReason) }}</span><span>状态：{{ playgroundOpen ? '已打开' : '已关闭' }}</span>
      </p>
    </div>

    <div class="doc-example__controls">
      <label class="control-label" for="tooltip-content">提示内容</label>
      <BingInput id="tooltip-content" v-model="playgroundContent" block clearable />

      <div class="control-group">
        <p class="control-label">触发方式</p>
        <BingRadioGroup id="tooltip-control-1" name="tooltip-control-1"
          :model-value="playgroundTrigger"
          direction="wrap"
          size="sm"
          aria-label="Tooltip 触发方式"
          @update:model-value="updateTrigger">
          <BingRadio v-for="option in triggerOptions" :id="`tooltip-control-1-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>

      <div class="control-group">
        <p class="control-label">位置</p>
        <BingRadioGroup id="tooltip-control-2" name="tooltip-control-2"
          :model-value="playgroundPlacement"
          direction="wrap"
          size="sm"
          aria-label="Tooltip 位置"
          @update:model-value="updatePlacement">
          <BingRadio v-for="option in placementOptions" :id="`tooltip-control-2-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>

      <div class="control-group">
        <p class="control-label">对齐</p>
        <BingRadioGroup id="tooltip-control-3" name="tooltip-control-3"
          :model-value="playgroundAlign"
          direction="wrap"
          size="sm"
          aria-label="Tooltip 对齐"
          @update:model-value="updateAlign">
          <BingRadio v-for="option in alignOptions" :id="`tooltip-control-3-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>

      <div class="inline-control-grid">
        <div>
          <label class="control-label" for="tooltip-open-delay">打开延迟</label>
          <BingInput id="tooltip-open-delay" v-model="playgroundOpenDelay" block />
        </div>
        <div>
          <label class="control-label" for="tooltip-close-delay">关闭延迟</label>
          <BingInput id="tooltip-close-delay" v-model="playgroundCloseDelay" block />
        </div>
        <div>
          <label class="control-label" for="tooltip-offset">偏移</label>
          <BingInput id="tooltip-offset" v-model="playgroundOffset" block />
        </div>
        <div>
          <label class="control-label" for="tooltip-max-width">最大宽度</label>
          <BingInput id="tooltip-max-width" v-model="playgroundMaxWidth" block />
        </div>
      </div>

      <BingCheckbox v-model="playgroundInteractive" label="内容可交互" />
      <BingCheckbox v-model="playgroundCloseOnOutside" label="点击外部关闭" />
      <BingCheckbox v-model="playgroundCloseOnEsc" label="Esc 关闭" />
      <BingCheckbox v-model="playgroundDisabled" label="禁用" />
    </div>
  </div>

  <BingCodeBlock :code="playgroundCode" language="vue" title="代码示例" wrap />
</template>
