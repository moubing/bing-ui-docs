<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingDialog, BingTreeSelect, type BingTreeSelectNode, type BingTreeSelectModelValue, type BingTreeSelectChangePayload, type BingTreeSelectExpandPayload } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const compositionMode = new URLSearchParams(location.search).has('composition')
const dialogOpen = ref(false)
const firstValue = ref<BingTreeSelectModelValue>(['parent-only'])
const secondValue = ref<BingTreeSelectModelValue>(null)
const compositionTree: BingTreeSelectNode[] = [
  { label: '仅父节点可选', value: 'parent-only', children: [{ label: '禁用子节点', value: 'locked-child', disabled: true }] },
  { label: '普通节点', value: 'leaf' },
]

// 根据 AI 导出的模型、搜索范围与事件说明重组，独立于文档站状态。
const nodes: BingTreeSelectNode[] = [
  { label: '核心分组', value: 'root', meta: { keyword: 'ParentOnly' }, children: [
    { label: 'Alpha Café', value: 1 },
    { label: 'Beta 字符串', value: '1' },
    { label: '禁用叶子', value: 'locked', disabled: true },
  ] },
  { label: '不可选目录', value: 'folder', selectable: false, children: [
    { label: '范围外节点', value: 'outside' },
  ] },
  { label: '禁用父节点', value: 'disabled-parent', disabled: true, children: [
    { label: '可选子节点', value: 'enabled-child' },
  ] },
]
const value = ref<BingTreeSelectModelValue>([1, 'ghost', 'locked'])
const strict = ref(false), disabled = ref(false), expandAll = ref(false)
const expandedDefaults = ref(['root'])
const events = ref<string[]>([]), changes = ref<BingTreeSelectChangePayload>(), expansion = ref<BingTreeSelectExpandPayload>()
function update(next: BingTreeSelectModelValue) { value.value = next; events.value.push('update') }
function change(payload: BingTreeSelectChangePayload) { changes.value = payload; events.value.push('change') }
function expanded(type: string, payload: BingTreeSelectExpandPayload) { expansion.value = payload; events.value.push(type) }
function outside() { value.value = ['outside', 'ghost']; events.value = [] }
</script>

<template>
  <main v-if="!compositionMode" style="padding: 20px; max-width: 700px">
    <label><input v-model="strict" type="checkbox">严格模式</label>
    <label><input v-model="disabled" type="checkbox">禁用选择器</label>
    <label><input v-model="expandAll" type="checkbox">默认全展开</label>
    <button @click="outside">设置范围外值</button>
    <button @click="expandedDefaults = ['folder']">修改默认展开</button>
    <BingTreeSelect id="reading-tree" ariaLabel="阅读树选择器" :modelValue="value" :options="nodes"
      multiple searchable block :checkStrictly="strict" :disabled="disabled"
      :defaultExpandedValues="expandedDefaults" :defaultExpandAll="expandAll"
      @update:modelValue="update" @change="change" @clear="events.push('clear')"
      @open="events.push('open')" @close="events.push('close')"
      @expand="expanded('expand', $event)" @collapse="expanded('collapse', $event)" />
    <pre id="model">{{ JSON.stringify(value) }}</pre>
    <pre id="payload">{{ JSON.stringify(changes) }}</pre>
    <pre id="events">{{ JSON.stringify(events) }}</pre>
    <pre id="expanded">{{ JSON.stringify(expansion) }}</pre>
  </main>
  <main v-else>
    <BingButton @click="dialogOpen = true">打开树选择表单</BingButton>
    <BingDialog v-model="dialogOpen" title="树选择组合">
      <BingTreeSelect v-model="firstValue" :options="compositionTree" ariaLabel="第一组树" multiple searchable default-expand-all block />
      <BingTreeSelect v-model="secondValue" :options="compositionTree" ariaLabel="第二组树" searchable default-expand-all block />
    </BingDialog>
  </main>
</template>
