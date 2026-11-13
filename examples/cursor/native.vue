<script setup lang="ts">
import { onActivated, onDeactivated, ref } from 'vue'
import { BingButton, BingCursor } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const mounted = ref(true)
const disabled = ref(false)
const visible = ref(false)
onActivated(() => { mounted.value = true })
onDeactivated(() => { mounted.value = false })
</script>

<template>
  <BingButton @click="disabled = !disabled">{{ disabled ? '启用光标' : '停用光标' }}</BingButton>
  <BingCursor v-if="mounted" :disabled="disabled" @visibility-change="visible = $event">
    <div class="native-zones">
      <div class="native-zone themed">十字光标：使用 BingCursor 外观</div>
      <div class="native-zone system" v-bind="{ 'data-bing-cursor': 'native' }">系统十字：显式保留原本的 CSS cursor</div>
      <div class="native-zone busy">忙碌光标：auto 保留未内置的 wait 状态</div>
    </div>
  </BingCursor>
  <p role="status">当前由 BingCursor 接管：{{ visible ? '是' : '否' }}。停用后仍可正常移动鼠标与点击。</p>
</template>

<style scoped>
.native-zones { display: grid; gap: 12px; margin-top: 16px; }
.native-zone { padding: 24px; border: 1px dashed var(--bing-border); border-radius: 8px; background: var(--bing-surface-soft); }
.themed, .system { cursor: crosshair; }
.busy { cursor: wait; }
p { color: var(--bing-text-secondary); font-size: 14px; line-height: 1.6; }
</style>
