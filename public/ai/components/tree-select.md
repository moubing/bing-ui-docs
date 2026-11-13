# BingTreeSelect

> 目标组件包：@moubing/bing-ui 0.19.0；文档修订：r3。
> 已验证：已完成 0.19.0 的文档与示例验证。

此文件由正文、API 数据和完整示例自动生成，可直接阅读，不需要启动文档站。修改源文件后运行 pnpm docs:export tree-select；请勿手工修改生成结果。

运行示例需要已配置 Vue 3 单文件组件的项目，依赖 Vue 3.5 与 GSAP 3.15 系列，导入 zod 的示例另需安装 Zod 4（Bing UI 的可选 peer 依赖）；Bing UI 使用上方标注的版本。示例已导入组件和样式，不依赖 Nuxt 别名、文档站组件或组件自动注册。五个 Vue 代码块是独立示例，分别保存为一个 .vue 文件使用。TypeScript 项目需配置 CSS 导入类型声明，例如 Vite 项目的 vite/client。

0.17.0 新增 typeahead/highlightMatches、搜索展开快照、混合勾选 ARIA 和宽度折叠标签。options 是演示配置，树数据、回调和样式完整内置。级联输出包含父节点和可选后代；搜索批量范围可能包含未显示子节点，未知值会在下一次操作时移除。

BingTreeSelect 是层级数据选择器，适合组织架构、资源目录、组件分组这类带父子关系的选项。它支持单选、多选级联、严格选择、搜索、批量选择、展开收起、节点详情和虚拟滚动，能在表单里直接作为复杂选择控件使用。

本文与正式发布的 `@moubing/bing-ui@0.17.0` 一致，包含字符定位、搜索命中高亮、搜索展开状态恢复和标签折叠交互。

## 基础选择

单选场景使用普通的 `v-model` 即可。下面的示例可以调整尺寸、搜索策略、状态、清空按钮和面板高度，同时观察 `change`、展开和收起事件。

示例中的 options 是演示配置，不是组件默认值。完整树、选择状态、事件处理和必要样式都在代码中，可复制到普通 Vue 项目。单选空值为 null，多选空值为 ；请同步 v-model，组件不会替业务保存选择。

模型使用节点原始 value，数字 1 和字符串 1 不同。显示会移除未知值、去重并按全树前序排列；这些归一化不会主动回写外部模型，下一次用户选择才输出新值。单选误传数组时只识别第一项。默认多选先展开传入值的可选子树，并在所有可选后代已选时补齐父节点；业务反馈展示的原始值与触发器归一化结果因此可能不同。

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import { BingTreeSelect } from '@moubing/bing-ui'
import type { BingTreeSelectChangePayload, BingTreeSelectExpandPayload, BingTreeSelectModelValue, BingTreeSelectNode, BingTreeSelectProps } from '@moubing/bing-ui'

type ExampleOptions = Pick<BingTreeSelectProps, 'placeholder' | 'size' | 'searchable' | 'typeahead' | 'highlightMatches' | 'status' | 'block' | 'clearable' | 'showTreeActions' | 'disabled' | 'panelMaxHeight'>
const options: ExampleOptions = {
  "placeholder": "请选择组件分组",
  "size": "md",
  "searchable": "auto",
  "typeahead": true,
  "highlightMatches": true,
  "status": "default",
  "block": true,
  "clearable": true,
  "showTreeActions": true,
  "disabled": false,
  "panelMaxHeight": 320
}

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

const singleValue = ref<BingTreeSelectModelValue>('tree-select')

const eventLog = ref('等待选择')

const flatWorkspaceNodes = flattenTree(workspaceTree)

const selectedSingleText = computed(() => getSelectedLabels(singleValue.value, flatWorkspaceNodes))

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

function handleBasicChange(payload: BingTreeSelectChangePayload) {
  eventLog.value += ' → ' + `change：${getSelectedLabels(payload.value, flatWorkspaceNodes)}`
}

function handleTreeEvent(type: string) {
  eventLog.value += ' → ' + type
}

function handleExpand(type: 'expand' | 'collapse', payload: BingTreeSelectExpandPayload) {
  eventLog.value += ' → ' + `${type === 'expand' ? '展开' : '收起'}：${payload.node.label}`
}
</script>

