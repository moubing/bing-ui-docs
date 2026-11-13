<script setup lang="ts">
import { computed, ref } from 'vue'
import { BingTreeSelect } from '@moubing/bing-ui'
import type { BingTreeSelectModelValue, BingTreeSelectNode, BingTreeSelectProps } from '@moubing/bing-ui'

type ExampleOptions = Pick<BingTreeSelectProps, 'defaultExpandAll' | 'virtual' | 'virtualItemHeight' | 'panelMaxHeight'>
// @docs-options:start
const options: ExampleOptions = {
  "defaultExpandAll": true,
  "virtual": true,
  "panelMaxHeight": 360
}
// @docs-options:end

const virtualTree: BingTreeSelectNode[] = Array.from({ length: 28 }, (_, groupIndex) => ({
  label: `工作区 ${groupIndex + 1}`,
  value: `workspace-${groupIndex + 1}`,
  description: groupIndex % 2 === 0 ? '设计与研发资源。' : '运营与交付资源。',
  meta: {
    层级: '一级',
    编号: groupIndex + 1,
  },
  children: Array.from({ length: 14 }, (_, itemIndex) => ({
    label: `资源 ${groupIndex + 1}-${itemIndex + 1}`,
    value: `workspace-${groupIndex + 1}-item-${itemIndex + 1}`,
    description: itemIndex % 3 === 0 ? '高频访问节点。' : '普通层级节点。',
    disabled: itemIndex === 12,
    meta: {
      分组: itemIndex % 2 === 0 ? 'A' : 'B',
    },
  })),
}))

const virtualValue = ref<BingTreeSelectModelValue>([
  'workspace-2-item-3',
  'workspace-8-item-6',
])

const flatVirtualNodes = flattenTree(virtualTree)

const selectedVirtualText = computed(() => getSelectedLabels(virtualValue.value, flatVirtualNodes))

function flattenTree(nodes: BingTreeSelectNode[]) {
  const result: BingTreeSelectNode[] = []

  function visit(list: BingTreeSelectNode[]) {
    list.forEach((node) => {
      result.push(node)

      if (node.children?.length) {
        visit(node.children)
      }
    })
  }

  visit(nodes)

  return result
}

function normalizeValue(value: BingTreeSelectModelValue) {
  if (Array.isArray(value)) {
    return value
  }

  return value === null ? [] : [value]
}

function getSelectedLabels(value: BingTreeSelectModelValue, nodes: BingTreeSelectNode[]) {
  const selectedValues = normalizeValue(value)

  if (!selectedValues.length) {
    return '未选择'
  }

  return selectedValues
    .map((selectedValue) => nodes.find((node) => node.value === selectedValue)?.label ?? selectedValue)
    .join('、')
}

function formatSelectedCount(value: BingTreeSelectModelValue) {
  return normalizeValue(value).length
}
</script>

<template>
  <div class="tree-select-example">
    <BingTreeSelect
      id="tree-select-virtualValue"
      ariaLabel="大量层级节点"
      v-model="virtualValue"
      :options="virtualTree"
      multiple
      searchable
      :default-expand-all="options.defaultExpandAll"
      :virtual="options.virtual"
      :virtual-threshold="20"
      :virtual-item-height="options.virtualItemHeight"
      :virtual-overscan="6"
      :panel-max-height="options.panelMaxHeight"
      placeholder="搜索并选择大量层级节点"
      block
    />
    <div class="tree-select-feedback">
      <span>已选数量： {{ formatSelectedCount(virtualValue) }}</span>
      <span>已选文本： {{ selectedVirtualText }}</span>
    </div>
  </div>
</template>

<style scoped>
.tree-select-example { padding: 16px; display: grid; gap: 16px; max-width: 1000px; min-width: 0; }
.tree-select-feedback {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.1rem;
}

.tree-select-feedback span {
  max-width: 100%;
  border: 1px solid var(--bing-border);
  border-radius: 6px;
  background: var(--bing-surface-solid);
  padding: 0.35rem 0.55rem;
  color: var(--bing-muted);
  font-size: 0.86rem;
  font-weight: 400;
}

.tree-select-value-slot {
  display: inline-block;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tree-select-node-line {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 0.45rem;
}

.tree-select-node-title {
  display: grid;
  min-width: 0;
  gap: 0.1rem;
}

.tree-select-node-title strong,
.tree-select-node-title small {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tree-select-node-title small {
  color: var(--bing-muted);
  font-size: 0.72rem;
  font-weight: 400;
}

.tree-select-node-detail {
  display: grid;
  gap: 0.35rem;
}

.tree-select-node-detail strong {
  color: var(--bing-heading);
}

.tree-select-node-detail p,
.tree-select-node-detail span {
  margin: 0;
  color: var(--bing-muted);
  font-size: 0.78rem;
  line-height: 1.45;
}

.tree-select-feedback span { overflow-wrap: anywhere; }

</style>
