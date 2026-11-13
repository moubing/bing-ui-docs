<script setup lang="ts">
import { ref } from 'vue'
import { BingCard, type BingCardProps, type BingCardFlipSide } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

// @docs-options:start
const options: BingCardProps = {
  "flipTrigger": "click",
  "flipAxis": "y",
  "longPressRelease": "stay"
}
// @docs-options:end
const side = ref<BingCardFlipSide>('front')
const presses = ref(0)
function handleFlip(value: BingCardFlipSide) { side.value = value }
function handleLongPress() { presses.value++ }
</script>

<template>
  <BingCard v-bind="options" title="可翻面的卡片" variant="sky" rounded="lg"
    @flip="handleFlip" @long-press="handleLongPress">
    <p>正面展示摘要内容。</p>
    <template #back><div>反面展示更多细节。</div></template>
  </BingCard>
  <p role="status">当前面：{{ side }}；长按触发：{{ presses }}</p>
  <p>此例演示指针翻面；关键说明同时放在普通正文中：反面展示更多细节。</p>
</template>
