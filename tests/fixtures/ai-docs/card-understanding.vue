<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingCard } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const presses = ref(0)
const details = ref(false)
const clicks = ref(0)
</script>

<template>
  <div style="display: grid; gap: 24px">
    <BingCard class="reading-click" title="关闭倾斜仍可翻面" :interactive="false" entrance="none" flip-trigger="click" flip-axis="z">
      <p>关键说明保持在普通正文中。</p>
      <BingButton @click="details = !details">卡片内说明按钮</BingButton>
      <template #back>视觉补充</template>
    </BingCard>
    <BingCard class="reading-press" title="长按后恢复" entrance="none" :tilt="false" :long-press-delay="200"
      flip-trigger="press" long-press-release="restore" @long-press="presses++">
      <p>移动会取消尚未完成的长按。</p>
    </BingCard>
    <BingCard class="reading-disabled" title="卡片禁用" disabled entrance="none" flip-trigger="click">
      <template #footer><BingButton @click="clicks++">插槽按钮</BingButton></template>
    </BingCard>
  </div>
  <BingButton :throttle="false" @click="details = !details">查看关键说明</BingButton>
  <p v-if="details">无需翻面也能阅读的详细说明。</p>
  <p role="status">长按：{{ presses }}；业务点击：{{ clicks }}</p>
</template>
