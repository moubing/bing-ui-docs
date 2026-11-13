<script setup lang="ts">
import { BingRadio, BingButton, BingCodeBlock, BingFilePreview, BingInput, BingRadioGroup } from '@moubing/bing-ui'
import { useExamples } from './state'
const { examplesActive, typeOptions, limitsOpen, limitOptions, limitFile, normalizedTextMaxLength, normalizedCsvMaxRows, normalizedCsvMaxColumns, updateLimitType, limitsCode } = useExamples()
</script>

<template>
  <div class="doc-example">
    <div class="doc-example__preview file-preview-demo-stage">
      <p class="preview-label">限制预览</p>
      <ClientOnly v-if="examplesActive">
        <BingButton variant="secondary" :throttle="false" @click="limitsOpen = true">
          打开限制示例
        </BingButton>

        <BingFilePreview
          v-model="limitsOpen"
          :file="limitFile"
          :type="limitOptions.type"
          :text-max-length="normalizedTextMaxLength"
          :csv-max-rows="normalizedCsvMaxRows"
          :csv-max-columns="normalizedCsvMaxColumns"
          width="min(900px, calc(100vw - 36px))"
          height="min(620px, calc(100vh - 36px))"
          ariaLabel="文本和 CSV 限制预览"
        />
      </ClientOnly>
    </div>

    <div class="doc-example__controls">
      <div class="control-group">
        <p class="control-label">预览类型</p>
        <BingRadioGroup id="file-preview-control-2" name="file-preview-control-2"
          :model-value="limitOptions.type"
          direction="wrap"
          size="sm"
          aria-label="限制预览类型"
          @update:model-value="updateLimitType">
          <BingRadio v-for="option in typeOptions" :id="`file-preview-control-2-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>

      <label class="control-label" for="file-preview-text-limit">文本最大字符数</label>
      <BingInput id="file-preview-text-limit" v-model="limitOptions.textMaxLength" block />

      <label class="control-label" for="file-preview-csv-rows">CSV 最大行数</label>
      <BingInput id="file-preview-csv-rows" v-model="limitOptions.csvMaxRows" block />

      <label class="control-label" for="file-preview-csv-columns">CSV 最大列数</label>
      <BingInput id="file-preview-csv-columns" v-model="limitOptions.csvMaxColumns" block />
    </div>
  </div>

  <BingCodeBlock :code="limitsCode" language="vue" title="代码示例" wrap />
</template>
