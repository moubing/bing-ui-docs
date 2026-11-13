<script setup lang="ts">
import { BingRadio, BingCheckbox, BingCodeBlock, BingImage, BingRadioGroup } from '@moubing/bing-ui'
import { useExamples } from './state'
const { examplesActive, photoSrc, fitOptions, radiusOptions, positionOptions, playgroundFit, playgroundRadius, playgroundPosition, playgroundBlock, playgroundPreview, playgroundStatus, playgroundLoadInfo, updateFit, updateRadius, updatePosition, handlePlaygroundStatus, handlePlaygroundLoad, playgroundCode } = useExamples()
</script>

<template>
  <div class="doc-example">
    <div class="doc-example__preview image-demo-stage">
      <p class="preview-label">实时预览</p>
      <ClientOnly v-if="examplesActive">
        <BingImage
          :src="photoSrc"
          alt="组件封面图"
          width="100%"
          aspect-ratio="16 / 9"
          :fit="playgroundFit"
          :position="playgroundPosition"
          :radius="playgroundRadius"
          :block="playgroundBlock"
          :preview="playgroundPreview"
          preview-aria-label="预览组件封面图"
          @status-change="handlePlaygroundStatus"
          @load="handlePlaygroundLoad"
        />
      </ClientOnly>
      <p class="image-feedback">
        <span>状态：{{ playgroundStatus }}</span><span>原始尺寸：{{ playgroundLoadInfo }}</span><span>fit：{{ playgroundFit }}</span><span>radius：{{ playgroundRadius }}</span>
      </p>
    </div>

    <div class="doc-example__controls">
      <div class="control-group">
        <p class="control-label">裁剪</p>
        <BingRadioGroup id="image-control-1" name="image-control-1"
          :model-value="playgroundFit"
          direction="wrap"
          size="sm"
          aria-label="图片裁剪方式"
          @update:model-value="updateFit">
          <BingRadio v-for="option in fitOptions" :id="`image-control-1-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>

      <div class="control-group">
        <p class="control-label">位置</p>
        <BingRadioGroup id="image-control-2" name="image-control-2"
          :model-value="playgroundPosition"
          direction="wrap"
          size="sm"
          aria-label="图片位置"
          @update:model-value="updatePosition">
          <BingRadio v-for="option in positionOptions" :id="`image-control-2-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>

      <div class="control-group">
        <p class="control-label">圆角</p>
        <BingRadioGroup id="image-control-3" name="image-control-3"
          :model-value="playgroundRadius"
          direction="wrap"
          size="sm"
          aria-label="图片圆角"
          @update:model-value="updateRadius">
          <BingRadio v-for="option in radiusOptions" :id="`image-control-3-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>

      <BingCheckbox v-model="playgroundBlock" label="撑满容器宽度" />
      <BingCheckbox v-model="playgroundPreview" label="允许点击预览" />
    </div>
  </div>

  <BingCodeBlock
    :code="playgroundCode"
    language="vue"
    title="代码示例"
    wrap
  />
</template>
