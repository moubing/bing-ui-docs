<script setup lang="ts">
import { BingButton, BingCheckbox, BingCodeBlock, BingRadioGroup } from '@moubing/bing-ui'
import { useExamples } from './state'
const { directionOptions, sizeOptions, statusOptions, playgroundOptions, playgroundValue, playgroundDirection, playgroundSize, playgroundStatus, playgroundDisabled, selectedLabel, updateDirection, updateSize, updateStatus, selectRecommended, clearExternalValue, playgroundCode } = useExamples()
</script>

<template>
  <div class="doc-example">
    <div class="doc-example__preview radio-group-demo-stage">
      <p class="preview-label">实时预览</p>
      <ClientOnly>
        <BingRadioGroup id="radio-doc-4" name="radio-doc-4"
          v-model="playgroundValue"
          :options="playgroundOptions"
          :direction="playgroundDirection"
          :size="playgroundSize"
          :status="playgroundStatus"
          :disabled="playgroundDisabled"
          aria-label="展示模式"
        />
      </ClientOnly>

      <div class="radio-group-actions">
        <BingButton size="sm" variant="secondary" @click="selectRecommended">
          选择推荐
        </BingButton>
        <BingButton size="sm" variant="ghost" @click="clearExternalValue">
          清空外部值
        </BingButton>
      </div>

      <p class="radio-group-feedback">
        <span>当前值：{{ selectedLabel }}</span>
      </p>
    </div>

    <div class="doc-example__controls">
      <div class="control-group">
        <p class="control-label">排列</p>
        <BingRadioGroup id="radio-doc-5" name="radio-doc-5"
          :model-value="playgroundDirection"
          :options="directionOptions"
          direction="column"
          size="sm"
          aria-label="RadioGroup 排列方向"
          @update:model-value="updateDirection"
        />
      </div>

      <div class="control-group">
        <p class="control-label">尺寸</p>
        <BingRadioGroup id="radio-doc-6" name="radio-doc-6"
          :model-value="playgroundSize"
          :options="sizeOptions"
          direction="row"
          size="sm"
          aria-label="RadioGroup 尺寸"
          @update:model-value="updateSize"
        />
      </div>

      <div class="control-group">
        <p class="control-label">状态</p>
        <BingRadioGroup id="radio-doc-7" name="radio-doc-7"
          :model-value="playgroundStatus"
          :options="statusOptions"
          direction="wrap"
          size="sm"
          aria-label="RadioGroup 状态"
          @update:model-value="updateStatus"
        />
      </div>

      <BingCheckbox v-model="playgroundDisabled" label="禁用整组" />
    </div>
  </div>

  <BingCodeBlock
    :code="playgroundCode"
    language="vue"
    title="代码示例"
    wrap
  />
</template>
