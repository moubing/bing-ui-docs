<script setup lang="ts">
import { BingButton, BingCodeBlock, BingDialog } from '@moubing/bing-ui'
import { useExamples } from './state'
const { footerOpen, footerAction, footerConfirmCount, handleFooterClose, saveDraft, footerCode } = useExamples()
</script>

<template>
  <div class="doc-example">
    <div class="doc-example__preview dialog-demo-stage">
      <ClientOnly>
        <BingButton variant="secondary" :throttle="false" @click="footerOpen = true">打开自定义 footer</BingButton>
        <BingDialog
          v-model="footerOpen"
          width="620px"
          ariaLabel="生成组件发布记录"
          :show-footer="false"
          @close="handleFooterClose"
          @confirm="footerConfirmCount += 1"
        >
          <template #title>
            <div class="dialog-title-slot">
              <span>流程确认</span>
              <strong>生成组件发布记录</strong>
            </div>
          </template>

          <p>
            自定义标题可以承载辅助标签、主标题和说明。自定义底部可以按业务需要放三个或更多操作。
          </p>

          <template #footer="{ cancel, confirm, close }">
            <div class="dialog-actions">
            <BingButton variant="ghost" @click="cancel">稍后再说</BingButton>
            <BingButton variant="secondary" @click="saveDraft">保存草稿</BingButton>
            <BingButton variant="tertiary" @click="confirm">确认但保留</BingButton>
            <BingButton variant="primary" @click="close('confirm')">发布</BingButton>
            </div>
          </template>
        </BingDialog>
      </ClientOnly>

      <p class="dialog-feedback">
        <span>{{ footerAction }}</span><span>confirm：{{ footerConfirmCount }}</span>
      </p>
    </div>

    <div class="doc-example__controls">
      <p>
        <code>confirm()</code> 沿用 <code>closeOnConfirm</code> 规则；<code>close('confirm')</code> 只携带关闭原因，不会再发出 confirm 事件。这里的发布和草稿操作只显示本地反馈。
      </p>
    </div>
  </div>

  <BingCodeBlock :code="footerCode" language="vue" title="代码示例" wrap />
</template>

<style scoped>
.dialog-actions { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 8px; }
</style>