<template>
  <div class="tree-select-example">
    <BingTreeSelect
      id="tree-select-singleValue"
      ariaLabel="选择组件节点"
      v-model="singleValue"
      :options="workspaceTree"
      :placeholder="options.placeholder"
      :size="options.size"
      :searchable="options.searchable"
      :status="options.status"
      :block="options.block"
      :clearable="options.clearable"
      :show-tree-actions="options.showTreeActions"
      :disabled="options.disabled"
      :panel-max-height="options.panelMaxHeight"
      :default-expanded-values="['library', 'form']"
      @change="handleBasicChange"
      @clear="handleTreeEvent('clear：已清空')"
      @open="handleTreeEvent('open：面板已打开')"
      @close="handleTreeEvent('close：面板已关闭')"
      @expand="handleExpand('expand', $event)"
      @collapse="handleExpand('collapse', $event)"
    />
    <div class="tree-select-feedback">
      <span>当前值： {{ formatValue(singleValue) }}</span>
      <span>当前文本： {{ selectedSingleText }}</span>
      <span>事件： {{ eventLog }}</span>
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
```

## 多选与级联

`multiple` 开启多选。默认模式会做父子级联，选中父节点会带上可选子节点；开启 `checkStrictly` 后，父节点和子节点互不影响。

级联会输出父节点与可选后代的完整值集合，不是仅输出叶子。选中父节点会补齐子树；取消某个子节点会取消不再全选的可选祖先。disabled/selectable=false 只约束本节点，不传递到子节点。严格模式保留外部传入的已知禁用/不可选值；默认级联会重新计算它们的可选分支。

本例切换 checkStrictly 时主动重置示例值，便于对照。组件本身切换此属性只重新计算显示，不主动更新外部模型。若可选父节点的全部后代都不可选，当前级联归一化仍会移除该父节点；需要单独选择它时使用严格模式。

侧栏是全选/清空当前范围的切换按钮，不是反选。无搜索时覆盖整棵树，包含折叠和虚拟列表尚未挂载的节点；有搜索时先找自身匹配的可选节点，级联模式再包含其可选后代。因此搜索只显示一个匹配父节点时，批量选择仍可能选中未显示的子节点，并补齐祖先。范围外选择通常保留，但未知值会在归一化时移除，级联祖先也会重新计算。

右侧清除按钮清空整个模型；clearable=false 仅隐藏这个按钮，不禁止 Tag 删除或侧栏清空。0.17.0 起根据触发器实际宽度显示能容纳的 Tag，其余折叠为 +N；容器或字体变化会重新测量。删除父 Tag 会取消其级联子树，批量清空的标签退场结束后才显示占位文字。

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import { BingTreeSelect } from '@moubing/bing-ui'
import type { BingTreeSelectModelValue, BingTreeSelectNode, BingTreeSelectProps } from '@moubing/bing-ui'

type ExampleOptions = Pick<BingTreeSelectProps, 'checkStrictly' | 'showSelectAll' | 'clearable'>
const options: ExampleOptions = {
  "checkStrictly": false,
  "showSelectAll": true,
  "clearable": true
}

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
```

## 节点内容与详情

每个节点可以携带 `description` 和 `meta`。当节点有说明或使用 `node-detail` 插槽时，悬停节点会展示详情面板；`value` 和 `node` 插槽可以接管触发器文本和节点行内容。

搜索是同步本地筛选，覆盖自身 label、value、description 以及非空 meta 的键和值，忽略大小写和拉丁重音，多个词需都匹配。0.17.0 起支持英文/中文拼音首字母，默认标签按 `highlightMatches` 高亮匹配片段。自定义 `node` 插槽通过 `matchRanges` 获取 UTF-16 起止位置（end 不包含在片段内），自行渲染高亮；关闭高亮只影响片段，不改变筛选。搜索不会自动拼接祖先路径，没有远程查询事件或异步子节点加载。

搜索结果保留匹配节点的祖先路径，但匹配父节点不会让所有不匹配子节点显示。0.17.0 起在开始搜索时保存展开快照，每次修改查询自动展开匹配路径，随后可手动收起；清空查询恢复搜索前的展开状态，并在需要时展开当前活动节点的祖先。收起包含活动节点的分支时，活动节点先移到父级。详情浮层 aria-hidden=true，只适合补充展示，关键说明需同时放在普通行或正文中，勿在详情里放交互控件。

