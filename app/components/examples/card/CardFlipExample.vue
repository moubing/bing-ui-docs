<script setup lang="ts">
import { BingRadio, BingCard, BingCodeBlock, BingRadioGroup } from '@moubing/bing-ui'
import { useExamples } from './state'
const { flipTriggerOptions, flipAxisOptions, longPressReleaseOptions, flipDemo, flipSide, longPressCount, updateFlipTrigger, updateFlipAxis, updateLongPressRelease, handleLongPress, handleFlip, flipCode } = useExamples()
</script>

<template>
  <div class="doc-example">
    <div class="doc-example__preview card-demo-stage">
      <p class="preview-label">翻面预览</p>
      <ClientOnly>
        <BingCard
          class="card-preview-card"
          title="可翻面的卡片"
          description="点击或长按卡片查看反面内容。"
          variant="sky"
          rounded="lg"
          :flip-trigger="flipDemo.trigger"
          :flip-axis="flipDemo.axis"
          :long-press-release="flipDemo.release"
          @long-press="handleLongPress"
          @flip="handleFlip"
        >
          <p>正面用于放摘要、状态或入口信息。</p>
          <template #back>
            <div class="card-back-face">
              <strong>反面内容</strong>
              <span>可以展示补充说明、隐藏信息或二级操作。</span>
            </div>
          </template>
        </BingCard>
      </ClientOnly>
      <p class="card-feedback">
        <span>当前面：{{ flipSide }}</span><span>长按触发：{{ longPressCount }}</span>
      </p>
    </div>

    <div class="doc-example__controls">
      <div class="control-group">
        <p class="control-label">触发方式</p>
        <BingRadioGroup id="card-control-5" name="card-control-5"
          :model-value="flipDemo.trigger"
          direction="wrap"
          size="sm"
          aria-label="卡片翻面触发方式"
          @update:model-value="updateFlipTrigger">
          <BingRadio v-for="option in flipTriggerOptions" :id="`card-control-5-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>

      <div class="control-group">
        <p class="control-label">翻转轴</p>
        <BingRadioGroup id="card-control-6" name="card-control-6"
          :model-value="flipDemo.axis"
          direction="row"
          size="sm"
          aria-label="卡片翻转轴"
          @update:model-value="updateFlipAxis">
          <BingRadio v-for="option in flipAxisOptions" :id="`card-control-6-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>

      <div class="control-group">
        <p class="control-label">长按释放</p>
        <BingRadioGroup id="card-control-7" name="card-control-7"
          :model-value="flipDemo.release"
          direction="row"
          size="sm"
          aria-label="长按释放方式"
          @update:model-value="updateLongPressRelease">
          <BingRadio v-for="option in longPressReleaseOptions" :id="`card-control-7-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>
    </div>
  </div>

  <BingCodeBlock
    :code="flipCode"
    language="vue"
    title="代码示例"
    wrap
  />
</template>
