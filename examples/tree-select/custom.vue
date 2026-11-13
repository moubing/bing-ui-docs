<script setup lang="ts">
import { computed, ref } from 'vue'
import { BingTag, BingTreeSelect } from '@moubing/bing-ui'
import type { BingTreeSelectModelValue, BingTreeSelectNode } from '@moubing/bing-ui'

const workspaceTree: BingTreeSelectNode[] = [
  {
    label: '组件库',
    value: 'library',
    description: '组件、主题和文档的主要工作区。',
    meta: {
      类型: '系统',
      状态: '维护中',
    },
    children: [
      {
        label: '基础组件',
        value: 'basic',
        description: '按钮、标签、图标和基础输入。',
        meta: {
          类型: '分组',
        },
        children: [
          { label: 'BingButton', value: 'button', description: '按钮和操作入口。' },
          { label: 'BingTag', value: 'tag', description: '轻量信息标记。' },
          { label: 'BingIcon', value: 'icon', description: '图标包装和语义标签。' },
        ],
      },
      {
        label: '表单组件',
        value: 'form',
        description: '输入、选择和校验相关控件。',
        meta: {
          类型: '分组',
        },
        children: [
          { label: 'BingInput', value: 'input', description: '单行文本输入。' },
          { label: 'BingSelect', value: 'select', description: '扁平选项选择器。' },
          {
            label: 'BingTreeSelect',
            value: 'tree-select',
            description: '层级数据选择器，支持搜索、级联和虚拟滚动。',
            meta: {
              类型: '当前组件',
              级联: '支持',
            },
          },
        ],
      },
    ],
  },
  {
    label: '动效系统',
    value: 'motion',
    description: '页面切换、文本动画和组件反馈。',
    meta: {
      引擎: 'GSAP',
      类型: '体验',
    },
    children: [
      {
        label: '转场组件',
        value: 'transition',
        children: [
          { label: 'AppSwitcherTransition', value: 'app-switcher-transition' },
          { label: 'CarouselTransition', value: 'carousel-transition' },
          { label: 'DeckTransition', value: 'deck-transition' },
        ],
      },
      {
        label: '文本动效',
        value: 'text-motion',
        children: [
          { label: 'BingAnimatedText', value: 'animated-text' },
          { label: '禁用示例', value: 'disabled-motion', disabled: true },
        ],
      },
    ],
  },
  {
    label: '文档结构',
    value: 'docs',
    selectable: false,
    description: '只负责展开层级，本身不可被选中。',
    children: [
      { label: '快速开始', value: 'getting-started' },
      { label: '组件示例', value: 'component-examples' },
      { label: 'API 表格', value: 'api-table' },
    ],
  },
]

const customValue = ref<BingTreeSelectModelValue>('motion')

const flatWorkspaceNodes = flattenTree(workspaceTree)

const selectedCustomText = computed(() => getSelectedLabels(customValue.value, flatWorkspaceNodes))

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

function formatValue(value: BingTreeSelectModelValue) {
  return JSON.stringify(value)
}

function metaValue(node: BingTreeSelectNode, key: string) {
  const value = node.meta?.[key]

  return value === undefined || value === null ? '' : String(value)
}

function labelParts(label: string, ranges: { start: number; end: number }[] = []) {
  const parts: { text: string; match: boolean }[] = []
  let offset = 0
  for (const range of ranges) {
    if (offset < range.start) parts.push({ text: label.slice(offset, range.start), match: false })
    parts.push({ text: label.slice(range.start, range.end), match: true })
    offset = range.end
  }
  if (offset < label.length) parts.push({ text: label.slice(offset), match: false })
  return parts
}
</script>

<template>
  <div class="tree-select-example">
    <BingTreeSelect
      id="tree-select-customValue"
      ariaLabel="自定义节点选择"
      v-model="customValue"
      :options="workspaceTree"
      searchable
      block
      placeholder="选择并查看节点详情"
      :default-expanded-values="['library', 'form', 'motion']"
    >
      <template #value="{ selectedNodes, placeholder }">
        <span class="tree-select-value-slot">
          <span v-if="selectedNodes.length">当前： {{ selectedNodes.map((node) => node.label).join('、') }}</span>
          <span v-else>{{ placeholder }}</span>
        </span>
      </template>
      <template #node="{ node, selected, indeterminate, matchRanges }">
        <span class="tree-select-node-line">
          <span class="tree-select-node-title">
            <strong><template v-for="(part, index) in labelParts(node.label, matchRanges)" :key="index"><mark v-if="part.match" class="bing-picker__match">{{ part.text }}</mark><template v-else>{{ part.text }}</template></template></strong>
            <small v-if="node.description">{{ node.description }}</small>
          </span>
          <BingTag v-if="metaValue(node, '类型')" size="sm" variant="soft" tone="secondary">
            {{ metaValue(node, '类型') }}
          </BingTag>
          <BingTag v-if="selected" size="sm" variant="soft" tone="success">已选</BingTag>
          <BingTag v-else-if="indeterminate" size="sm" variant="soft" tone="warning">部分</BingTag>
        </span>
      </template>
      <template #node-detail="{ node, selected, indeterminate }">
        <div class="tree-select-node-detail">
          <strong>{{ node.label }}</strong>
          <p>{{ node.description || '这个节点没有额外说明。' }}</p>
          <span v-if="metaValue(node, '类型')">类型： {{ metaValue(node, '类型') }}</span>
          <span v-if="metaValue(node, '状态')">状态： {{ metaValue(node, '状态') }}</span>
          <span v-if="metaValue(node, '引擎')">引擎： {{ metaValue(node, '引擎') }}</span>
          <span>选择状态： {{ selected ? '已选中' : indeterminate ? '部分选中' : '未选中' }}</span>
        </div>
      </template>
    </BingTreeSelect>
    <div class="tree-select-feedback">
      <span>当前文本： {{ selectedCustomText }}</span>
      <span>当前值： {{ formatValue(customValue) }}</span>
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
