<script setup lang="ts">
import { BingButton, BingCodeBlock, BingDialog } from '@moubing/bing-ui'
import { useExamples } from './state'
const { ambienceOpen, customOrbs, ambienceCode } = useExamples()
</script>

<template>
  <div class="doc-example">
    <div class="doc-example__preview dialog-demo-stage">
      <ClientOnly>
        <BingButton variant="tertiary" :throttle="false" @click="ambienceOpen = true">打开氛围弹窗</BingButton>
        <BingDialog
          v-model="ambienceOpen"
          title="带氛围遮罩的弹窗"
          width="620px"
          :overlay-orbs="customOrbs"
          overlay-orbs-animated
          overlay-blur
        >
          <p>
            这一组配置适合品牌化确认、重要公告或需要更强空间层次的弹窗。
          </p>
        </BingDialog>
      </ClientOnly>
    </div>

    <div class="doc-example__controls">
      <p>
        当 <code>overlayBlur</code> 为 false 时，组件不会渲染光圈层。动画也会尊重用户的 reduced motion 设置。
      </p>
    </div>
  </div>

  <BingCodeBlock :code="ambienceCode" language="vue" title="代码示例" wrap />
</template>
