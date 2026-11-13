<script setup lang="ts">
import { ref } from 'vue'
import { BingSelect } from '@moubing/bing-ui'
import type { BingSelectModelValue, BingSelectOption } from '@moubing/bing-ui'

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

const smallValue = ref<BingSelectModelValue>('shanghai')

const mediumValue = ref<BingSelectModelValue>('shenzhen')

const largeValue = ref<BingSelectModelValue>('chengdu')
</script>

<template>
  <div class="select-example">
    <BingSelect
      id="select-smallValue"
      v-model="smallValue"
      ariaLabel="小尺寸城市"
      :options="cityOptions"
      size="sm"
      status="success"
      placeholder="小尺寸"
    />
    <BingSelect
      id="select-mediumValue"
      v-model="mediumValue"
      ariaLabel="中尺寸城市"
      :options="cityOptions"
      size="md"
      status="warning"
      placeholder="中尺寸"
    />
    <BingSelect
      id="select-largeValue"
      v-model="largeValue"
      ariaLabel="大尺寸城市"
      :options="cityOptions"
      size="lg"
      status="error"
      placeholder="大尺寸"
    />
  </div>
</template>

<style scoped>
.select-example { display: grid; gap: 16px; max-width: 640px; padding: 16px; }
.select-feedback { overflow-wrap: anywhere; }
.select-option-row { display: grid; gap: 4px; }
</style>
