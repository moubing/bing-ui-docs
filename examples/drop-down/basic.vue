<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingDropDown, BingDropDownItem, type BingDropDownProps } from '@moubing/bing-ui'
import { FilePlus2, FolderOpen, PenLine, Trash2 } from 'lucide-vue-next'
import '@moubing/bing-ui/style.css'

// @docs-options:start
const options: BingDropDownProps = {
  "trigger": "click",
  "placement": "bottom-end",
  "size": "md",
  "minWidth": "220px",
  "closeOnOutside": true,
  "closeOnEscape": true,
  "autoFocus": false,
  "loop": true,
  "glass": true
}
// @docs-options:end
const open = ref(false)
const events = ref<string[]>([])
function record(action: string) { events.value = [...events.value, action].slice(-6) }
</script>

<template>
  <div class="stage">
    <BingDropDown v-model:open="open" v-bind="options" ariaLabel="文档操作"
      @open="record('菜单已打开')" @close="record('菜单已关闭')">
      <template #trigger="{ triggerProps, open: visible }">
        <BingButton v-bind="triggerProps" variant="secondary" :throttle="false">{{ visible ? '关闭菜单' : '打开菜单' }}</BingButton>
      </template>
      <BingDropDownItem title="新建页面" description="创建一个文档页" :icon="FilePlus2" shortcut="Ctrl+N" @click="record('点击：新建页面')" />
      <BingDropDownItem title="打开目录" description="查看当前组件分组" :icon="FolderOpen" shortcut="Ctrl+O" @click="record('点击：打开目录')" />
      <BingDropDownItem title="重命名" :icon="PenLine" shortcut="F2" @click="record('点击：重命名')" />
      <BingDropDownItem title="删除草稿" tone="danger" :icon="Trash2" shortcut="Del" @click="record('点击：删除草稿')" />
    </BingDropDown>
    <p role="status">{{ events.join(' → ') || '等待打开菜单' }}</p>
  </div>
</template>

<style scoped>
.stage { min-height: 360px; padding: 24px; text-align: right; }
</style>
