<script setup lang="ts">
import { ref, useId } from 'vue'
import { BingAnimatedText, BingButton, BingConfigProvider, BingRadioGroup, BingTabs, BingTooltip } from '@moubing/bing-ui'
import type { BingRadioGroupOption, BingRadioValue, BingReducedMotion, BingTabItem, BingTabValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const mode = ref<BingReducedMotion>('user')
const modeOptions: BingRadioGroupOption[] = [
  { label: 'user', value: 'user', description: '跟随系统设置' },
  { label: 'always', value: 'always', description: '始终减少动效' },
  { label: 'never', value: 'never', description: '始终完整播放' },
]
const tabs: BingTabItem[] = [
  { value: 'overview', label: '概览' },
  { value: 'motion', label: '动效' },
  { value: 'history', label: '记录' },
]
const tab = ref<BingTabValue>('overview')
const clicks = ref(0)
const animatedTooltipId = useId()
const reducedTooltipId = useId()

function updateMode(value: BingRadioValue) {
  mode.value = value as BingReducedMotion
}
</script>

<template>
  <div class="motion-demo">
    <BingRadioGroup :model-value="mode" :options="modeOptions" direction="row" ariaLabel="动效策略" @update:model-value="updateMode" />

    <BingConfigProvider :reduced-motion="mode">
      <div class="motion-demo__stage">
        <BingAnimatedText effect="jump" trigger="always" class="motion-demo__title">跟随全局动效策略</BingAnimatedText>
        <BingTabs v-model="tab" :items="tabs" ariaLabel="动效演示标签" />
        <BingButton :throttle="false" style="justify-self: start" @click="clicks += 1">点击反馈</BingButton>
        <div class="motion-demo__tooltips">
          <BingConfigProvider reduced-motion="never">
            <BingTooltip :id="animatedTooltipId" content="这个提示始终完整播放动画。" :open-delay="0" :close-delay="140">
              <template #default="{ open }">
                <button type="button" class="motion-demo__trigger" :aria-describedby="open ? animatedTooltipId : undefined">局部完整动效</button>
              </template>
            </BingTooltip>
          </BingConfigProvider>
          <BingConfigProvider reduced-motion="always">
            <BingTooltip :id="reducedTooltipId" content="这个提示不播放过渡动画。" :open-delay="0" :close-delay="140">
              <template #default="{ open }">
                <button type="button" class="motion-demo__trigger" :aria-describedby="open ? reducedTooltipId : undefined">局部减少动效</button>
              </template>
            </BingTooltip>
          </BingConfigProvider>
        </div>
      </div>
    </BingConfigProvider>

    <p role="status">当前策略：{{ mode }}；按钮点击 {{ clicks }} 次</p>
  </div>
</template>

<style scoped>
.motion-demo { display: grid; gap: 16px; min-width: 0; }
.motion-demo__stage { display: grid; min-width: 0; gap: 14px; padding: 16px; border: 1px solid var(--bing-border); border-radius: 12px; }
.motion-demo__tooltips { display: flex; flex-wrap: wrap; gap: 10px; }
.motion-demo__trigger { padding: 8px 12px; border: 1px solid var(--bing-control-border); border-radius: 6px; background: var(--bing-control-bg); color: var(--bing-text); font: inherit; cursor: pointer; }
.motion-demo__trigger:focus-visible { outline: 2px solid var(--bing-focus); outline-offset: 2px; }
.motion-demo__title { font-size: 22px; font-weight: 600; }
</style>
