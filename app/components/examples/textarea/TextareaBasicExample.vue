<script setup lang="ts">
import { BingRadio, BingCheckbox, BingCodeBlock, BingInput, BingRadioGroup, BingTextarea } from '@moubing/bing-ui'
import { useExamples } from './state'
const { sizeOptions, statusOptions, autosizeOptions, rowOptions, resizeOptions, playgroundValue, playgroundPlaceholder, playgroundSize, playgroundStatus, playgroundRows, playgroundAutosizeMode, playgroundResize, playgroundShowCount, playgroundClearable, playgroundSmoothCaret, playgroundBlock, playgroundDisabled, playgroundReadonly, playgroundAutosize, updateSize, updateStatus, updateRows, updateAutosize, updateResize, playgroundCode } = useExamples()
</script>

<template>
  <div class="doc-example">
    <div class="doc-example__preview textarea-demo-stage">
      <p class="preview-label">实时预览</p>
      <ClientOnly>
        <BingTextarea
          v-model="playgroundValue"
          :placeholder="playgroundPlaceholder"
          :size="playgroundSize"
          :status="playgroundStatus"
          :rows="playgroundRows"
          :autosize="playgroundAutosize"
          :resize="playgroundResize"
          :show-count="playgroundShowCount"
          :clearable="playgroundClearable"
          :smooth-caret="playgroundSmoothCaret"
          :block="playgroundBlock"
          :disabled="playgroundDisabled"
          :readonly="playgroundReadonly"
          :max-length="120"
          aria-label="基础 Textarea 示例"
        />
      </ClientOnly>
      <p class="textarea-feedback">
        <span>字符数：{{ playgroundValue.length }}</span><span>autosize：{{ playgroundAutosizeMode }}</span>
      </p>
    </div>

    <div class="doc-example__controls">
      <label class="control-label" for="textarea-placeholder">占位文案</label>
      <BingInput id="textarea-placeholder" v-model="playgroundPlaceholder" block clearable />

      <div class="control-group">
        <p class="control-label">尺寸</p>
        <BingRadioGroup id="textarea-control-1" name="textarea-control-1"
          :model-value="playgroundSize"
          direction="row"
          size="sm"
          aria-label="Textarea 尺寸"
          @update:model-value="updateSize">
          <BingRadio v-for="option in sizeOptions" :id="`textarea-control-1-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>

      <div class="control-group">
        <p class="control-label">状态</p>
        <BingRadioGroup id="textarea-control-2" name="textarea-control-2"
          :model-value="playgroundStatus"
          direction="wrap"
          size="sm"
          aria-label="Textarea 状态"
          @update:model-value="updateStatus">
          <BingRadio v-for="option in statusOptions" :id="`textarea-control-2-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>

      <div class="control-group">
        <p class="control-label">行数</p>
        <BingRadioGroup id="textarea-control-3" name="textarea-control-3"
          :model-value="playgroundRows"
          direction="row"
          size="sm"
          aria-label="Textarea 行数"
          @update:model-value="updateRows">
          <BingRadio v-for="option in rowOptions" :id="`textarea-control-3-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>

      <div class="control-group">
        <p class="control-label">自动高度</p>
        <BingRadioGroup id="textarea-control-4" name="textarea-control-4"
          :model-value="playgroundAutosizeMode"
          direction="column"
          size="sm"
          aria-label="Textarea 自动高度"
          @update:model-value="updateAutosize">
          <BingRadio v-for="option in autosizeOptions" :id="`textarea-control-4-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>

      <div class="control-group">
        <p class="control-label">resize</p>
        <BingRadioGroup id="textarea-control-5" name="textarea-control-5"
          :model-value="playgroundResize"
          direction="wrap"
          size="sm"
          aria-label="Textarea resize"
          @update:model-value="updateResize">
          <BingRadio v-for="option in resizeOptions" :id="`textarea-control-5-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>

      <BingCheckbox v-model="playgroundShowCount" label="显示字数" />
      <BingCheckbox v-model="playgroundClearable" label="允许清除" />
      <BingCheckbox v-model="playgroundSmoothCaret" label="平滑光标" />
      <BingCheckbox v-model="playgroundBlock" label="撑满宽度" />
      <BingCheckbox v-model="playgroundDisabled" label="禁用" />
      <BingCheckbox v-model="playgroundReadonly" label="只读" />
    </div>
  </div>

  <BingCodeBlock
    :code="playgroundCode"
    language="vue"
    title="代码示例"
    wrap
  />
</template>
