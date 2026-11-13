<script setup lang="ts">
// 根据导出正文重组的本地阅读应用：验证状态、事件与已说明的版本限制。
import { ref } from 'vue'
import { BingDialog, type BingDialogCloseReason } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const open = ref(false)
const loading = ref(false)
const accept = ref(false)
const events = ref<string[]>([])
const first = ref(false)
const second = ref(false)
const pairEvents = ref<string[]>([])
const customTitleOpen = ref(false)
function update(value: boolean) { events.value.push(`update:${value}`); if (accept.value) open.value = value }
function closed(reason: BingDialogCloseReason) { events.value.push(`close:${reason}`) }
</script>

<template>
  <button id="opener" type="button" @click="open = true; events = []">打开事件实验</button>
  <button id="background" type="button">背景可聚焦按钮</button>
  <button type="button" @click="first = true; second = true">同时打开两个</button>
  <button type="button" @click="customTitleOpen = true">打开自定义标题边界</button>
  <p id="state">{{ JSON.stringify({ open, events }) }}</p>
  <p id="pair">{{ JSON.stringify({ first, second, pairEvents }) }}</p>
  <BingDialog v-model="customTitleOpen" title="被插槽替换的标题" ariaLabel="插槽名称">
    <template #title><h2>真实标题插槽</h2></template>
    <p>同时传 title 和自定义插槽时，默认标题节点仍会被替换。</p>
  </BingDialog>
  <BingDialog :model-value="open" ariaLabel="事件实验" ariaDescribedby="explanation"
    :overlay-blur="false" :show-footer="false" :confirm-loading="loading" confirm-disabled close-on-confirm
    @update:model-value="update" @close="closed" @cancel="events.push('cancel')" @confirm="events.push('confirm')">
    <p id="explanation">验证未接收模型更新和自定义操作的行为。</p>
    <label><input v-model="loading" type="checkbox">模拟加载</label>
    <label><input v-model="accept" type="checkbox">接收关闭更新</label>
    <button type="button" @click="open = false">直接设置 false</button>
    <template #footer="{ confirm, cancel, close, busy }">
      <button type="button" :disabled="busy" @click="confirm">插槽确认</button>
      <button type="button" :disabled="busy" @click="cancel">插槽取消</button>
      <button type="button" :disabled="busy" @click="close('confirm')">仅携带 confirm 原因</button>
    </template>
  </BingDialog>
  <!-- 同时打开，用于回归唯一标题、顶层 Escape 和滚动锁计数。 -->
  <BingDialog v-model="first" title="第一个标题" :overlay-blur="false" @close="reason => pairEvents.push('first:' + reason)">
    <p>下层窗口</p>
  </BingDialog>
  <BingDialog v-model="second" title="第二个标题" :overlay-blur="false" :z-index="2100" @close="reason => pairEvents.push('second:' + reason)">
    <button type="button" @click="first = false">先关闭下层</button>
  </BingDialog>
</template>
