<script setup lang="ts">
import { BingRadio, BingCheckbox, BingCodeBlock, BingInput, BingRadioGroup } from '@moubing/bing-ui'
import { useExamples } from './state'
const { SearchIcon, typeOptions, sizeOptions, statusOptions, playgroundValue, playgroundPlaceholder, playgroundType, playgroundSize, playgroundStatus, playgroundClearMode, playgroundClearable, playgroundBlock, playgroundDisabled, playgroundWithIcon, updateType, updateSize, updateStatus, playgroundCode } = useExamples()
</script>

<template>
  <div class="doc-example">
    <div class="doc-example__preview input-demo-stage">
      <p class="preview-label">实时预览</p>
      <ClientOnly>
        <BingInput
          v-model="playgroundValue"
          :type="playgroundType"
          :placeholder="playgroundPlaceholder"
          :size="playgroundSize"
          :status="playgroundStatus"
          :clearable="playgroundClearable"
          :block="playgroundBlock"
          :disabled="playgroundDisabled"
          :icon="playgroundWithIcon ? SearchIcon : undefined"
          icon-label="搜索"
          aria-label="基础输入框示例"
        />
      </ClientOnly>
      <p class="input-feedback">
        <span>当前值：{{ playgroundValue === '' ? '空' : playgroundValue }}</span>
      </p>
    </div>

    <div class="doc-example__controls">
      <label class="control-label" for="input-placeholder">占位文案</label>
      <BingInput id="input-placeholder" v-model="playgroundPlaceholder" block clearable />

      <div class="control-group">
        <p class="control-label">类型</p>
        <BingRadioGroup id="input-control-1" name="input-control-1"
          :model-value="playgroundType"
          direction="wrap"
          size="sm"
          aria-label="输入框类型"
          @update:model-value="updateType">
          <BingRadio v-for="option in typeOptions" :id="`input-control-1-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>

      <div class="control-group">
        <p class="control-label">尺寸</p>
        <BingRadioGroup id="input-control-2" name="input-control-2"
          :model-value="playgroundSize"
          direction="row"
          size="sm"
          aria-label="输入框尺寸"
          @update:model-value="updateSize">
          <BingRadio v-for="option in sizeOptions" :id="`input-control-2-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>

      <div class="control-group">
        <p class="control-label">状态</p>
        <BingRadioGroup id="input-control-3" name="input-control-3"
          :model-value="playgroundStatus"
          direction="wrap"
          size="sm"
          aria-label="输入框状态"
          @update:model-value="updateStatus">
          <BingRadio v-for="option in statusOptions" :id="`input-control-3-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>

      <BingRadioGroup :model-value="playgroundClearMode" direction="wrap" size="sm" aria-label="清除按钮行为"
        @update:model-value="playgroundClearMode = String($event)">
        <BingRadio value="auto" label="跟随类型" />
        <BingRadio value="always" label="允许清除" />
        <BingRadio value="never" label="禁止清除" />
      </BingRadioGroup>
      <BingCheckbox v-model="playgroundBlock" label="撑满宽度" />
      <BingCheckbox v-model="playgroundWithIcon" label="显示图标" />
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
