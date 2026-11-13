<script setup lang="ts">
import { BingRadio, BingCheckbox, BingCodeBlock, BingIcon, BingInput, BingRadioGroup } from '@moubing/bing-ui'
import { useExamples } from './state'
const { iconOptions, sizeOptions, toneOptions, strokeOptions, playgroundIconName, playgroundSize, playgroundTone, playgroundStrokeWidth, playgroundDecorative, playgroundLabel, playgroundIcon, normalizedStrokeWidth, ariaSummary, iconImportName, updateIcon, updateSize, updateTone, updateStrokeWidth, playgroundCode } = useExamples()
</script>

<template>
  <div class="doc-example">
    <div class="doc-example__preview icon-demo-stage">
      <p class="preview-label">实时预览</p>
      <div class="icon-preview-frame">
        <ClientOnly>
          <BingIcon
            :icon="playgroundIcon"
            :size="playgroundSize"
            :tone="playgroundTone"
            :stroke-width="normalizedStrokeWidth"
            :decorative="playgroundDecorative"
            :label="playgroundLabel"
          />
        </ClientOnly>
      </div>
      <p class="icon-feedback">
        <span>图标：{{ iconImportName }}</span><span>尺寸：{{ playgroundSize }}</span><span>色调：{{ playgroundTone }}</span><span>{{ ariaSummary }}</span>
      </p>
    </div>

    <div class="doc-example__controls">
      <div class="control-group">
        <p class="control-label">图标</p>
        <BingRadioGroup id="icon-control-1" name="icon-control-1"
          :model-value="playgroundIconName"
          direction="wrap"
          size="sm"
          aria-label="图标类型"
          @update:model-value="updateIcon">
          <BingRadio v-for="option in iconOptions" :id="`icon-control-1-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>

      <div class="control-group">
        <p class="control-label">尺寸</p>
        <BingRadioGroup id="icon-control-2" name="icon-control-2"
          :model-value="playgroundSize"
          direction="row"
          size="sm"
          aria-label="图标尺寸"
          @update:model-value="updateSize">
          <BingRadio v-for="option in sizeOptions" :id="`icon-control-2-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>

      <div class="control-group">
        <p class="control-label">色调</p>
        <BingRadioGroup id="icon-control-3" name="icon-control-3"
          :model-value="playgroundTone"
          direction="wrap"
          size="sm"
          aria-label="图标色调"
          @update:model-value="updateTone">
          <BingRadio v-for="option in toneOptions" :id="`icon-control-3-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>

      <div class="control-group">
        <p class="control-label">描边</p>
        <BingRadioGroup id="icon-control-4" name="icon-control-4"
          :model-value="playgroundStrokeWidth"
          direction="row"
          size="sm"
          aria-label="图标描边"
          @update:model-value="updateStrokeWidth">
          <BingRadio v-for="option in strokeOptions" :id="`icon-control-4-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>

      <BingCheckbox v-model="playgroundDecorative" label="装饰性图标" />

      <label class="control-label" for="icon-label">可访问名称</label>
      <BingInput id="icon-label" v-model="playgroundLabel" block clearable />
    </div>
  </div>

  <BingCodeBlock
    :code="playgroundCode"
    language="vue"
    title="代码示例"
    wrap
  />
</template>