```vue
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
```

## 搜索与虚拟滚动

当层级节点很多时，开启 `virtual` 可以只渲染视口附近的节点；搜索会匹配节点标签、值、说明和 `meta` 字段，适合大目录里快速定位。

`smoothScroll` 默认只作用于下拉面板的选项树；设为 `false` 可关闭。节点展开、收起、搜索或数据结构变化时，会先停止当前动画，再校正滚动位置与虚拟视口。

本例生成 28 个父节点、每个 14 个子节点，共 420 个节点。virtual=true 只挂载可见范围附近的节点，auto 则用展开/搜索后的可见数量与阈值比较；不是全树数量。虚拟化不会减少搜索、树展开和级联计算的数据量。默认 sm/md/lg 节点行高为 28/32/36px，虚拟行高不能小于当前尺寸的默认值；插槽内容需保持固定高度。本例省略自定义行高，参数留空时继续跟随尺寸。

defaultExpandedValues 只在首次初始化读取。defaultExpandAll=true 时，选项数据或默认展开配置变化可重新全展开；切换为 false 只保留仍有效的展开键，不代表收起全部。单个节点展开事件不覆盖全部展开/收起操作，因此不能靠这两个事件重建受控展开状态。

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import { BingTreeSelect } from '@moubing/bing-ui'
import type { BingTreeSelectModelValue, BingTreeSelectNode, BingTreeSelectProps } from '@moubing/bing-ui'

type ExampleOptions = Pick<BingTreeSelectProps, 'defaultExpandAll' | 'virtual' | 'virtualItemHeight' | 'panelMaxHeight'>
const options: ExampleOptions = {
  "defaultExpandAll": true,
  "virtual": true,
  "panelMaxHeight": 360
}

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
```

## 键盘与层级提示

打开后用 ↑ / ↓ 移动活动节点，Home / End 定位首尾，Enter 选择，Escape 先清空查询、再次关闭。无搜索框时，`typeahead=true` 在 500ms 内累计字符匹配可见标签前缀或英文/拼音首字母；重复字符在匹配节点间循环，不自动选择。

| 按键          | 搜索框中的行为                         |
| ----------- | ------------------------------- |
| →           | 光标折叠且位于末尾时展开当前节点；已展开则移到第一个可用子节点 |
| ←           | 光标折叠且位于开头时收起当前节点；已收起则移到父节点      |
| Alt + ← / → | 无论光标位置，都执行树导航                   |
| *           | 查询为空时展开当前节点的同级分支                |
| 空格          | 查询为空时切换多选或确认单选；有查询时保留文本输入       |

光标在中间、有文字选区或输入法正在组词时保留编辑行为。节点展开按钮只供鼠标使用，不进入 Tab 顺序；多选树以 `aria-checked=true/false/mixed` 表达状态，单选用 `aria-selected`。普通树与虚拟树的节点都提供层级、同级总数与序号，搜索框和触发器通过活动后代指向当前节点。

展开时新节点轻微下移淡入，收起时后代先淡出再移除；普通面板高度随内容过渡，虚拟树立即更新滚动高度。减少动态效果偏好下即时更新。选中节点以勾选和字重区分；详情图标仅在悬停、活动或聚焦时出现，触摸设备始终显示。

层级引导线使用 `--bing-tree-select-indent`（默认 `16px`）和 `--bing-tree-select-guide-color`（默认 `--bing-border`），活动节点的祖先路径使用 `--bing-border-strong`。变量可放在主题、组件根元素或 `.bing-tree-select__panel` 上；根元素上的配置在面板定位时同步到 Teleport 面板。

受控 `expandedValues`、懒加载和 `showCheckedStrategy` 属于后续范围，当前版本未提供。

## 弹层定位

`panelPlacement` 控制面板优先出现的位置，`panelAlign` 控制面板相对触发器的对齐方式，`panelGap` 控制间距。空间不足时，`auto` 会自动选择更合适的方向。

auto 只在上方与下方之间选择；显式 left/right/top/bottom 不自动翻面，但坐标仍限制在视口内。面板最小宽度通常为 280px，视口较窄时缩到可用宽度。高度字符串以 parseFloat 解析为像素，不能用百分比表达比例。侧栏与详情可能挤占窄屏空间，关键操作不要只依赖悬浮详情。

默认磨砂跟随主题：浅色不透明度 0.86、深色 0.92，模糊 16px，饱和度 1.05。显式设置 glassOpacity 等参数会覆盖主题默认值。

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import { BingTreeSelect } from '@moubing/bing-ui'
import type { BingTreeSelectModelValue, BingTreeSelectNode, BingTreeSelectProps } from '@moubing/bing-ui'

type ExampleOptions = Pick<BingTreeSelectProps, 'panelPlacement' | 'panelAlign' | 'panelGap'>
const options: ExampleOptions = {
  "panelPlacement": "auto",
  "panelAlign": "start",
  "panelGap": 10
}

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

const panelValue = ref<BingTreeSelectModelValue>('select')

const flatWorkspaceNodes = flattenTree(workspaceTree)

const selectedPanelText = computed(() => getSelectedLabels(panelValue.value, flatWorkspaceNodes))

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
</script>

<template>
  <div class="tree-select-example">
    <BingTreeSelect
      id="tree-select-panelValue"
      ariaLabel="树选择器定位"
      v-model="panelValue"
      :options="workspaceTree"
      :panel-placement="options.panelPlacement"
      :panel-align="options.panelAlign"
      :panel-gap="options.panelGap"
      placeholder="测试弹层位置"
      :default-expanded-values="['library', 'form']"
      block
    />
    <div class="tree-select-feedback">
      <span>当前文本： {{ selectedPanelText }}</span>
      <span>位置： {{ options.panelPlacement }} / {{ options.panelAlign }}</span>
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
```

