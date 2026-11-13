<script setup lang="ts">
import { BingRadio, BingCheckbox, BingCodeBlock, BingInput, BingRadioGroup, BingSelect } from '@moubing/bing-ui'
import { onActivated, onDeactivated, ref } from 'vue'
import { useExamples } from './state'
const { sizeOptions, statusOptions, modeOptions, cityOptions, playground, singleValue, selectedCityLabel, playgroundSearchable, updateSize, updateSearchable, updateStatus, playgroundCode } = useExamples()
const examplesActive = ref(true)
onActivated(() => { examplesActive.value = true })
onDeactivated(() => { examplesActive.value = false })
</script>

<template>
  <ClientOnly v-if="examplesActive">
  <div class="doc-example">
    <div class="doc-example__preview select-demo-stage">
      <p class="preview-label">实时预览</p>
        <BingSelect id="select-singleValue" v-model="singleValue"
          :options="cityOptions"
          :placeholder="playground.placeholder"
          :size="playground.size"
          :searchable="playgroundSearchable"
          :typeahead="playground.typeahead"
          :highlight-matches="playground.highlightMatches"
          :status="playground.status"
          :clearable="playground.clearable"
          :block="playground.block"
          :glass="playground.glass"
          :disabled="playground.disabled"
          search-placeholder="搜索城市或区域"
          no-search-results-text="没有匹配城市"
          empty-text="暂无城市"
          ariaLabel="选择城市"
        />
      <p class="select-feedback">
        <span>当前选择：{{ selectedCityLabel }}</span>
      </p>
      <p>关闭搜索后，打开列表输入 cd 定位“成都”；开启搜索后可查看中文首字母的命中标记。</p>
    </div>

    <div class="doc-example__controls">
      <label class="control-label" for="select-placeholder">占位文案</label>
      <BingInput id="select-placeholder" v-model="playground.placeholder" block clearable />

      <div class="control-group">
        <p class="control-label">尺寸</p>
        <BingRadioGroup id="select-control-1" name="select-control-1"
          :model-value="playground.size"
          direction="row"
          size="sm"
          ariaLabel="选择器尺寸"
          @update:model-value="updateSize">
          <BingRadio v-for="option in sizeOptions" :id="`select-control-1-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>

      <div class="control-group">
        <p class="control-label">搜索</p>
        <BingRadioGroup id="select-control-2" name="select-control-2"
          :model-value="playground.searchable"
          direction="wrap"
          size="sm"
          ariaLabel="选择器搜索模式"
          @update:model-value="updateSearchable">
          <BingRadio v-for="option in modeOptions" :id="`select-control-2-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>

      <div class="control-group">
        <p class="control-label">状态</p>
        <BingRadioGroup id="select-control-3" name="select-control-3"
          :model-value="playground.status"
          direction="wrap"
          size="sm"
          ariaLabel="选择器状态"
          @update:model-value="updateStatus">
          <BingRadio v-for="option in statusOptions" :id="`select-control-3-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>

      <BingCheckbox v-model="playground.clearable" label="允许清除" />
      <BingCheckbox v-model="playground.typeahead" label="输入字符定位" />
      <BingCheckbox v-model="playground.highlightMatches" label="搜索命中高亮" />
      <BingCheckbox v-model="playground.block" label="撑满宽度" />
      <BingCheckbox v-model="playground.glass" label="玻璃效果" />
      <BingCheckbox v-model="playground.disabled" label="禁用" />
    </div>
  </div>

  </ClientOnly>
  <BingCodeBlock
    :code="playgroundCode"
    language="vue"
    title="代码示例"
    wrap
  />
</template>
