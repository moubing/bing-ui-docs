<script setup lang="ts">
import { BingButton, BingCheckbox, BingCheckboxGroup, BingCodeBlock, BingRadioGroup } from '@moubing/bing-ui'
import { useExamples } from './state'
const { directionOptions, sizeOptions, statusOptions, playgroundOptions, playgroundValue, playgroundDirection, playgroundSize, playgroundStatus, playgroundDisabled, selectedLabel, updateDirection, updateSize, updateStatus, selectAllPlayground, clearPlayground, playgroundCode } = useExamples()
</script>

<template>
  <div class="doc-example">
    <div class="doc-example__preview checkbox-group-demo-stage">
      <p class="preview-label">实时预览</p>
      <ClientOnly>
        <BingCheckboxGroup id="checkbox-doc-5" name="checkbox-doc-5"
          v-model="playgroundValue"
          :options="playgroundOptions"
          :direction="playgroundDirection"
          :size="playgroundSize"
          :status="playgroundStatus"
          :disabled="playgroundDisabled"
          aria-label="功能开关选项"
        />
      </ClientOnly>

      <div class="checkbox-group-actions">
        <BingButton size="sm" variant="secondary" @click="selectAllPlayground">
          全选可用项
        </BingButton>
        <BingButton size="sm" variant="ghost" @click="clearPlayground">
          清空
        </BingButton>
      </div>

      <p class="checkbox-group-feedback">
        <span>当前值：{{ selectedLabel }}</span>
      </p>
    </div>

    <div class="doc-example__controls">
      <div class="control-group">
        <p class="control-label">排列</p>
        <BingRadioGroup id="checkbox-doc-6" name="checkbox-doc-6"
          :model-value="playgroundDirection"
          :options="directionOptions"
          direction="column"
          size="sm"
          aria-label="CheckboxGroup 排列方向"
          @update:model-value="updateDirection"
        />
      </div>

      <div class="control-group">
        <p class="control-label">尺寸</p>
        <BingRadioGroup id="checkbox-doc-7" name="checkbox-doc-7"
          :model-value="playgroundSize"
          :options="sizeOptions"
          direction="row"
          size="sm"
          aria-label="CheckboxGroup 尺寸"
          @update:model-value="updateSize"
        />
      </div>

      <div class="control-group">
        <p class="control-label">状态</p>
        <BingRadioGroup id="checkbox-doc-8" name="checkbox-doc-8"
          :model-value="playgroundStatus"
          :options="statusOptions"
          direction="wrap"
          size="sm"
          aria-label="CheckboxGroup 状态"
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