## Props

| Prop                    | 类型                                               | 默认值                                                    | 说明                                                                        |
| ----------------------- | ------------------------------------------------ | ------------------------------------------------------ | ------------------------------------------------------------------------- |
| `id`                    | `string`                                         | `undefined（自动生成 / FormItem controlId）`                 | 触发按钮 id；默认自动生成唯一值，FormItem 内关联字段标签；内部 tree/node ID 也按实例隔离。                |
| `modelValue`            | `BingTreeSelectModelValue`                       | `null`                                                 | 单选用原始 value 或 null，多选用数组；严格区分数字和字符串。显示会归一化，但不会因归一化自动回写外部模型。               |
| `options`               | `BingTreeSelectNode[]`                           | `[]`                                                   | 完整树数据；所有层级 value 必须唯一且稳定，不能重复或循环引用。                                       |
| `multiple`              | `boolean`                                        | `false`                                                | 开启多选；单选不会级联。组件不维护业务选择值，必须同步更新或使用 v-model。                                 |
| `checkStrictly`         | `boolean`                                        | `false`                                                | 仅多选有效；true 父子独立，false 按可选子树展开并补齐已全选父节点。                                   |
| `placeholder`           | `string`                                         | `'请选择节点'`                                              | 没有可识别的已选节点时显示；提供 ariaLabel 后可访问名称不随选择改变。                                  |
| `disabled`              | `boolean`                                        | `undefined（继承 Form，否则 false）`                          | 未设置时继承 Form，最终默认 false；显式 false 可覆盖继承。禁用时关闭面板、禁止选择和清空。                    |
| `clearable`             | `boolean`                                        | `true`                                                 | 只控制触发器清除按钮；不禁止 Tag 删除或侧栏清空当前结果。                                           |
| `showSelectAll`         | `boolean`                                        | `true`                                                 | 多选时显示一个切换全选/清空当前范围的按钮；不是逐项反选。                                             |
| `selectAllText`         | `string`                                         | `'全选'`                                                 | 批量选择按钮和提示的文案前缀，组件另加数量。                                                    |
| `clearAllText`          | `string`                                         | `'清空已选'`                                               | 当前范围全选后切换为此清空文案；可能保留范围外选择。                                                |
| `showTreeActions`       | `boolean`                                        | `true`                                                 | 有分支时显示展开/收起全部按钮；不隐藏每个节点的展开按钮。                                             |
| `expandAllText`         | `string`                                         | `'全部展开'`                                               | 全部展开按钮文案前缀。                                                               |
| `collapseAllText`       | `string`                                         | `'全部收起'`                                               | 全部收起按钮文案前缀。                                                               |
| `emptyText`             | `string`                                         | `'暂无节点'`                                               | 无普通可见节点时的提示。                                                              |
| `searchable`            | `BingTreeSelectSearchable`                       | `'auto'`                                               | auto 根据整棵树节点数严格大于 8 启用搜索；布尔值使用动态绑定。                                       |
| `typeahead`             | `boolean`                                        | `true`                                                 | 0.17.0 新增：无搜索框且面板打开时，500ms 内累计字符定位可见标签前缀或英文/拼音首字母；重复字符循环。                 |
| `highlightMatches`      | `boolean`                                        | `true`                                                 | 0.17.0 新增：默认节点标签高亮匹配片段，node 插槽同时获得 matchRanges；关闭不影响筛选。                   |
| `searchPlaceholder`     | `string`                                         | `'搜索节点（/）'`                                            | 搜索框占位；不含 / 时自动追加 (/) 提示。                                                  |
| `noSearchResultsText`   | `string`                                         | `'未找到匹配节点'`                                            | 有效搜索无匹配结果时的提示。                                                            |
| `smoothScroll`          | `BingTreeSelectSmoothScroll`                     | `true`                                                 | 仅面板树滚动区域；false 关闭，配置见后表。                                                  |
| `defaultExpandedValues` | `BingTreeSelectValue[]`                          | `[]`                                                   | 首次挂载读取并过滤非分支键；之后修改不会重新设置展开状态。                                             |
| `defaultExpandAll`      | `boolean`                                        | `false`                                                | 首次或数据/默认展开配置变化时为 true 会重新全展开；切换 false 不会自动全部收起。                           |
| `size`                  | `BingTreeSelectSize`                             | `undefined（继承 FormItem / Form / ConfigProvider，否则 md）` | 显式值优先，其次继承 Form，再次 ConfigProvider，最后 md；触发器高度 32/36/40px，节点行高 28/32/36px。 |
| `block`                 | `boolean`                                        | `false`                                                | 撑满父容器；在 FormItem 内即使传 false 也会撑满。                                         |
| `panelMinHeight`        | `string \| number`                               | `180`                                                  | 数字或字符串经 parseFloat 后按 px；不是视口比例。受最大高度和可用空间限制。                             |
| `panelMaxHeight`        | `string \| number`                               | `360`                                                  | 数字或字符串按 px 解析，包含搜索区；视口空间可进一步限制高度。建议传有限数字。                                 |
| `panelPlacement`        | `BingTreeSelectPanelPlacement`                   | `'auto'`                                               | auto 只自动选择上/下；显式方向不会自动翻面，仍会夹紧坐标。                                          |
| `panelAlign`            | `BingTreeSelectPanelAlign`                       | `'start'`                                              | start/middle/end；上下方向按水平对齐，左右方向按垂直对齐。                                     |
| `panelGap`              | `number`                                         | `10`                                                   | 有限非负像素；非法值回退 10，负数取 0。                                                    |
| `virtual`               | `BingTreeSelectVirtualMode`                      | `'auto'`                                               | true 对非空可见集合启用；auto 按展开或搜索后的可见节点数严格大于阈值启用。                                |
| `virtualThreshold`      | `number`                                         | `120`                                                  | 最小 0，向下取整；不按原始全树节点数判断。                                                    |
| `virtualItemHeight`     | `number`                                         | `undefined（随 size 为 28/32/36）`                         | 有限数字向下取整且不小于当前尺寸节点行高；未设置或非有限值使用默认行高，自定义内容应保持固定高度。                         |
| `virtualOverscan`       | `number`                                         | `5`                                                    | 上下额外渲染节点数，最小 0，向下取整。                                                      |
| `ariaLabel`             | `string`                                         | `undefined`                                            | 触发器可访问名称；省略时用选中标签或占位文案。                                                   |
| `ariaDescribedby`       | `string`                                         | `undefined`                                            | 与 FormItem 提供的描述 id 合并。                                                   |
| `status`                | `'default' \| 'error' \| 'success' \| 'warning'` | `undefined（继承 FormItem，否则 default）`                    | 只改变外观/aria-invalid，不校验值；可以继承 FormItem 状态。                                 |
| `glass`                 | `boolean`                                        | `true`                                                 | 是否开启玻璃效果。                                                                 |
| `glassBlur`             | `string \| number`                               | `undefined（主题默认 16）`                                   | 玻璃模糊强度，省略时跟随主题。                                                           |
| `glassOpacity`          | `number`                                         | `undefined（浅色 0.86 / 深色 0.92）`                         | 玻璃底色不透明度，省略时跟随主题。                                                         |
| `glassSaturation`       | `number`                                         | `undefined（主题默认 1.05）`                                 | 玻璃饱和度，省略时跟随主题。                                                            |

