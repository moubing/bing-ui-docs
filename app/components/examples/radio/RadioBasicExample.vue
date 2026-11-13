<script setup lang="ts">
import { BingCheckbox, BingCodeBlock, BingInput, BingRadio, BingRadioGroup } from '@moubing/bing-ui'
import { useExamples } from './state'
const { sizeOptions, statusOptions, playgroundModel, playgroundValue, playgroundLabel, playgroundDescription, playgroundSize, playgroundStatus, playgroundDisabled, playgroundChecked, updateSize, updateStatus, playgroundCode } = useExamples()
</script>

<template>
  <div class="doc-example">
    <div class="doc-example__preview radio-demo-stage">
      <p class="preview-label">实时预览</p>
      <ClientOnly>
        <BingRadio
          id="radio-doc-mode"
          name="radio-doc-mode"
          v-model="playgroundModel"
          :value="playgroundValue"
          :label="playgroundLabel"
          :description="playgroundDescription"
          :size="playgroundSize"
          :status="playgroundStatus"
          :disabled="playgroundDisabled"
        />
      </ClientOnly>
      <p class="radio-feedback">
        <span>modelValue：{{ playgroundModel }}</span><span>value：{{ playgroundValue }}</span><span>{{ playgroundChecked ? '当前项已选中' : '当前项未选中' }}</span>
      </p>
    </div>

    <div class="doc-example__controls">
      <label class="control-label" for="radio-label">主文案</label>
      <BingInput id="radio-label" v-model="playgroundLabel" block clearable />

      <label class="control-label" for="radio-description">描述</label>
      <BingInput id="radio-description" v-model="playgroundDescription" block clearable />

      <label class="control-label" for="radio-value">value</label>
      <BingInput id="radio-value" v-model="playgroundValue" block clearable />

      <div class="control-group">
        <p class="control-label">尺寸</p>
        <BingRadioGroup
          id="radio-size-control"
          name="radio-size-control"
          :model-value="playgroundSize"
          direction="row"
          size="sm"
          aria-label="Radio 尺寸"
          @update:model-value="updateSize"
        >
          <BingRadio v-for="option in sizeOptions" :id="`radio-size-control-${option.value}`" :key="option.value" :value="option.value" :label="option.label" />
        </BingRadioGroup>
      </div>

      <div class="control-group">
        <p class="control-label">状态</p>
        <BingRadioGroup
          id="radio-status-control"
          name="radio-status-control"
          :model-value="playgroundStatus"
          direction="wrap"
          size="sm"
          aria-label="Radio 状态"
          @update:model-value="updateStatus"
        >
          <BingRadio v-for="option in statusOptions" :id="`radio-status-control-${option.value}`" :key="option.value" :value="option.value" :label="option.label" :description="option.description" />
        </BingRadioGroup>
      </div>

      <BingCheckbox v-model="playgroundDisabled" label="禁用" />
    </div>
  </div>

  <BingCodeBlock
    :code="playgroundCode"
    language="vue"
    title="代码示例"
    wrap
  />
</template>
