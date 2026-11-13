<script setup lang="ts">
import { BingButton, BingCheckbox, BingCodeBlock, BingDialog, BingInput } from '@moubing/bing-ui'
import { useExamples } from './state'
const { basicOpen, basicTitle, basicWidth, basicShowFooter, basicShowClose, basicShowPeek, basicLockScroll, basicCloseOnOverlay, basicCloseOnEsc, basicCloseOnConfirm, basicConfirmLoading, basicConfirmDisabled, lastCloseReason, confirmCount, cancelCount, handleClose, handleConfirm, handleCancel, basicCode } = useExamples()
</script>

<template>
  <div class="doc-example doc-example--wide">
    <div class="doc-example__preview dialog-demo-stage">
      <ClientOnly>
        <BingButton :throttle="false" @click="basicOpen = true">打开弹窗</BingButton>
        <BingDialog
          v-model="basicOpen"
          :title="basicTitle"
          :width="basicWidth"
          :show-footer="basicShowFooter"
          :show-close="basicShowClose"
          :show-peek="basicShowPeek"
          :lock-scroll="basicLockScroll"
          :close-on-overlay="basicCloseOnOverlay"
          :close-on-esc="basicCloseOnEsc"
          :close-on-confirm="basicCloseOnConfirm"
          :confirm-loading="basicConfirmLoading"
          :confirm-disabled="basicConfirmDisabled"
          cancel-text="稍后"
          confirm-text="确认发布"
          @confirm="handleConfirm"
          @cancel="handleCancel"
          @close="handleClose"
        >
          <p>
            这里是弹窗主体内容。你可以放表单、确认说明、发布摘要或其它需要用户专注处理的内容。
          </p>
          <div class="dialog-summary-list">
            <span>文档页：BingDialog</span>
            <span>状态：等待确认</span>
            <span>默认确认不会自动关闭</span>
          </div>
          <BingButton v-if="basicConfirmLoading" variant="secondary" @click="basicConfirmLoading = false">结束模拟加载</BingButton>
        </BingDialog>
      </ClientOnly>

      <p class="dialog-feedback">
        <span>最后关闭：{{ String(lastCloseReason) }}</span><span>confirm：{{ confirmCount }}</span><span>cancel：{{ cancelCount }}</span><span>状态：{{ basicOpen ? '已打开' : '已关闭' }}</span>
      </p>
    </div>

    <div class="doc-example__controls">
      <label class="control-label" for="dialog-title">标题</label>
      <BingInput id="dialog-title" v-model="basicTitle" block clearable />

      <label class="control-label" for="dialog-width">宽度</label>
      <BingInput id="dialog-width" v-model="basicWidth" block />

      <BingCheckbox v-model="basicShowFooter" label="显示默认 footer" />
      <BingCheckbox v-model="basicShowClose" label="显示关闭按钮" />
      <BingCheckbox v-model="basicShowPeek" label="显示查看背景按钮" />
      <BingCheckbox v-model="basicLockScroll" label="打开时锁滚动" />
      <BingCheckbox v-model="basicCloseOnOverlay" label="点击遮罩关闭" />
      <BingCheckbox v-model="basicCloseOnEsc" label="Esc 关闭" />
      <BingCheckbox v-model="basicCloseOnConfirm" label="确认后自动关闭" />
      <BingCheckbox v-model="basicConfirmLoading" label="确认按钮 loading" />
      <BingCheckbox v-model="basicConfirmDisabled" label="禁用确认按钮" />
    </div>
  </div>

  <BingCodeBlock :code="basicCode" language="vue" title="代码示例" wrap />
</template>
