<script setup lang="ts">
import { computed, ref } from 'vue'
import { BingTreeSelect } from '@moubing/bing-ui'
import type { BingTreeSelectModelValue, BingTreeSelectNode, BingTreeSelectProps } from '@moubing/bing-ui'

type ExampleOptions = Pick<BingTreeSelectProps, 'checkStrictly' | 'showSelectAll' | 'clearable'>
// @docs-options:start
const options: ExampleOptions = {
  "checkStrictly": false,
  "showSelectAll": true,
  "clearable": true
}
// @docs-options:end

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

const cascadeValue = ref<BingTreeSelectModelValue>(options.checkStrictly ? ['library', 'button', 'select'] : ['button', 'select'])

const flatWorkspaceNodes = flattenTree(workspaceTree)

const selectedCascadeText = computed(() => getSelectedLabels(cascadeValue.value, flatWorkspaceNodes))

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

function formatSelectedCount(value: BingTreeSelectModelValue) {
  return normalizeValue(value).length
}
</script>

<template>
  <div class="tree-select-example">
    <BingTreeSelect
      id="tree-select-cascadeValue"
      ariaLabel="选择组件范围"
      v-model="cascadeValue"
      :options="workspaceTree"
      multiple
      :check-strictly="options.checkStrictly"
      :show-select-all="options.showSelectAll"
      :clearable="options.clearable"
      select-all-text="选择当前可选节点"
      clear-all-text="清空已选节点"
      placeholder="选择组件范围"
      :default-expanded-values="['library', 'basic', 'form']"
      block
    />
    <div class="tree-select-feedback">
      <span>已选数量： {{ formatSelectedCount(cascadeValue) }}</span>
      <span>已选文本： {{ selectedCascadeText }}</span>
      <span>当前值： {{ formatValue(cascadeValue) }}</span>
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
