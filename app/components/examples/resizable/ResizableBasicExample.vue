<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingRadio, BingCheckbox, BingCodeBlock, BingInput, BingRadioGroup, BingResizable, type BingResizableExpose } from '@moubing/bing-ui'
import { useExamples } from './state'
const panel = ref<BingResizableExpose | null>(null)
const { modeOptions, snapOptions, playgroundMode, playgroundSnapMode, playgroundWidth, playgroundHeight, playgroundMinWidth, playgroundMinHeight, playgroundMaxWidth, playgroundMaxHeight, playgroundStep, playgroundUseAllHandles, playgroundDisabled, playgroundLockRatio, playgroundContain, playgroundShowSize, eventLog, playgroundDirections, playgroundDefaultSize, updateMode, updateSnapMode, handleResizeStart, handleResize, handleResizeEnd, normalizeNumber, playgroundCode } = useExamples()
</script>

<template>
  <div class="doc-example doc-example--wide">
    <div class="doc-example__preview resizable-demo-stage">
      <div class="resizable-canvas-scroll"><div class="resizable-playground">
        <ClientOnly>
          <BingResizable
            ref="panel"
            :default-size="playgroundDefaultSize"
            :default-position="{ x: 34, y: 28 }"
            :min-width="normalizeNumber(playgroundMinWidth, 180)"
            :min-height="normalizeNumber(playgroundMinHeight, 120)"
            :max-width="normalizeNumber(playgroundMaxWidth, 620)"
            :max-height="normalizeNumber(playgroundMaxHeight, 320)"
            :mode="playgroundMode"
            :snap-mode="playgroundSnapMode"
            :directions="playgroundDirections"
            :step="normalizeNumber(playgroundStep, 8)"
            :disabled="playgroundDisabled"
            :lock-aspect-ratio="playgroundLockRatio"
            :contain="playgroundContain"
            :show-size="playgroundShowSize"
            aria-label="可调整尺寸面板"
            @resize-start="handleResizeStart"
            @resize="handleResize"
            @resize-end="handleResizeEnd"
          >
            <div class="resizable-panel-content">
              <strong>Resizable panel</strong>
              <span>拖拽边缘或角点，也可以聚焦手柄后使用方向键。</span>
            </div>
          </BingResizable>
        </ClientOnly>
      </div></div>

      <p class="resizable-feedback">
        <span>{{ eventLog }}</span>
      </p>
      <BingButton size="sm" :throttle="false" @click="panel?.reset()">应用初始尺寸</BingButton>
    </div>

    <div class="doc-example__controls">
      <label class="control-label" for="resizable-width">初始宽度</label>
      <BingInput id="resizable-width" v-model="playgroundWidth" block />

      <label class="control-label" for="resizable-height">初始高度</label>
      <BingInput id="resizable-height" v-model="playgroundHeight" block />

      <label class="control-label" for="resizable-min-width">minWidth</label>
      <BingInput id="resizable-min-width" v-model="playgroundMinWidth" block />

      <label class="control-label" for="resizable-min-height">minHeight</label>
      <BingInput id="resizable-min-height" v-model="playgroundMinHeight" block />

      <label class="control-label" for="resizable-max-width">maxWidth</label>
      <BingInput id="resizable-max-width" v-model="playgroundMaxWidth" block />

      <label class="control-label" for="resizable-max-height">maxHeight</label>
      <BingInput id="resizable-max-height" v-model="playgroundMaxHeight" block />

      <label class="control-label" for="resizable-step">step</label>
      <BingInput id="resizable-step" v-model="playgroundStep" block />

      <div class="control-block">
        <span class="control-label">mode</span>
        <BingRadioGroup id="resizable-control-1" name="resizable-control-1"
          :model-value="playgroundMode"
          @update:model-value="updateMode">
          <BingRadio v-for="option in modeOptions" :id="`resizable-control-1-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>

      <div class="control-block">
        <span class="control-label">snapMode</span>
        <BingRadioGroup id="resizable-control-2" name="resizable-control-2"
          :model-value="playgroundSnapMode"
          @update:model-value="updateSnapMode">
          <BingRadio v-for="option in snapOptions" :id="`resizable-control-2-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>

      <BingCheckbox v-model="playgroundUseAllHandles" label="显示全部手柄" />
      <BingCheckbox v-model="playgroundLockRatio" label="锁定宽高比" />
      <BingCheckbox v-model="playgroundContain" label="限制在父容器内" />
      <BingCheckbox v-model="playgroundShowSize" label="拖拽时显示尺寸" />
      <BingCheckbox v-model="playgroundDisabled" label="禁用调整" />
    </div>
  </div>

  <BingCodeBlock :code="playgroundCode" language="vue" title="代码示例" wrap />
</template>
