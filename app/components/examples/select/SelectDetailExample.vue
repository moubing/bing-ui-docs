<script setup lang="ts">
import { BingCodeBlock, BingSelect } from '@moubing/bing-ui'
import { onActivated, onDeactivated, ref } from 'vue'
import { useExamples } from './state'
const { detailOptions, detailValue, selectedDetailLabel, detailCode } = useExamples()
const examplesActive = ref(true)
onActivated(() => { examplesActive.value = true })
onDeactivated(() => { examplesActive.value = false })
</script>

<template>
  <ClientOnly v-if="examplesActive">
  <div class="doc-example">
    <div class="doc-example__preview select-demo-stage">
      <p class="preview-label">详情预览</p>
        <BingSelect id="select-detailValue" v-model="detailValue"
          :options="detailOptions"
          searchable
          block
          placeholder="选择动效方案"
          search-placeholder="搜索方案"
          ariaLabel="选择动效方案"
        >
          <template #option="{ option, selected }">
            <span class="select-option-row">
              <span class="bing-select__option-label">
                {{ option.label }}<span v-if="selected"> 已选</span>
              </span>
              <span v-if="option.description" class="bing-select__option-description">
                {{ option.description }}
              </span>
            </span>
          </template>

          <template #option-detail="{ option, selected }">
            <span class="bing-select__option-detail-title">
              {{ option.label }}<span v-if="selected"> 已选</span>
            </span>
            <span class="bing-select__option-detail-text">
              {{ option.detail || option.description }}
            </span>
            <span
              v-for="(value, key) in option.meta || {}"
              :key="key"
              class="bing-select__option-detail-meta"
            >
              <span class="bing-select__option-detail-meta-key">{{ key }}</span>
              <span class="bing-select__option-detail-meta-value">{{ value }}</span>
            </span>
          </template>
        </BingSelect>
      <p class="select-feedback">
        <span>当前方案：{{ selectedDetailLabel }}</span>
      </p>
    </div>

    <div class="doc-example__controls">
      <p>
        打开下拉后，把指针移动到选项上即可看到详情面板。搜索框支持文本、描述和<code>meta</code> 字段。
      </p>
    </div>
  </div>

  </ClientOnly>
  <BingCodeBlock :code="detailCode" language="vue" title="代码示例" wrap />
</template>
