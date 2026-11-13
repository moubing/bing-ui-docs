<script setup lang="ts">
import { ref } from 'vue'
import { BingSelect } from '@moubing/bing-ui'
import type { BingSelectChangePayload, BingSelectModelValue, BingSelectOption } from '@moubing/bing-ui'

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

const eventValue = ref<BingSelectModelValue>('soft-enter')

const eventLog = ref('等待选择')

function handleChange(payload: BingSelectChangePayload) {
  const labels = payload.options.map((option) => option.label).join('、') || '无'
  eventLog.value += ' → ' + `change：${labels}`
}

function handleClear() {
  eventLog.value += ' → ' + 'clear：已清空'
}

function handleOpen() {
  eventLog.value += ' → ' + 'open：面板已打开'
}

function handleClose() {
  eventLog.value += ' → ' + 'close：面板已关闭'
}
</script>

<template>
  <div class="select-example">
    <BingSelect
      id="select-eventValue"
      v-model="eventValue"
      ariaLabel="选择事件方案"
      :options="detailOptions"
      placeholder="触发事件"
      block
      @change="handleChange"
      @clear="handleClear"
      @open="handleOpen"
      @close="handleClose"
    />
    <p class="select-feedback">
      <span>{{ eventLog }}</span>
    </p>
  </div>
</template>

<style scoped>
.select-example { display: grid; gap: 16px; max-width: 640px; padding: 16px; }
.select-feedback { overflow-wrap: anywhere; }
.select-option-row { display: grid; gap: 4px; }
</style>
