<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import { BingDropDown, BingDropDownItem } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const boundary = shallowRef<HTMLElement>()
const anchor = shallowRef<{ getBoundingClientRect: () => DOMRect }>()
const open = ref(false)
const selected = ref('尚未选择')
function show(event: MouseEvent) {
  const rect = new DOMRect(event.clientX, event.clientY, 1, 20)
  anchor.value = { getBoundingClientRect: () => rect }
  open.value = true
}
</script>

<template>
  <div ref="boundary" class="caret-stage" @click="show">
    <p>点击区域内任意位置，按矩形锚点打开菜单；靠近底部时向上展开。</p>
    <BingDropDown v-model:open="open" :anchor="anchor" :boundary="boundary" :width="280" :min-width="0" ariaLabel="虚拟锚点菜单">
      <div @mousedown.prevent>
        <BingDropDownItem v-for="index in 16" :key="index" :title="`块命令 ${index}`" shortcut="Enter" @click="selected = `块命令 ${index}`" />
      </div>
    </BingDropDown>
  </div>
  <p role="status">{{ selected }}</p>
</template>

<style scoped>
.caret-stage { height: 360px; padding: 16px; border: 1px dashed var(--bing-border); border-radius: 8px; }
</style>
