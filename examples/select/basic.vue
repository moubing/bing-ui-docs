<script setup lang="ts">
import { computed, ref } from 'vue'
import { BingSelect } from '@moubing/bing-ui'
import type { BingSelectModelValue, BingSelectOption, BingSelectProps } from '@moubing/bing-ui'

type ExampleOptions = Pick<BingSelectProps, 'placeholder' | 'size' | 'searchable' | 'typeahead' | 'highlightMatches' | 'status' | 'clearable' | 'block' | 'glass' | 'disabled'>
// @docs-options:start
const options: ExampleOptions = {
  "placeholder": "请选择城市",
  "size": "md",
  "searchable": "auto",
  "typeahead": true,
  "highlightMatches": true,
  "status": "default",
  "clearable": true,
  "block": true,
  "glass": true,
  "disabled": false
}
// @docs-options:end

const cityOptions: BingSelectOption[] = [
  {
    label: '上海',
    value: 'shanghai',
    description: '华东业务中心',
    detail: '适合放置销售、交付和活动运营团队。',
    meta: {
      区域: '华东',
      等级: '核心',
    },
  },
  {
    label: '深圳',
    value: 'shenzhen',
    description: '产品与研发中心',
    detail: '适合放置研发、设计和增长团队。',
    meta: {
      区域: '华南',
      等级: '核心',
    },
  },
  {
    label: '成都',
    value: 'chengdu',
    description: '内容与支持中心',
    detail: '适合放置内容运营和客户支持团队。',
    meta: {
      区域: '西南',
      等级: '扩展',
    },
  },
  {
    label: '杭州',
    value: 'hangzhou',
    description: '生态合作中心',
    detail: '适合放置生态合作、渠道和社区团队。',
    meta: {
      区域: '华东',
      等级: '扩展',
    },
  },
  {
    label: '北京',
    value: 'beijing',
    description: '暂不可选',
    disabled: true,
  },
]

const singleValue = ref<BingSelectModelValue>('shenzhen')

const selectedCityLabel = computed(() => getSelectedLabels(singleValue.value, cityOptions))

function getSelectedLabels(value: BingSelectModelValue, options: BingSelectOption[]) {
  const values = Array.isArray(value) ? value : value === null ? [] : [value]
  const labels = options
    .filter((option) => values.includes(option.value))
    .map((option) => option.label)

  return labels.length ? labels.join('、') : '未选择'
}
</script>

<template>
  <div class="select-example">
    <BingSelect
      id="select-singleValue"
      v-model="singleValue"
      :options="cityOptions"
      :placeholder="options.placeholder"
      :size="options.size"
      :searchable="options.searchable"
      :status="options.status"
      :clearable="options.clearable"
      :block="options.block"
      :glass="options.glass"
      :disabled="options.disabled"
      search-placeholder="搜索城市或区域"
      no-search-results-text="没有匹配城市"
      empty-text="暂无城市"
      ariaLabel="选择城市"
    />
    <p class="select-feedback">
      <span>当前选择： {{ selectedCityLabel }}</span>
    </p>
  </div>
</template>

<style scoped>
.select-example { display: grid; gap: 16px; max-width: 640px; padding: 16px; }
.select-feedback { overflow-wrap: anywhere; }
.select-option-row { display: grid; gap: 4px; }
</style>
