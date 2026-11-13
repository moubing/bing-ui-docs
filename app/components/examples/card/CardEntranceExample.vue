<script setup lang="ts">
import { BingRadio, BingCard, BingCheckbox, BingCodeBlock, BingInput, BingRadioGroup } from '@moubing/bing-ui'
import { useExamples } from './state'
const { entranceOptions, entranceDemo, enterCount, updateEntrance, handleEnter, toNumberText, entranceCode } = useExamples()
</script>

<template>
  <div class="doc-example">
    <div class="doc-example__preview card-demo-stage">
      <p class="preview-label">入场预览</p>
      <ClientOnly>
        <BingCard
          :key="`${entranceDemo.entrance}-${entranceDemo.entranceDuration}-${entranceDemo.entranceDelay}`"
          class="card-preview-card"
          title="入场动画"
          description="切换右侧配置查看不同动效。"
          variant="accent"
          rounded="lg"
          :entrance="entranceDemo.entrance"
          :entrance-once="entranceDemo.entranceOnce"
          :entrance-duration="toNumberText(entranceDemo.entranceDuration)"
          :entrance-delay="toNumberText(entranceDemo.entranceDelay)"
          @enter="handleEnter"
        >
          <p>这张卡片会在挂载后播放当前入场动画。</p>
        </BingCard>
      </ClientOnly>
      <p class="card-feedback">
        <span>进入次数：{{ enterCount }}</span>
      </p>
    </div>

    <div class="doc-example__controls">
      <div class="control-group">
        <p class="control-label">动画</p>
        <BingRadioGroup id="card-control-4" name="card-control-4"
          :model-value="entranceDemo.entrance"
          direction="wrap"
          size="sm"
          aria-label="卡片入场动画"
          @update:model-value="updateEntrance">
          <BingRadio v-for="option in entranceOptions" :id="`card-control-4-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>

      <label class="control-label" for="entrance-duration">时长</label>
      <BingInput id="entrance-duration" v-model="entranceDemo.entranceDuration" block />

      <label class="control-label" for="entrance-delay">延迟</label>
      <BingInput id="entrance-delay" v-model="entranceDemo.entranceDelay" block />

      <BingCheckbox v-model="entranceDemo.entranceOnce" label="只播放一次" />
    </div>
  </div>

  <BingCodeBlock
    :code="entranceCode"
    language="vue"
    title="代码示例"
    wrap
  />
</template>
