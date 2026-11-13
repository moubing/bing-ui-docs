<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingDropDown, BingDropDownItem, type BingDropDownExpose } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const open = ref(false)
const dropdown = ref<BingDropDownExpose | null>(null)
const feedback = ref('等待操作')
function record(value: string) { feedback.value = value }
</script>

<template>
  <div class="stage">
    <!-- 控制按钮在菜单外，阻止 pointerdown 冒泡以免先关闭后又切换打开。 -->
    <div class="actions" @pointerdown.stop>
      <BingButton :throttle="false" @click="dropdown?.openPanel()">打开</BingButton>
      <BingButton :throttle="false" @click="dropdown?.close()">关闭</BingButton>
      <BingButton :throttle="false" @click="dropdown?.toggle()">切换</BingButton>
      <BingButton :throttle="false" @click="dropdown?.focusFirstItem()">聚焦第一项</BingButton>
    </div>
    <BingDropDown ref="dropdown" v-model:open="open" min-width="260px" auto-focus ariaLabel="受控菜单"
      @open="record('事件：open')" @close="record('事件：close')">
      <template #trigger="{ triggerProps }">
        <BingButton v-bind="triggerProps" :throttle="false">更多发布操作</BingButton>
      </template>
      <BingDropDownItem title="发布当前版本" tone="success" @click="record('选择：发布当前版本')" />
      <BingDropDownItem title="生成变更记录" @click="record('选择：生成变更记录')" />
      <BingDropDownItem title="复制 npm 命令" @click="record('选择：复制 npm 命令')" />
      <BingDropDownItem title="删除草稿" tone="danger" @click="record('选择：删除草稿')" />
    </BingDropDown>
    <p role="status">状态：{{ open ? '已打开' : '已关闭' }}；{{ feedback }}</p>
  </div>
</template>

<style scoped>
.stage { min-height: 340px; padding: 24px; }
.actions { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }
</style>
