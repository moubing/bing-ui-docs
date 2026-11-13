<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingDialog, type BingDialogCloseReason } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const open = ref(false)
const feedback = ref('等待操作')
const confirmCount = ref(0)
function saveDraft() { feedback.value = '已保存草稿，弹窗保持打开' }
function closed(reason: BingDialogCloseReason) { feedback.value = `关闭来源：${reason}` }
</script>

<template>
  <BingButton variant="secondary" :throttle="false" @click="open = true">打开自定义 footer</BingButton>
  <!-- 自定义 title 插槽时省略 title prop，用 ariaLabel 提供名称。 -->
  <BingDialog v-model="open" width="620px" ariaLabel="生成组件发布记录"
    :show-footer="false" @close="closed" @confirm="confirmCount += 1">
    <template #title>
      <div class="heading"><span>流程确认</span><strong>生成组件发布记录</strong></div>
    </template>
    <p>标题和底部都可以通过插槽替换；这里的操作仅更新本地状态。</p>
    <template #footer="{ cancel, confirm, close }">
      <div class="actions">
      <BingButton variant="ghost" @click="cancel">稍后再说</BingButton>
      <BingButton variant="secondary" @click="saveDraft">保存草稿</BingButton>
      <BingButton variant="tertiary" @click="confirm">确认但保留</BingButton>
      <BingButton @click="close('confirm')">发布</BingButton>
      </div>
    </template>
  </BingDialog>
  <p role="status">{{ feedback }}；confirm：{{ confirmCount }}</p>
</template>

<style scoped>
.heading { display: grid; gap: 4px; }
.heading span { font-size: 12px; opacity: .65; }
.actions { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 8px; }
</style>
