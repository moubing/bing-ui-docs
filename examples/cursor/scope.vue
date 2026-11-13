<script setup lang="ts">
import { onActivated, onDeactivated, ref } from 'vue'
import { BingButton, BingCursor, BingDialog, BingInput } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const mounted = ref(true)
const globalEnabled = ref(false)
const open = ref(false)
const text = ref('Teleport 内容')
onActivated(() => { mounted.value = true })
onDeactivated(() => { globalEnabled.value = false; open.value = false; mounted.value = false })
</script>

<template>
  <BingButton @click="globalEnabled = !globalEnabled">{{ globalEnabled ? '关闭全局光标' : '开启全局光标' }}</BingButton>
  <p role="status">全局光标：{{ globalEnabled ? '已开启，离开页面时关闭' : '已关闭' }}</p>
  <BingCursor v-if="mounted && globalEnabled" global :size="28" />
  <p>混排长页面可复用一个全局实例，无需为每个段落或图片重复挂载。</p>
  <BingCursor v-if="mounted" type="crosshair" :size="36">
    <div class="local-zone">
      <p>外层局部：十字，36px</p>
      <BingCursor type="zoom-in" :size="44"><div class="inner-zone">内层局部：放大，44px</div></BingCursor>
      <BingButton @click="open = true">打开作用域弹窗</BingButton>
      <BingDialog v-model="open" title="Teleport 作用域" :show-footer="false">
        <p>弹窗在 body 下，局部光标不自动覆盖它。开启全局光标后，可在这里观察文本状态。</p>
        <BingInput :model-value="text" @update:model-value="text = String($event)" ariaLabel="弹窗中的光标输入" block />
      </BingDialog>
    </div>
  </BingCursor>
  <div class="outside-zone">局部作用域之外；只受已启用的全局光标影响。</div>
</template>

<style scoped>
.local-zone { display: grid; gap: 16px; padding: 20px; border: 1px solid var(--bing-border); border-radius: 8px; }
.local-zone .bing-button { justify-self: start; }
.inner-zone { padding: 24px 16px; background: var(--bing-surface-soft); border: 1px dashed var(--bing-border); border-radius: 6px; }
.outside-zone { padding: 20px 0; color: var(--bing-text-secondary); }
p { margin: 16px 0; font-size: 14px; line-height: 1.6; }
</style>
