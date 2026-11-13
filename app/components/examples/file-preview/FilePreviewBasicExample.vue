<script setup lang="ts">
import { FileArchive, FileBraces, FileSpreadsheet, FileText } from 'lucide-vue-next'
import { BingRadio, BingButton, BingCheckbox, BingCodeBlock, BingFilePreview, BingIcon, BingInput, BingRadioGroup } from '@moubing/bing-ui'
import { useExamples } from './state'
const { examplesActive, sampleOptions, selectedSample, previewOpen, eventLog, previewOptions, selectedFile, updateSample, handleClose, handleDownload, handleOpenExternal, basicCode } = useExamples()
</script>

<template>
  <div class="doc-example">
    <div class="doc-example__preview file-preview-demo-stage">
      <p class="preview-label">预览入口</p>
      <div class="file-preview-card">
        <BingIcon
          :icon="selectedSample === 'json'
            ? FileBraces
            : selectedSample === 'csv'
              ? FileSpreadsheet
              : selectedSample === 'converted' || selectedSample === 'docx'
                ? FileArchive
                : FileText"
          size="lg"
        />
        <div>
          <strong>{{ selectedFile.name }}</strong>
          <span>{{ selectedFile.type }} · {{ selectedFile.size ? `${selectedFile.size} bytes` : '内联内容' }}</span>
        </div>
      </div>

      <ClientOnly v-if="examplesActive">
        <BingButton variant="primary" :throttle="false" @click="previewOpen = true">
          打开预览
        </BingButton>

        <BingFilePreview
          v-model="previewOpen"
          :file="selectedFile"
          :width="previewOptions.width"
          :height="previewOptions.height"
          :lock-scroll="previewOptions.lockScroll"
          :close-on-esc="previewOptions.closeOnEsc"
          :close-on-overlay="previewOptions.closeOnOverlay"
          :downloadable="previewOptions.downloadable"
          :openable="previewOptions.openable"
          :json-highlight="previewOptions.jsonHighlight"
          ariaLabel="文件预览"
          @error="eventLog = '加载失败：' + $event.message"
          @close="handleClose"
          @download="handleDownload"
          @open-external="handleOpenExternal"
        />
      </ClientOnly>

      <p class="file-preview-feedback">
        <span>{{ eventLog }}</span>
      </p>
    </div>

    <div class="doc-example__controls">
      <div class="control-group">
        <p class="control-label">文件样例</p>
        <BingRadioGroup id="file-preview-control-1" name="file-preview-control-1"
          :model-value="selectedSample"
          direction="wrap"
          size="sm"
          aria-label="文件预览样例"
          @update:model-value="updateSample">
          <BingRadio v-for="option in sampleOptions" :id="`file-preview-control-1-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>

      <label class="control-label" for="file-preview-width">面板宽度</label>
      <BingInput id="file-preview-width" v-model="previewOptions.width" block />

      <label class="control-label" for="file-preview-height">面板高度</label>
      <BingInput id="file-preview-height" v-model="previewOptions.height" block />

      <div class="inline-control-grid">
        <BingCheckbox v-model="previewOptions.downloadable" label="显示下载" />
        <BingCheckbox v-model="previewOptions.openable" label="显示外部打开" />
        <BingCheckbox v-model="previewOptions.lockScroll" label="锁定页面滚动" />
        <BingCheckbox v-model="previewOptions.closeOnEsc" label="Esc 关闭" />
        <BingCheckbox v-model="previewOptions.closeOnOverlay" label="点击遮罩关闭" />
        <BingCheckbox v-model="previewOptions.jsonHighlight" label="JSON 高亮" />
      </div>
    </div>
  </div>

  <BingCodeBlock :code="basicCode" language="vue" title="代码示例" wrap />
</template>
