<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingDropDown, BingDropDownDivider, BingDropDownGroup, BingDropDownItem } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const view = ref('列表')
const hidden = ref(false)
</script>

<template>
  <BingDropDown highlight-motion="slide" ariaLabel="视图设置">
    <template #trigger="{ triggerProps }"><BingButton v-bind="triggerProps" variant="secondary">视图设置</BingButton></template>
    <BingDropDownGroup label="排列方式">
      <BingDropDownItem v-for="item in ['列表', '看板']" :key="item" :title="item" type="radio" :checked="view === item" :text-value="item === '列表' ? 'liebiao' : 'kanban'" :close-on-click="false" @click="view = item" />
    </BingDropDownGroup>
    <BingDropDownDivider />
    <BingDropDownGroup label="显示内容">
      <BingDropDownItem title="显示归档" type="checkbox" :checked="hidden" :close-on-click="false" @click="hidden = !hidden" />
    </BingDropDownGroup>
  </BingDropDown>
  <p role="status">{{ view }}；归档：{{ hidden ? '显示' : '隐藏' }}</p>
</template>
