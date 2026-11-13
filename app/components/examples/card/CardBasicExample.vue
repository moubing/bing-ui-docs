<script setup lang="ts">
import { BingRadio, BingButton, BingCard, BingCheckbox, BingCodeBlock, BingInput, BingRadioGroup } from '@moubing/bing-ui'
import { useExamples } from './state'
import { ref } from 'vue'
const { variantOptions, paddingOptions, roundedOptions, playground, updateVariant, updatePadding, updateRounded, playgroundCode } = useExamples()
const message = ref('')
</script>

<template>
  <div class="doc-example">
    <div class="doc-example__preview card-demo-stage">
      <p class="preview-label">实时预览</p>
      <ClientOnly>
        <BingCard
          class="card-preview-card"
          :title="playground.title"
          :description="playground.description"
          :variant="playground.variant"
          :padding="playground.padding"
          :rounded="playground.rounded"
          :glass="playground.glass"
          :tilt="playground.tilt"
          :glare="playground.glare"
          :disabled="playground.disabled"
        >
          <div class="card-metric-list">
            <span>转化率 <strong>18.6%</strong></span>
            <span>活跃用户 <strong>4,280</strong></span>
          </div>
          <template #footer>
            <div @pointerdown.stop @click.stop>
              <BingButton size="sm" variant="ghost" :disabled="playground.disabled" @click="message = '已查看详情'">查看详情</BingButton>
            </div>
          </template>
        </BingCard>
      </ClientOnly>
      <p class="card-feedback" role="status">{{ message }}</p>
    </div>

    <div class="doc-example__controls">
      <label class="control-label" for="card-title">标题</label>
      <BingInput id="card-title" v-model="playground.title" block clearable />

      <label class="control-label" for="card-description">描述</label>
      <BingInput id="card-description" v-model="playground.description" block clearable />

      <div class="control-group">
        <p class="control-label">类型</p>
        <BingRadioGroup id="card-control-1" name="card-control-1"
          :model-value="playground.variant"
          direction="wrap"
          size="sm"
          aria-label="卡片类型"
          @update:model-value="updateVariant">
          <BingRadio v-for="option in variantOptions" :id="`card-control-1-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>

      <div class="control-group">
        <p class="control-label">内边距</p>
        <BingRadioGroup id="card-control-2" name="card-control-2"
          :model-value="playground.padding"
          direction="row"
          size="sm"
          aria-label="卡片内边距"
          @update:model-value="updatePadding">
          <BingRadio v-for="option in paddingOptions" :id="`card-control-2-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>

      <div class="control-group">
        <p class="control-label">圆角</p>
        <BingRadioGroup id="card-control-3" name="card-control-3"
          :model-value="playground.rounded"
          direction="wrap"
          size="sm"
          aria-label="卡片圆角"
          @update:model-value="updateRounded">
          <BingRadio v-for="option in roundedOptions" :id="`card-control-3-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>

      <BingCheckbox v-model="playground.glass" label="玻璃效果" />
      <BingCheckbox v-model="playground.tilt" label="指针倾斜" />
      <BingCheckbox v-model="playground.glare" label="高光跟随" />
      <BingCheckbox v-model="playground.disabled" label="禁用交互" />
    </div>
  </div>

  <BingCodeBlock
    :code="playgroundCode"
    language="vue"
    title="代码示例"
    wrap
  />
</template>
