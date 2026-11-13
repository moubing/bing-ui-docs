<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingConfigProvider, BingInput, BingRadioGroup, BingSelect, BingTag } from '@moubing/bing-ui'
import type { BingConfigSize, BingRadioGroupOption, BingRadioValue, BingSelectModelValue, BingSelectOption } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const size = ref<BingConfigSize>('lg')
const sizeOptions: BingRadioGroupOption[] = [
  { label: 'sm', value: 'sm' },
  { label: 'md', value: 'md' },
  { label: 'lg', value: 'lg' },
]
const keyword = ref<string | number | null>('')
const owner = ref<BingSelectModelValue>('design')
const ownerOptions: BingSelectOption[] = [
  { label: '设计', value: 'design' },
  { label: '前端', value: 'frontend' },
  { label: '文档', value: 'docs' },
]

function updateSize(value: BingRadioValue) {
  size.value = value as BingConfigSize
}
</script>

<template>
  <div class="config-demo">
    <BingRadioGroup :model-value="size" :options="sizeOptions" direction="row" ariaLabel="全局尺寸" @update:model-value="updateSize" />

    <BingConfigProvider :size="size">
      <section class="config-demo__group" aria-label="外层 Provider">
        <p class="config-demo__label">外层 Provider：size="{{ size }}"</p>
        <div class="config-demo__row">
          <BingInput v-model="keyword" placeholder="继承全局尺寸" ariaLabel="搜索文档" />
          <BingSelect v-model="owner" :options="ownerOptions" ariaLabel="负责方向" />
        </div>
        <div class="config-demo__row">
          <BingButton :throttle="false">继承尺寸</BingButton>
          <BingButton size="sm" variant="secondary" :throttle="false">显式 sm</BingButton>
          <BingTag label="继承尺寸" tone="neutral" />
        </div>
      </section>

      <BingConfigProvider size="sm">
        <section class="config-demo__group" aria-label="嵌套 Provider">
          <p class="config-demo__label">嵌套 Provider：只覆盖 size="sm"</p>
          <div class="config-demo__row">
            <BingInput placeholder="内层固定 sm" ariaLabel="内层输入框" />
            <BingButton variant="secondary" :throttle="false">内层按钮</BingButton>
          </div>
        </section>
      </BingConfigProvider>
    </BingConfigProvider>
  </div>
</template>

<style scoped>
.config-demo { display: grid; gap: 16px; min-width: 0; }
.config-demo__group { display: grid; min-width: 0; gap: 12px; padding: 14px; border: 1px solid var(--bing-border); border-radius: 12px; }
.config-demo__label { margin: 0; color: var(--bing-muted); font-size: 13px; }
.config-demo__row { display: flex; min-width: 0; flex-wrap: wrap; align-items: center; gap: 10px; }
.config-demo__row > .bing-input, .config-demo__row > .bing-select { flex: 1 1 200px; min-width: 0; }
</style>
