<script setup lang="ts">
import { computed, ref } from 'vue'
import { BingSelect } from '@moubing/bing-ui'
import type { BingSelectModelValue, BingSelectOption, BingSelectProps } from '@moubing/bing-ui'

type ExampleOptions = Pick<BingSelectProps, 'showSelectAll' | 'searchable' | 'clearable'>
// @docs-options:start
const options: ExampleOptions = {
  "showSelectAll": true,
  "searchable": true,
  "clearable": true
}
// @docs-options:end

const roleOptions: BingSelectOption[] = [
  { label: '设计系统', value: 'design-system', description: '组件规范、主题和交互标准。' },
  { label: '前端开发', value: 'frontend', description: '页面开发和组件接入。' },
  { label: '后端接口', value: 'backend', description: '接口、权限和数据模型。' },
  { label: '产品运营', value: 'operation', description: '内容配置和活动上线。' },
  { label: '质量保障', value: 'qa', description: '测试计划和回归验证。' },
]

const multipleValue = ref<BingSelectModelValue>(['design-system', 'frontend'])

const selectedRoleLabel = computed(() => getSelectedLabels(multipleValue.value, roleOptions))

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
      id="select-multipleValue"
      v-model="multipleValue"
      :options="roleOptions"
      multiple
      placeholder="选择参与团队"
      select-all-text="选择全部团队"
      clear-all-text="清空已选团队"
      :show-select-all="options.showSelectAll"
      :searchable="options.searchable"
      :clearable="options.clearable"
      block
      ariaLabel="选择参与团队"
    />
    <p class="select-feedback">
      <span>已选： {{ selectedRoleLabel }}</span>
    </p>
  </div>
</template>

<style scoped>
.select-example { display: grid; gap: 16px; max-width: 640px; padding: 16px; }
.select-feedback { overflow-wrap: anywhere; }
.select-option-row { display: grid; gap: 4px; }
</style>
