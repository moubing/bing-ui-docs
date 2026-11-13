<script setup lang="ts">
import { computed, ref } from 'vue'
import { BingSelect } from '@moubing/bing-ui'
import type { BingSelectModelValue, BingSelectOption } from '@moubing/bing-ui'

const detailOptions: BingSelectOption[] = [
  {
    label: '柔和入场',
    value: 'soft-enter',
    description: '低干扰的页面进入动效。',
    detail: '适合数据面板、设置页和需要保持安静的业务页面。',
    meta: {
      时长: '0.72s',
      层级: '页面',
    },
  },
  {
    label: '点击反馈',
    value: 'click-feedback',
    description: '快速确认用户操作。',
    detail: '适合按钮、标签、列表项这类频繁交互元素。',
    meta: {
      时长: '0.18s',
      层级: '控件',
    },
  },
  {
    label: '悬停提示',
    value: 'hover-detail',
    description: '在不打断流程的情况下展示补充信息。',
    detail: '适合选项很多、但每个选项都需要解释的选择器。',
    meta: {
      时长: '0.24s',
      层级: '浮层',
    },
  },
  {
    label: '危险操作',
    value: 'danger-action',
    description: '需要二次确认的操作。',
    detail: '这里作为禁用项示例，真实业务中可搭配权限或状态判断。',
    disabled: true,
    meta: {
      状态: '禁用',
    },
  },
]

const detailValue = ref<BingSelectModelValue>('soft-enter')

const selectedDetailLabel = computed(() => getSelectedLabels(detailValue.value, detailOptions))

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
      id="select-detailValue"
      v-model="detailValue"
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
            {{ option.label }}
            <span v-if="selected">已选</span>
          </span>
          <span v-if="option.description" class="bing-select__option-description">{{ option.description }}</span>
        </span>
      </template>
      <template #option-detail="{ option, selected }">
        <span class="bing-select__option-detail-title">
          {{ option.label }}
          <span v-if="selected">已选</span>
        </span>
        <span class="bing-select__option-detail-text">{{ option.detail || option.description }}</span>
        <span v-for="(value, key) in option.meta || {}" :key="key" class="bing-select__option-detail-meta">
          <span class="bing-select__option-detail-meta-key">{{ key }}</span>
          <span class="bing-select__option-detail-meta-value">{{ value }}</span>
        </span>
      </template>
    </BingSelect>
    <p class="select-feedback">
      <span>当前方案： {{ selectedDetailLabel }}</span>
    </p>
  </div>
</template>

<style scoped>
.select-example { display: grid; gap: 16px; max-width: 640px; padding: 16px; }
.select-feedback { overflow-wrap: anywhere; }
.select-option-row { display: grid; gap: 4px; }
</style>
