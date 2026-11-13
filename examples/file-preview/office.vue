<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingFilePreview, type BingFilePreviewFile } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const docxDataUrl = 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,UEsDBBQAAAAIAAAAAADMVIwQ4QAAAJwBAAATAAAAW0NvbnRlbnRfVHlwZXNdLnhtbH2QTU7DMBCFr2J5i2KHLhBCSbqAsgQW5QCWM0ks7BnLMw3h9iht6QIV1u/ne3rNdklRzVA4ELb61tRaAXrqA46tft8/V/d62zX7rwyslhSRWz2J5Adr2U+QHBvKgEuKA5XkhA2V0WbnP9wIdlPXd9YTCqBUsnbornmCwR2iqN0igCdsgchaPZ6MK6vVLucYvJNAaGfsf1GqM8EUiEcPTyHzzZKitlcJq/I34Jx7naGU0IN6c0VeXIJW208qve3JHxKgmP9rruykYQgeLvm1LRfywBxwTNFclOQC/uy3x7u7b1BLAwQUAAAACAAAAAAANlfe3KQAAAAYAQAACwAAAF9yZWxzLy5yZWxzjc+xCsIwFAXQXwlvN2kdRKRpFxG6Sv2AkLy2wSQvJFHr37s4WHFwvVzO5Tbd4h27Y8qWgoSaV8AwaDI2TBIuw2mzh65tzuhUsRTybGNmi3chS5hLiQchsp7Rq8wpYli8Gyl5VTKnNImo9FVNKLZVtRPp04C1yXojIfWmBjY8I/5j0zhajUfSN4+h/Jj4agAbVJqwSHhQMsK8Y754B6JtxOpi+wJQSwMEFAAAAAgAAAAAACWsqF6mAAAA2wAAABEAAAB3b3JkL2RvY3VtZW50LnhtbEWOwQrCMBBEfyXkblM9iJS2goeCNw/2A2qytoHsbtlEW/9eUg9e3sAMM0x9XjGoN0j0TI3eF6VWQJadp7HR/b3bnfS5rZfKsX0hUFIrBorV0ugppbkyJtoJcIgFz0ArhicLDikWLKNZWNwsbCFGTyMGcyjLo8HBk86TD3afrHOGZKT24mlU/VV1PsBN4O1hUQ6Qa5PTTNm4dSLYdBOzGb8x8z/afgFQSwECFAAUAAAACAAAAAAAzFSMEOEAAACcAQAAEwAAAAAAAAAAAAAAAAAAAAAAW0NvbnRlbnRfVHlwZXNdLnhtbFBLAQIUABQAAAAIAAAAAAA2V97cpAAAABgBAAALAAAAAAAAAAAAAAAAABIBAABfcmVscy8ucmVsc1BLAQIUABQAAAAIAAAAAAAlrKhepgAAANsAAAARAAAAAAAAAAAAAAAAAN8BAAB3b3JkL2RvY3VtZW50LnhtbFBLBQYAAAAAAwADALkAAAC0AgAAAAA='

const convertedHtml = `data:text/html;charset=utf-8,${encodeURIComponent(`
<!doctype html>
<html lang="zh-CN">
  <body style="margin:0;font-family:system-ui;padding:32px;background:#fff8fb;color:#172033;">
    <h1>组件交付说明</h1>
    <p>这是一个由服务端转换后的 Office 预览页面，可信内容可传给 previewSrc。</p>
    <ul>
      <li>原始 docx 仍然只用于下载或外部打开。</li>
      <li>预览内容由浏览器 iframe 渲染。</li>
      <li>FilePreview 不会主动调用第三方在线查看器。</li>
    </ul>
  </body>
</html>
`)}`

const originalOpen = ref(false)

const convertedOpen = ref(false)
const originalFile: BingFilePreviewFile = { name: 'handoff.docx', type: 'docx', src: docxDataUrl }
const convertedFile: BingFilePreviewFile = { ...originalFile, previewSrc: convertedHtml }
</script>

<template>
  <div class="actions">
    <BingButton :throttle="false" variant="secondary" @click="originalOpen = true">原始 DOCX</BingButton>
    <BingButton :throttle="false" @click="convertedOpen = true">已转换预览</BingButton>
  </div>
  <BingFilePreview v-model="originalOpen" :file="originalFile" ariaLabel="Office fallback 预览" />
  <BingFilePreview v-model="convertedOpen" :file="convertedFile" ariaLabel="Office 转换预览" />
</template>

<style scoped>
.actions { display: flex; flex-wrap: wrap; gap: 12px; }
</style>