## 节点数据

| 字段              | 类型                                        | 说明                                                           |
| --------------- | ----------------------------------------- | ------------------------------------------------------------ |
| `label`         | `string`                                  | 必填，节点文本；默认搜索字段。                                              |
| `value`         | `BingTreeSelectValue`                     | 必填，全树唯一，字符串与数字按严格相等区分。                                       |
| `disabled`      | `boolean`                                 | 默认 false，仅本节点不能选择，不自动禁用子节点；展开按钮仍可使用。                         |
| `selectable`    | `boolean`                                 | 默认 true；false 节点只负责展开且不加入级联值，子节点仍可选。                         |
| `description`   | `string`                                  | 节点说明，参与搜索和默认详情；不会自动在普通行中显示。                                  |
| `children`      | `BingTreeSelectNode[]`                    | 子树，省略或空数组为叶子；数据必须是无环树。                                       |
| `meta`          | `NonNullable<BingTreeSelectNode['meta']>` | 键和值参与搜索及默认详情；值支持 string/number/boolean/null/undefined，空值不显示。 |
| `[key: string]` | `unknown`                                 | 可携带业务字段；插槽使用前先做类型判断，不自动参与搜索。                                 |

## Slots

| 插槽            | 参数                                                                                                                                                         | 说明                                                                               |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `value`       | `{ selectedNodes: BingTreeSelectNode[]; placeholder: string }`                                                                                             | 自定义触发器内容；多选时提供该插槽会替换默认 Tag 和删除按钮。                                                |
| `node`        | `{ node: BingTreeSelectNode; selected: boolean; indeterminate: boolean; depth: number; expanded: boolean; matchRanges: { start: number; end: number }[] }` | 自定义节点文字区域，保留展开按钮与选择装饰；depth 从 0 开始。0.17.0 新增 matchRanges，UTF-16 范围的 end 不包含在片段中。 |
| `node-detail` | `{ node: BingTreeSelectNode; selected: boolean; indeterminate: boolean; depth: number; expanded: boolean }`                                                | 悬停/键盘高亮详情，aria-hidden=true，仅放补充展示内容；必需信息应另有可访问位置。                                |

