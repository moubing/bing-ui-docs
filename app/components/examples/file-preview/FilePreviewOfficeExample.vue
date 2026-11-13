<script setup lang="ts">
import { BingButton, BingCodeBlock, BingFilePreview } from '@moubing/bing-ui'
import { useExamples } from './state'
const { examplesActive, sampleFiles, officeOpen, convertedOpen, officeCode } = useExamples()
</script>

<template>
  <div class="doc-example">
    <div class="doc-example__preview file-preview-demo-stage">
      <p class="preview-label">Office fallback</p>
      <div class="file-preview-action-row">
        <BingButton variant="secondary" :throttle="false" @click="officeOpen = true">
          原始 DOCX
        </BingButton>
        <BingButton variant="primary" :throttle="false" @click="convertedOpen = true">
          已转换预览
        </BingButton>
      </div>

      <ClientOnly v-if="examplesActive">
        <BingFilePreview
          v-model="officeOpen"
          :file="sampleFiles.docx"
          ariaLabel="Office fallback 预览"
        />
        <BingFilePreview
          v-model="convertedOpen"
          :file="sampleFiles.converted"
          ariaLabel="Office 转换预览"
        />
      </ClientOnly>
    </div>

    <div class="doc-example__controls">
      <p>
        这个设计避免把私有 Office 文件默认发送到第三方在线 viewer。实际项目里可以由服务端转换出PDF、HTML 或图片预览，再把地址放到 <code>previewSrc</code>。
      </p>
    </div>
  </div>

  <BingCodeBlock :code="officeCode" language="vue" title="代码示例" wrap />
</template>
