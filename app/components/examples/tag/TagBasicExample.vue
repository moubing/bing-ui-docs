<script setup lang="ts">
import { BingRadio, BingCheckbox, BingCodeBlock, BingInput, BingRadioGroup, BingTag } from '@moubing/bing-ui'
import { useExamples } from './state'
const { sizeOptions, toneOptions, variantOptions, playgroundLabel, playgroundSize, playgroundTone, playgroundVariant, playgroundClosable, playgroundDisabled, closeCount, updateSize, updateTone, updateVariant, handleClose, playgroundCode } = useExamples()
</script>

<template>
  <div class="doc-example">
    <div class="doc-example__preview tag-demo-stage">
      <p class="preview-label">实时预览</p>
      <div class="tag-demo-row">
        <ClientOnly>
          <BingTag
            :label="playgroundLabel"
            :size="playgroundSize"
            :tone="playgroundTone"
            :variant="playgroundVariant"
            :closable="playgroundClosable"
            :disabled="playgroundDisabled"
            @close="handleClose"
          />
        </ClientOnly>
      </div>
      <p class="tag-feedback">
        <span>关闭事件：{{ closeCount }}</span>
      </p>
    </div>

    <div class="doc-example__controls">
      <label class="control-label" for="tag-label">文案</label>
      <BingInput id="tag-label" v-model="playgroundLabel" block clearable />

      <div class="control-group">
        <p class="control-label">尺寸</p>
        <BingRadioGroup id="tag-control-1" name="tag-control-1"
          :model-value="playgroundSize"
          direction="row"
          size="sm"
          aria-label="Tag 尺寸"
          @update:model-value="updateSize">
          <BingRadio v-for="option in sizeOptions" :id="`tag-control-1-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>

      <div class="control-group">
        <p class="control-label">颜色</p>
        <BingRadioGroup id="tag-control-2" name="tag-control-2"
          :model-value="playgroundTone"
          direction="wrap"
          size="sm"
          aria-label="Tag 颜色"
          @update:model-value="updateTone">
          <BingRadio v-for="option in toneOptions" :id="`tag-control-2-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>

      <div class="control-group">
        <p class="control-label">风格</p>
        <BingRadioGroup id="tag-control-3" name="tag-control-3"
          :model-value="playgroundVariant"
          direction="column"
          size="sm"
          aria-label="Tag 风格"
          @update:model-value="updateVariant">
          <BingRadio v-for="option in variantOptions" :id="`tag-control-3-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>

      <BingCheckbox v-model="playgroundClosable" label="可关闭" />
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