## Events

| 事件                  | 参数                            | 说明                                                                                   |
| ------------------- | ----------------------------- | ------------------------------------------------------------------------------------ |
| `update:modelValue` | `BingTreeSelectModelValue`    | 选择、移除或清空时先发送；外部赋值及仅展开不会发送。多选输出按全树前序排序。                                               |
| `change`            | `BingTreeSelectChangePayload` | 随后发送 \{ value, node?, nodes \}；节点操作含 node，全选/清空不含 node，nodes 是新值对应的全部已选节点，含级联补齐的父节点。 |
| `clear`             | `无`                           | 仅触发器清除按钮发送，顺序 clear → update:modelValue → change。Tag 删除、清空当前搜索范围不发送 clear。           |
| `open`              | `无`                           | 请求打开时发送，早于动画和搜索框聚焦结束。                                                                |
| `close`             | `无`                           | 请求关闭时发送。单选操作顺序 update:modelValue → change → close；多选选择保持打开。                          |
| `expand`            | `BingTreeSelectExpandPayload` | 单个分支展开，载荷 \{ value, node, expandedValues \}；全部展开或默认值初始化不发送此事件。                       |
| `collapse`          | `BingTreeSelectExpandPayload` | 单个分支收起，载荷结构同 expand；收起父节点保留后代展开键，全部收起不发送此事件。                                         |

## 公开类型与键盘操作

