<script setup lang="ts">
import { computed, ref } from 'vue'
import { BingSelect } from '@moubing/bing-ui'
import type { BingSelectModelValue, BingSelectOption, BingSelectProps } from '@moubing/bing-ui'

type ExampleOptions = Pick<BingSelectProps, 'panelPlacement' | 'panelAlign' | 'panelGap'>
// @docs-options:start
const options: ExampleOptions = {
  "panelPlacement": "auto",
  "panelAlign": "start",
  "panelGap": 10
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

const panelValue = ref<BingSelectModelValue>('shanghai')

const selectedPanelLabel = computed(() => getSelectedLabels(panelValue.value, cityOptions))

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
      id="select-panelValue"
      v-model="panelValue"
      :options="cityOptions"
      :panel-placement="options.panelPlacement"
      :panel-align="options.panelAlign"
      :panel-gap="options.panelGap"
      placeholder="测试弹层位置"
      block
      ariaLabel="测试选择器弹层位置"
    />
    <p class="select-feedback">
      <span>当前选择： {{ selectedPanelLabel }}</span>
    </p>
  </div>
</template>

<style scoped>
.select-example { display: grid; gap: 16px; max-width: 640px; padding: 16px; }
.select-feedback { overflow-wrap: anywhere; }
.select-option-row { display: grid; gap: 4px; }
</style>
