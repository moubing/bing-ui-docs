<script setup lang="ts">
import { ref } from 'vue'
import { BingCheckbox, BingInput, type BingInputValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const value = ref<BingInputValue>(40)
const accept = ref(true)
const changes = ref(0)
const entered = ref('')
function update(next: BingInputValue) { if (accept.value) value.value = next }
</script>
<template>
  <div style="display: grid; gap: 18px" @change="changes++">
    <BingCheckbox v-model="accept" label="接受数字更新" />
    <BingInput :model-value="value" type="number" prefix="宽度" suffix="px" scrub clearable :min="0" :max="100" :step="5" ariaLabel="前缀拖动调值" block @update:model-value="update" @enter="entered = JSON.stringify($event)" />
    <p role="status">已接受：{{ JSON.stringify(value) }}；change：{{ changes }}；Enter：{{ entered }}</p>
    <p>拖动“宽度”前缀，每 4px 一步；Shift 十倍，Esc 取消。输入 43 后 Enter 观察规整，清空为 null；拒绝更新时结束后回弹。</p>
  </div>
</template>
