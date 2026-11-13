<script setup lang="ts">
import { BingCheckbox, BingCodeBlock, BingInput, BingRadioGroup } from '@moubing/bing-ui'
import { useExamples } from './state'
const { sizeOptions, shapeOptions, toneOptions, statusOptions, playgroundValue, playgroundLabel, playgroundSize, playgroundShape, playgroundTone, playgroundStatus, playgroundIndeterminate, playgroundDisabled, updateSize, updateShape, updateTone, updateStatus, playgroundCode } = useExamples()
</script>

<template>
  <div class="doc-example">
    <div class="doc-example__preview checkbox-demo-stage">
      <p class="preview-label">实时预览</p>
      <ClientOnly>
        <BingCheckbox
          v-model="playgroundValue"
          :label="playgroundLabel"
          :size="playgroundSize"
          :shape="playgroundShape"
          :tone="playgroundTone"
          :status="playgroundStatus"
          :indeterminate="playgroundIndeterminate"
          :disabled="playgroundDisabled"
        />
      </ClientOnly>
      <p class="checkbox-feedback">
        <span>当前值：{{ playgroundValue ? 'true' : 'false' }}</span><span>半选：{{ playgroundIndeterminate ? 'true' : 'false' }}</span>
      </p>
    </div>

    <div class="doc-example__controls">
      <label class="control-label" for="checkbox-label">标签</label>
      <BingInput id="checkbox-label" v-model="playgroundLabel" block clearable />

      <div class="control-group">
        <p class="control-label">尺寸</p>
        <BingRadioGroup id="checkbox-control-1" name="checkbox-control-1"
          :model-value="playgroundSize"
          :options="sizeOptions"
          direction="row"
          size="sm"
          aria-label="Checkbox 尺寸"
          @update:model-value="updateSize"
        />
      </div>

      <div class="control-group">
        <p class="control-label">形状</p>
        <BingRadioGroup id="checkbox-control-2" name="checkbox-control-2"
          :model-value="playgroundShape"
          :options="shapeOptions"
          direction="row"
          size="sm"
          aria-label="Checkbox 形状"
          @update:model-value="updateShape"
        />
      </div>

      <div class="control-group">
        <p class="control-label">颜色</p>
        <BingRadioGroup id="checkbox-control-3" name="checkbox-control-3"
          :model-value="playgroundTone"
          :options="toneOptions"
          direction="row"
          size="sm"
          aria-label="Checkbox 颜色"
          @update:model-value="updateTone"
        />
      </div>

      <div class="control-group">
        <p class="control-label">状态</p>
        <BingRadioGroup id="checkbox-control-4" name="checkbox-control-4"
          :model-value="playgroundStatus"
          :options="statusOptions"
          direction="wrap"
          size="sm"
          aria-label="Checkbox 状态"
          @update:model-value="updateStatus"
        />
      </div>

      <BingCheckbox v-model="playgroundIndeterminate" label="半选态" />
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
