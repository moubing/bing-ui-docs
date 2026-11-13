<script setup lang="ts">
import { computed, ref } from 'vue'
import { BingSelect } from '@moubing/bing-ui'
import type { BingSelectModelValue, BingSelectOption, BingSelectProps } from '@moubing/bing-ui'

type ExampleOptions = Pick<BingSelectProps, 'virtual' | 'virtualItemHeight' | 'panelMaxHeight'>
// @docs-options:start
const options: ExampleOptions = {
  "virtual": true,
  "panelMaxHeight": 320
}
// @docs-options:end

const virtualOptions: BingSelectOption[] = Array.from({ length: 160 }, (_, index) => ({
  label: `虚拟选项 ${index + 1}`,
  value: `virtual-${index + 1}`,
  description: index % 2 === 0 ? '高频选项' : '低频选项',
  detail: `这是第 ${index + 1} 个选项，面板只渲染当前视口附近的行。`,
  meta: {
    序号: index + 1,
    分组: index % 2 === 0 ? 'A' : 'B',
  },
  disabled: index % 23 === 0,
}))

const virtualValue = ref<BingSelectModelValue>(['virtual-2', 'virtual-18'])

const selectedVirtualLabel = computed(() => getSelectedLabels(virtualValue.value, virtualOptions))

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
      id="select-virtualValue"
      v-model="virtualValue"
      :options="virtualOptions"
      multiple
      searchable
      :virtual="options.virtual"
      :virtual-item-height="options.virtualItemHeight"
      :virtual-overscan="5"
      :panel-max-height="options.panelMaxHeight"
      placeholder="选择大量选项"
      select-all-text="全选当前结果"
      clear-all-text="清空当前结果"
      block
      ariaLabel="选择大量选项"
    />
    <p class="select-feedback">
      <span>已选： {{ selectedVirtualLabel }}</span>
    </p>
  </div>
</template>

<style scoped>
.select-example { display: grid; gap: 16px; max-width: 640px; padding: 16px; }
.select-feedback { overflow-wrap: anywhere; }
.select-option-row { display: grid; gap: 4px; }
</style>