| 公开类型或推导方式                                            | 定义或用途                                                                                              |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `BingTreeSelectValue`                                | `string \| number`                                                                                 |
| `BingTreeSelectModelValue`                           | `BingTreeSelectValue \| BingTreeSelectValue[] \| null`                                             |
| `BingTreeSelectSize`                                 | `'sm' \| 'md' \| 'lg'`                                                                             |
| `BingTreeSelectVirtualMode`                          | `boolean \| 'auto'`                                                                                |
| `BingTreeSelectSearchable`                           | `boolean \| 'auto'`                                                                                |
| `BingTreeSelectSmoothScroll`                         | `SmoothScrollValue`                                                                                |
| `BingTreeSelectNode`                                 | `上表节点结构。`                                                                                          |
| `BingTreeSelectProps`                                | `上表 41 项可选属性（含玻璃效果；typeahead/highlightMatches 自 0.17.0 起提供）。`                                      |
| `BingTreeSelectChangePayload`                        | `{ value: BingTreeSelectModelValue; node?: BingTreeSelectNode; nodes: BingTreeSelectNode[]; }`     |
| `BingTreeSelectExpandPayload`                        | `{ value: BingTreeSelectValue; node: BingTreeSelectNode; expandedValues: BingTreeSelectValue[]; }` |
| `BingTreeSelectEmits`                                | `上表 7 个事件。`                                                                                        |
| `NonNullable<BingTreeSelectProps['panelPlacement']>` | `'auto' \| 'top' \| 'bottom' \| 'left' \| 'right'；包入口不导出独立的 PanelPlacement 类型。`                    |
| `NonNullable<BingTreeSelectProps['panelAlign']>`     | `'start' \| 'middle' \| 'end'；包入口不导出独立的 PanelAlign 类型。`                                            |
| `NonNullable<BingTreeSelectNode['meta']>`            | `Record<string, string \| number \| boolean \| null \| undefined>；包入口不导出 NodeMetaValue。`           |
| `SmoothScrollValue`                                  | `boolean \| SmoothScrollOptions`                                                                   |
| `SmoothScrollOptions`                                | `下表面板滚动配置，可从包入口导入。`                                                                                |

类型从 @moubing/bing-ui 入口导入；弹层位置、对齐与 meta 类型使用上表推导方式。没有公开 openPanel、closePanel、focus 实例方法，没有受控 open/expandedValues、teleportTo 或数据请求属性。

触发器为 button，aria-haspopup="tree"。Enter、Space、上下键可以打开；上下键循环跳过不可选和禁用节点，Home/End 到首尾可选节点，Enter/Space 选择。触发器或面板根部收到右键时只展开当前分支，不自动进入第一个子节点；左键先收起当前分支，否则定位父节点。搜索输入框接管文字编辑，左右键不会操作树，Space 输入空格；Enter 选择，上下键与 Home/End 定位。

可搜索时打开后聚焦搜索框，斜杠键可重新聚焦；打开动画期间焦点若已被移到组件外，不会被拉回搜索框（0.12.3 起；此前版本会在随后两帧内抢回焦点）。搜索框内 Escape 先清除非空查询，再次 Escape 关闭并回到触发器。Tab 关闭并继续正常焦点顺序，没有独立的焦点陷阱。不可选父节点的 aria-disabled 表示不能选择，展开按钮仍可操作。

面板、侧栏和详情传送到 body。本页在缓存离开时卸载预览，清理浮层、监听与滚动任务，业务模型留在页面状态中。显式 id 控制触发器，新版内部 tree/node ID 已按实例隔离；Dialog 中的树面板参与浮层管理，Escape 先处理当前树面板。

## 面板滚动配置

| SmoothScrollOptions 字段 | 类型        | 默认值     | 说明              |
| ---------------------- | --------- | ------- | --------------- |
| `duration`             | `number`  | `400`   | 动画时长，毫秒；0 立即更新。 |
| `stepSize`             | `number`  | `100`   | 滚轮归一化步长。        |
| `pulseScale`           | `number`  | `4`     | 脉冲缓动强度。         |
| `accelerationDelta`    | `number`  | `50`    | 连续输入加速间隔，毫秒。    |
| `accelerationMax`      | `number`  | `3`     | 最大加速倍率。         |
| `keyboardStep`         | `number`  | `50`    | 键盘基础滚动距离。       |
| `keyboard`             | `boolean` | `false` | 内部滚动区的键盘插值。     |
| `smoothTouchpad`       | `boolean` | `false` | 是否对触控板应用插值。     |
| `respectReducedMotion` | `boolean` | `true`  | 减少动态效果偏好下关闭插值。  |

这些参数只控制面板内滚动。键盘节点定位即时完成，搜索、展开或数据变化会停止当前滚动任务，示例不需要额外安装滚动库。
