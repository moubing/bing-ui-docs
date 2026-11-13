<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingConfigProvider, BingDialog, BingRadioGroup, BingTooltip } from '@moubing/bing-ui'
import type { BingRadioGroupOption, BingRadioValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

// 业务里已有一个 z-index 为 2500 的第三方挂件。
const widgetZIndex = 2500
const zIndex = ref(2000)
const layerOptions: BingRadioGroupOption[] = [
  { label: '默认 2000', value: 2000, description: 'Dialog 为 2000，被挂件盖住' },
  { label: '提高到 3000', value: 3000, description: 'Dialog 为 3000，盖住挂件' },
]
const open = ref(false)

function updateZIndex(value: BingRadioValue) {
  zIndex.value = Number(value)
}
</script>

<template>
  <div class="layer-demo">
    <BingRadioGroup :model-value="zIndex" :options="layerOptions" direction="row" ariaLabel="浮层层级基准" @update:model-value="updateZIndex" />

    <BingConfigProvider :z-index="zIndex">
      <div class="layer-demo__actions">
        <BingButton :throttle="false" @click="open = true">打开弹窗</BingButton>
        <BingTooltip :content="`提示层级：${zIndex + 1200}`">
          <BingButton variant="secondary" :throttle="false">悬停查看提示层级</BingButton>
        </BingTooltip>
      </div>

      <BingDialog v-model="open" title="确认发布" width="420px" :show-footer="false">
        <p>弹窗层级 = 基准 {{ zIndex }} + 0。第三方挂件固定为 {{ widgetZIndex }}，基准为 3000 时被遮罩盖住。</p>
      </BingDialog>
    </BingConfigProvider>

    <p role="status">当前基准：{{ zIndex }}；弹窗 {{ zIndex }}，提示 {{ zIndex + 1200 }}；挂件 {{ widgetZIndex }}</p>

    <!-- 为了不遮挡文档页面，示例只在弹窗打开时显示挂件。 -->
    <aside v-if="open" class="layer-demo__widget" :style="{ zIndex: widgetZIndex }" aria-label="第三方客服挂件">
      第三方客服挂件 · z-index {{ widgetZIndex }}
    </aside>
  </div>
</template>

<style scoped>
.layer-demo { display: grid; gap: 16px; min-width: 0; }
.layer-demo__actions { display: flex; flex-wrap: wrap; gap: 10px; }
.layer-demo__widget {
  position: fixed;
  right: 24px;
  bottom: 24px;
  padding: 12px 16px;
  border-radius: 12px;
  background: #ea580c;
  color: #fff;
  font-size: 14px;
  box-shadow: 0 12px 32px rgb(0 0 0 / 0.24);
}
</style>
